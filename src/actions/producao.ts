"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { addDays, isBefore } from "date-fns"

interface EmbalarLoteInput {
  loteEntradaId: string
  quantidade: number
  insumos: {
    insumoId: string
    quantidade: number
  }[]
}

export async function embalarLoteInterno(data: EmbalarLoteInput) {
  try {
    const loteEntrada = await prisma.loteEntrada.findUnique({
      where: { id: data.loteEntradaId }
    })

    if (!loteEntrada) return { success: false, error: "Lote de entrada não encontrado." }

    const hoje = new Date()
    const validadeSugerida30Dias = addDays(hoje, 30)
    const validadeFinal = isBefore(validadeSugerida30Dias, loteEntrada.validadeOriginal)
      ? validadeSugerida30Dias
      : loteEntrada.validadeOriginal

    const result = await prisma.$transaction(async (tx) => {
      const loteInterno = await tx.loteInterno.create({
        data: {
          loteEntradaId: data.loteEntradaId,
          quantidadeOvos: data.quantidade,
          estoqueDisponivel: data.quantidade,
          validadeSugerida: validadeFinal,
          insumosUsados: {
            create: data.insumos.map(i => ({
              insumoId: i.insumoId,
              quantidade: i.quantidade
            }))
          }
        }
      })

      for (const item of data.insumos) {
        await tx.insumo.update({
          where: { id: item.insumoId },
          data: {
            estoqueAtual: {
              decrement: item.quantidade
            }
          }
        })
      }

      return loteInterno
    })

    revalidatePath("/producao")
    revalidatePath("/dashboard")

    return { success: true, id: result.id }
  } catch (error) {
    console.error("Erro ao embalar lote:", error)
    return { success: false, error: "Erro ao processar embalagem do lote." }
  }
}

export async function getInsumos() {
  try {
    const insumos = await prisma.insumo.findMany({
      orderBy: { nome: "asc" }
    })
    return { success: true, data: insumos }
  } catch (error) {
    console.error("Erro ao buscar insumos:", error)
    return { success: false, error: "Falha ao buscar insumos." }
  }
}

export async function adicionarEstoqueInsumo(id: string, quantidade: number) {
  try {
    const insumo = await prisma.insumo.update({
      where: { id },
      data: {
        estoqueAtual: {
          increment: quantidade
        }
      }
    })
    revalidatePath("/producao")
    return { success: true, data: insumo }
  } catch (error) {
    console.error("Erro ao adicionar estoque:", error)
    return { success: false, error: "Falha ao adicionar estoque." }
  }
}

export async function consumirEstoqueInsumo(id: string, quantidade: number) {
  try {
    const insumo = await prisma.insumo.update({
      where: { id },
      data: {
        estoqueAtual: {
          decrement: quantidade
        }
      }
    })
    revalidatePath("/producao")
    return { success: true, data: insumo }
  } catch (error) {
    console.error("Erro ao consumir estoque:", error)
    return { success: false, error: "Falha ao consumir estoque." }
  }
}

export async function atualizarEstoqueInsumoExato(id: string, quantidade: number) {
  try {
    const insumo = await prisma.insumo.update({
      where: { id },
      data: {
        estoqueAtual: quantidade
      }
    })
    revalidatePath("/producao")
    return { success: true, data: insumo }
  } catch (error) {
    console.error("Erro ao atualizar estoque exato:", error)
    return { success: false, error: "Falha ao atualizar estoque." }
  }
}

export async function criarInsumo(data: { nome: string; unidade: string; estoqueMinimo: number; estoqueAtual: number }) {
  try {
    const insumo = await prisma.insumo.create({
      data: {
        nome: data.nome,
        unidade: data.unidade,
        estoqueMinimo: data.estoqueMinimo,
        estoqueAtual: data.estoqueAtual
      }
    })
    revalidatePath("/producao")
    return { success: true, data: insumo }
  } catch (error) {
    console.error("Erro ao criar insumo:", error)
    return { success: false, error: "Falha ao criar insumo." }
  }
}
