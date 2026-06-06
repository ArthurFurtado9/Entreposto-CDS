"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireRole } from "@/lib/auth-utils"
import { z } from "zod"

const finalizarTriagemSchema = z.object({
  loteId: z.string().min(1, "Lote ID é obrigatório."),
  quebras: z.object({
    trincados: z.number().int().nonnegative("A quantidade de trincados não pode ser negativa."),
    quebrados: z.number().int().nonnegative("A quantidade de quebrados não pode ser negativa."),
    descarte: z.number().int().nonnegative("A quantidade de descarte não pode ser negativa."),
  })
})

export async function getLotesAguardandoTriagem() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const lotes = await prisma.loteEntrada.findMany({
      where: { status: "AGUARDANDO_TRIAGEM" },
      include: { fornecedor: true },
      orderBy: { dataRecebimento: "asc" }
    })
    return { success: true, data: lotes }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar lotes:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar lotes para triagem." }
  }
}

export async function finalizarTriagem(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = finalizarTriagemSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

    const lote = await prisma.loteEntrada.findUnique({
      where: { id: data.loteId }
    })

    if (!lote) return { success: false, error: "Lote não encontrado." }

    const { trincados, quebrados, descarte } = data.quebras
    const totalQuebras = trincados + quebrados + descarte

    // Validação lógica crucial de limites
    if (totalQuebras > lote.quantidadeOriginal) {
      return { success: false, error: "A quantidade de quebras não pode ser maior que a quantidade original do lote." }
    }

    const quantidadeAproveitada = lote.quantidadeOriginal - totalQuebras
    const rendimento = (quantidadeAproveitada / lote.quantidadeOriginal) * 100

    const result = await prisma.$transaction(async (tx) => {
      // 1. Atualiza o lote de entrada
      const updatedLote = await tx.loteEntrada.update({
        where: { id: data.loteId },
        data: {
          quantidadeTrincados: trincados,
          quantidadeQuebrados: quebrados,
          quantidadeDescarte: descarte,
          quantidadeAproveitada,
          rendimentoPorcentagem: rendimento,
          status: "TRIADO"
        }
      })

      // 2. Gera o Lote Interno
      const validadeSugerida = new Date(lote.validadeOriginal)
      const validade30Dias = new Date()
      validade30Dias.setDate(validade30Dias.getDate() + 30)
      
      const validadeFinal = validadeSugerida < validade30Dias ? validadeSugerida : validade30Dias

      await tx.loteInterno.create({
        data: {
          loteEntradaId: lote.id,
          quantidadeOvos: quantidadeAproveitada,
          estoqueDisponivel: quantidadeAproveitada,
          validadeSugerida: validadeFinal,
          dataEmbalagem: new Date()
        }
      })

      return updatedLote
    })

    revalidatePath("/ovoscopia")
    revalidatePath("/producao")
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")

    return { success: true, data: result }
  } catch (error: any) {
    console.error("Erro ao finalizar triagem:", error)
    return { success: false, error: error.message || "Falha ao processar triagem do lote." }
  }
}

export async function getLotesTriados() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const lotes = await prisma.loteEntrada.findMany({
      where: { status: "TRIADO" },
      include: { fornecedor: true },
      orderBy: { dataRecebimento: "desc" }
    })
    return { success: true, data: lotes }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar lotes triados:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar lotes triados." }
  }
}

export async function excluirLote(id: string) {
  try {
    await requireAdmin()

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID inválido." }
    }
    
    // Deletar financeiro atrelado ao LoteEntrada
    await prisma.financeiro.deleteMany({ where: { loteEntradaId: id } })
    
    // Deletar usos de insumos atrelados ao LoteInterno
    const lotesInternos = await prisma.loteInterno.findMany({ where: { loteEntradaId: id } })
    for (const li of lotesInternos) {
       await prisma.usoInsumo.deleteMany({ where: { loteInternoId: li.id } })
       await prisma.itemPedido.deleteMany({ where: { loteInternoId: li.id } })
    }
    
    // Deletar LoteInterno
    await prisma.loteInterno.deleteMany({ where: { loteEntradaId: id } })
    
    // Deletar LoteEntrada
    await prisma.loteEntrada.delete({ where: { id } })
    
    revalidatePath("/ovoscopia")
    revalidatePath("/producao")
    revalidatePath("/financeiro")
    revalidatePath("/logistica")
    
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao excluir lote:", error)
    return { success: false, error: error.message || "Falha ao excluir lote. Verifique dependências." }
  }
}

const editarTriagemSchema = z.object({
  loteId: z.string().min(1, "Lote ID é obrigatório."),
  quebras: z.object({
    trincados: z.number().int().nonnegative("A quantidade de trincados não pode ser negativa."),
    quebrados: z.number().int().nonnegative("A quantidade de quebrados não pode ser negativa."),
    descarte: z.number().int().nonnegative("A quantidade de descarte não pode ser negativa."),
  })
})

export async function editarTriagem(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = editarTriagemSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

    const result = await prisma.$transaction(async (tx) => {
      // 1. Busca o lote de entrada
      const lote = await tx.loteEntrada.findUnique({
        where: { id: data.loteId },
        include: { lotesInternos: true }
      })

      if (!lote) throw new Error("Lote não encontrado.")
      if (lote.status !== "TRIADO") throw new Error("Apenas lotes triados podem ser editados.")

      const { trincados, quebrados, descarte } = data.quebras
      const totalQuebras = trincados + quebrados + descarte

      if (totalQuebras > lote.quantidadeOriginal) {
        throw new Error("A quantidade de quebras não pode ser maior que a quantidade original do lote.")
      }

      const novaQuantidadeAproveitada = lote.quantidadeOriginal - totalQuebras
      const novoRendimento = (novaQuantidadeAproveitada / lote.quantidadeOriginal) * 100

      // 2. Busca o lote interno correspondente e ajusta o estoque
      const loteInterno = lote.lotesInternos[0]
      if (loteInterno) {
        const ovosVendidos = loteInterno.quantidadeOvos - loteInterno.estoqueDisponivel
        const novoEstoqueDisponivel = novaQuantidadeAproveitada - ovosVendidos

        if (novoEstoqueDisponivel < 0) {
          throw new Error(`Não é possível reduzir a quantidade aproveitada para ${novaQuantidadeAproveitada} porque ${ovosVendidos} ovos deste lote já foram vendidos ou reservados.`)
        }

        await tx.loteInterno.update({
          where: { id: loteInterno.id },
          data: {
            quantidadeOvos: novaQuantidadeAproveitada,
            estoqueDisponivel: novoEstoqueDisponivel
          }
        })
      }

      // 3. Atualiza o lote de entrada
      const updatedLote = await tx.loteEntrada.update({
        where: { id: data.loteId },
        data: {
          quantidadeTrincados: trincados,
          quantidadeQuebrados: quebrados,
          quantidadeDescarte: descarte,
          quantidadeAproveitada: novaQuantidadeAproveitada,
          rendimentoPorcentagem: novoRendimento
        }
      })

      return updatedLote
    })

    revalidatePath("/ovoscopia")
    revalidatePath("/producao")
    revalidatePath("/financeiro")
    revalidatePath("/dashboard")

    return { success: true, data: result }
  } catch (error: any) {
    console.error("Erro ao editar triagem:", error)
    return { success: false, error: error.message || "Falha ao editar triagem do lote." }
  }
}

