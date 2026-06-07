"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireRole, requireAuth } from "@/lib/auth-utils"
import { z } from "zod"

const fornecedorSchema = z.object({
  nome: z.string().min(2, "Nome do fornecedor deve ter pelo menos 2 caracteres."),
  cnpj: z.string().optional().nullable().or(z.literal("")),
  contato: z.string().optional().nullable().or(z.literal("")),
  email: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email("Formato de e-mail inválido.").nullable().optional()
  ),
  cep: z.string().optional().nullable().or(z.literal("")),
  rua: z.string().optional().nullable().or(z.literal("")),
  bairro: z.string().optional().nullable().or(z.literal("")),
  cidade: z.string().optional().nullable().or(z.literal("")),
  estado: z.string().optional().nullable().or(z.literal("")),
})

const loteRecebimentoSchema = z.object({
  fornecedorId: z.string().min(1, "Fornecedor é obrigatório."),
  quantidadeOriginal: z.number().int().positive("A quantidade deve ser maior que zero."),
  validadeOriginal: z.preprocess((val) => {
    if (typeof val === "string") {
      const d = new Date(val)
      if (!isNaN(d.getTime())) return d
    }
    if (val instanceof Date) return val
    return val
  }, z.date("Data de validade inválida.")),
  valorBandeja: z.number().positive("O valor da bandeja deve ser maior que zero."),
})

export async function getFornecedores() {
  try {
    await requireAuth()
    const fornecedores = await prisma.fornecedor.findMany({
      orderBy: { nome: "asc" },
    })
    return { success: true, data: fornecedores }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar fornecedores:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar fornecedores." }
  }
}

export async function criarFornecedor(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = fornecedorSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data
    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null,
        contato: data.contato || null,
        email: data.email || null,
        cep: data.cep || null,
        rua: data.rua || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
      },
    })
    revalidatePath("/fornecedores")
    revalidatePath("/recebimento")
    return { success: true, data: fornecedor }
  } catch (error: any) {
    console.error("Erro ao criar fornecedor:", error)
    return { success: false, error: "Falha ao cadastrar fornecedor. E-mail ou CNPJ já cadastrados." }
  }
}

export async function registrarRecebimentoLote(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = loteRecebimentoSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

    const lote = await prisma.loteEntrada.create({
      data: {
        fornecedorId: data.fornecedorId,
        quantidadeOriginal: data.quantidadeOriginal,
        validadeOriginal: data.validadeOriginal,
        dataRecebimento: data.validadeOriginal,
        quantidadeAproveitada: 0,
        rendimentoPorcentagem: 0,
        status: "AGUARDANDO_TRIAGEM",
      },
    })
    
    // Calculo: quantidadeOvos / 30 * valorDaBandeja
    const totalPagar = (data.quantidadeOriginal / 30) * data.valorBandeja

    const vencimento = new Date()
    vencimento.setDate(vencimento.getDate() + 15) // Vencimento padrão 15 dias

    await prisma.financeiro.create({
      data: {
        tipo: "PAGAR",
        valor: totalPagar,
        status: "PENDENTE",
        dataVencimento: vencimento,
        loteEntradaId: lote.id,
      }
    })

    revalidatePath("/recebimento")
    revalidatePath("/ovoscopia")
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")
    return { success: true, data: { id: lote.id } }
  } catch (error: any) {
    console.error("Erro ao registrar recebimento:", error)
    return { success: false, error: error.message || "Falha ao registrar recebimento de lote." }
  }
}

export async function editarRecebimentoLote(id: string, rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = loteRecebimentoSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

    await prisma.$transaction(async (tx) => {
      // 1. Busca o lote
      const lote = await tx.loteEntrada.findUnique({
        where: { id },
        include: { financeiro: true }
      })

      if (!lote) {
        throw new Error("Lote não encontrado.")
      }

      if (lote.status !== "AGUARDANDO_TRIAGEM" && lote.status !== "RECEBIDO") {
        throw new Error("Apenas lotes aguardando triagem/ovoscopia podem ser editados.")
      }

      // 2. Atualiza o lote
      await tx.loteEntrada.update({
        where: { id },
        data: {
          fornecedorId: data.fornecedorId,
          quantidadeOriginal: data.quantidadeOriginal,
          validadeOriginal: data.validadeOriginal,
          dataRecebimento: data.validadeOriginal,
        }
      })

      // 3. Atualiza o financeiro associado
      if (lote.financeiro) {
        const totalPagar = (data.quantidadeOriginal / 30) * data.valorBandeja
        await tx.financeiro.update({
          where: { id: lote.financeiro.id },
          data: {
            valor: totalPagar
          }
        })
      }
    })

    revalidatePath("/recebimento")
    revalidatePath("/ovoscopia")
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao editar recebimento de lote:", error)
    return { success: false, error: error.message || "Falha ao editar lote." }
  }
}

