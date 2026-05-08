"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getFornecedores() {
  try {
    const fornecedores = await prisma.fornecedor.findMany({
      orderBy: { nome: "asc" },
    })
    return { success: true, data: fornecedores }
  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error)
    return { success: false, error: "Falha ao buscar fornecedores." }
  }
}

export async function criarFornecedor(data: { nome: string; contato?: string; email?: string }) {
  try {
    const fornecedor = await prisma.fornecedor.create({
      data: {
        nome: data.nome,
        contato: data.contato,
        email: data.email,
      },
    })
    revalidatePath("/fornecedores")
    revalidatePath("/recebimento")
    return { success: true, data: fornecedor }
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error)
    return { success: false, error: "Falha ao cadastrar fornecedor." }
  }
}

export async function registrarRecebimentoLote(data: {
  fornecedorId: string
  quantidadeOriginal: number
  validadeOriginal: Date
  valorBandeja: number
}) {
  try {
    const lote = await prisma.loteEntrada.create({
      data: {
        fornecedorId: data.fornecedorId,
        quantidadeOriginal: data.quantidadeOriginal,
        validadeOriginal: data.validadeOriginal,
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
    return { success: true, data: lote }
  } catch (error) {
    console.error("Erro ao registrar recebimento:", error)
    return { success: false, error: "Falha ao registrar recebimento de lote." }
  }
}

export async function atualizarFornecedor(id: string, data: { nome: string; contato?: string; email?: string }) {
  try {
    const fornecedor = await prisma.fornecedor.update({
      where: { id },
      data: {
        nome: data.nome,
        contato: data.contato,
        email: data.email,
      },
    })
    revalidatePath("/fornecedores")
    revalidatePath("/recebimento")
    return { success: true, data: fornecedor }
  } catch (error) {
    console.error("Erro ao atualizar fornecedor:", error)
    return { success: false, error: "Falha ao atualizar fornecedor." }
  }
}

export async function cadastrarInsumosPreEstabelecidos() {
  try {
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
  } catch (error) {
    console.error("Erro ao cadastrar insumos base:", error)
    return { success: false, error: "Falha ao cadastrar insumos." }
  }
}