export async function atualizarFornecedor(id: string, rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID do fornecedor inválido." }
    }

    const validated = fornecedorSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data
    const fornecedor = await prisma.fornecedor.update({
      where: { id },
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null,
        contato: data.contato || null,
        email: data.email || null,
        cep: data.cep || null,
        rua: data.rua || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
      },
    })
    revalidatePath("/fornecedores")
    revalidatePath("/recebimento")
    return { success: true, data: fornecedor }
  } catch (error: any) {
    console.error("Erro ao atualizar fornecedor:", error)
    return { success: false, error: "Falha ao atualizar fornecedor." }
  }
}

export async function cadastrarInsumosPreEstabelecidos() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const insumos = [
      { nome: "Embalagens de 12 ovos", unidade: "Unidade", estoqueAtual: 0, estoqueMinimo: 100 },
      { nome: "Tampa de 15", unidade: "Unidade", estoqueAtual: 0, estoqueMinimo: 100 },
      { nome: "Papel filme", unidade: "Rolo", estoqueAtual: 0, estoqueMinimo: 10 },
    ]

    for (const insumo of insumos) {
      // Verifica se já existe pelo nome para não duplicar
      const existente = await prisma.insumo.findFirst({ where: { nome: insumo.nome } })
      if (!existente) {
        await prisma.insumo.create({ data: insumo })
      }
    }

    revalidatePath("/fornecedores")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao cadastrar insumos base:", error)
    return { success: false, error: "Falha ao cadastrar insumos." }
  }
}

export async function excluirFornecedor(id: string) {
  try {
    await requireAdmin()

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID inválido." }
    }

    await prisma.fornecedor.delete({ where: { id } })
    revalidatePath("/fornecedores")
    revalidatePath("/recebimento")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao excluir fornecedor:", error)
    return { success: false, error: "Falha ao excluir fornecedor. Verifique se existem lotes atrelados a ele." }
  }
}

export async function getFornecedoresStats() {
  try {
    await requireAuth()

    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

    const fornecedores = await prisma.fornecedor.findMany({
      orderBy: { nome: "asc" },
      include: {
        lotes: {
          where: {
            dataRecebimento: { gte: inicioMes }
          },
          select: {
            quantidadeOriginal: true,
            quantidadeAproveitada: true
          }
        }
      }
    })

    const stats = fornecedores.map(f => {
      const totalOriginal = f.lotes.reduce((acc, l) => acc + l.quantidadeOriginal, 0)
      const totalAproveitada = f.lotes.reduce((acc, l) => acc + l.quantidadeAproveitada, 0)
      const rendimentoMensal = totalOriginal > 0 ? (totalAproveitada / totalOriginal) * 100 : 0

      return {
        id: f.id,
        nome: f.nome,
        contato: f.contato,
        email: f.email,
        createdAt: f.createdAt.toISOString(),
        totalRecebidoMes: totalOriginal,
        rendimentoMedioMes: rendimentoMensal
      }
    })

    return { success: true, data: stats }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar estatísticas de fornecedores:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar estatísticas de fornecedores." }
  }
}

export async function getUltimosLotesRecebidos() {
  try {
    await requireAuth()

    const lotes = await prisma.loteEntrada.findMany({
      take: 10,
      orderBy: { dataRecebimento: "desc" },
      include: {
        fornecedor: {
          select: {
            nome: true
          }
        },
        financeiro: {
          select: {
            valor: true
          }
        }
      }
    })

    return { success: true, data: lotes }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar últimos lotes recebidos:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar últimos lotes." }
  }
}

export async function getRecebimentoResumoDiario() {
  try {
    await requireAuth()

    const hoje = new Date()
    const hojeInicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 0, 0, 0, 0)
    const hojeFim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59, 999)

    // 1. Ovos Recebidos Hoje e Cargas Descarregadas
    const lotesHoje = await prisma.loteEntrada.findMany({
      where: {
        dataRecebimento: {
          gte: hojeInicio,
          lte: hojeFim,
        },
      },
      select: {
        quantidadeOriginal: true,
      },
    })

    const ovosRecebidosHoje = lotesHoje.reduce((acc, curr) => acc + curr.quantidadeOriginal, 0)
    const cargasHoje = lotesHoje.length

    // 3. Lotes pendentes na Ovoscopia (AGUARDANDO_TRIAGEM)
    const lotesPendentesTriagem = await prisma.loteEntrada.count({
      where: {
        status: "AGUARDANDO_TRIAGEM",
      },
    })

    return {
      success: true,
      data: {
        ovosRecebidosHoje,
        cargasHoje,
        lotesPendentesTriagem,
      },
    }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar resumo diário de recebimento:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar resumo diário." }
  }
}

export async function estornarRecebimentoLote(id: string) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID inválido." }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Busca o lote de entrada
      const lote = await tx.loteEntrada.findUnique({
        where: { id },
        select: { status: true }
      })

      if (!lote) {
        throw new Error("Lote não encontrado.")
      }

      if (lote.status !== "AGUARDANDO_TRIAGEM") {
        throw new Error("Apenas lotes aguardando triagem podem ser estornados/excluídos.")
      }

      // 2. Deleta registro financeiro a pagar atrelado
      await tx.financeiro.deleteMany({
        where: { loteEntradaId: id }
      })

      // 3. Deleta o lote de entrada
      await tx.loteEntrada.delete({
        where: { id }
      })
    })

    revalidatePath("/recebimento")
    revalidatePath("/ovoscopia")
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error: any) {
    console.error("Erro ao estornar lote recebido:", error)
    return { success: false, error: error.message || "Falha ao estornar lote de entrada." }
  }
}

export async function getFornecedoresGraficosData() {
  try {
    await requireAuth()

    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    
    const trintaDiasAtras = new Date()
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)

    // 1. Volume mensal (mês corrente) por fornecedor
    const fornecedoresVolume = await prisma.fornecedor.findMany({
      select: {
        id: true,
        nome: true,
        lotes: {
          where: {
            dataRecebimento: { gte: inicioMes }
          },
          select: {
            quantidadeOriginal: true
          }
        }
      }
    })

    const volumeMensal = fornecedoresVolume.map(f => {
      const totalOriginal = f.lotes.reduce((acc, l) => acc + l.quantidadeOriginal, 0)
      return {
        name: f.nome,
        value: totalOriginal
      }
    }).filter(item => item.value > 0)

    // 2. Histórico de refugo (perdas %) de lotes triados nos últimos 30 dias
    const lotesTriados = await prisma.loteEntrada.findMany({
      where: {
        status: "TRIADO",
        dataRecebimento: { gte: trintaDiasAtras }
      },
      include: {
        fornecedor: {
          select: {
            nome: true
          }
        }
      },
      orderBy: {
        dataRecebimento: "asc"
      }
    })

    // Datas únicas no formato DD/MM
    const datasUnicas = Array.from(
      new Set(
        lotesTriados.map(l => 
          l.dataRecebimento.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        )
      )
    )

    const nomesFornecedores = Array.from(new Set(lotesTriados.map(l => l.fornecedor.nome)))

    const historicoRefugo = datasUnicas.map(dateStr => {
      const point: { date: string; [key: string]: any } = { date: dateStr }

      const lotesDaData = lotesTriados.filter(l => 
        l.dataRecebimento.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) === dateStr
      )

      for (const nome of nomesFornecedores) {
        const lotesDoFornecedor = lotesDaData.filter(l => l.fornecedor.nome === nome)
        if (lotesDoFornecedor.length > 0) {
          const totalOriginal = lotesDoFornecedor.reduce((acc, l) => acc + l.quantidadeOriginal, 0)
          const totalPerdas = lotesDoFornecedor.reduce((acc, l) => acc + (l.quantidadeTrincados + l.quantidadeQuebrados + l.quantidadeDescarte), 0)
          const taxaRefugo = totalOriginal > 0 ? (totalPerdas / totalOriginal) * 100 : 0
          point[nome] = Number(taxaRefugo.toFixed(1))
        }
      }

      return point
    })

    return {
      success: true,
      data: {
        volumeMensal,
        historicoRefugo,
        nomesFornecedores
      }
    }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar dados gráficos de fornecedores:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar dados gráficos de fornecedores." }
  }
}



