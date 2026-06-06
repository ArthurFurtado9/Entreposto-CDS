"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { addDays, isBefore } from "date-fns"
import { requireRole } from "@/lib/auth-utils"
import { z } from "zod"

const insumoUsoSchema = z.object({
  insumoId: z.string().min(1, "ID do insumo é obrigatório."),
  quantidade: z.number().positive("A quantidade do insumo deve ser maior que zero."),
})

const embalarLoteSchema = z.object({
  loteEntradaId: z.string().min(1, "Lote de entrada é obrigatório."),
  quantidade: z.number().int().positive("A quantidade de ovos deve ser maior que zero."),
  insumos: z.array(insumoUsoSchema),
})

const criarInsumoSchema = z.object({
  nome: z.string().min(2, "Nome do insumo deve ter pelo menos 2 caracteres."),
  unidade: z.string().min(1, "Unidade de medida é obrigatória."),
  estoqueMinimo: z.number().nonnegative("O estoque mínimo não pode ser negativo."),
  estoqueAtual: z.number().nonnegative("O estoque atual não pode ser negativo."),
})

export async function embalarLoteInterno(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = embalarLoteSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

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
      // Verifica estoque dos insumos antes de prosseguir
      for (const item of data.insumos) {
        const insumo = await tx.insumo.findUnique({ where: { id: item.insumoId } })
        if (!insumo || insumo.estoqueAtual < item.quantidade) {
          throw new Error(`Estoque insuficiente do insumo '${insumo?.nome || "desconhecido"}'`)
        }
      }

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
  } catch (error: any) {
    console.error("Erro ao embalar lote:", error)
    return { success: false, error: error.message || "Erro ao processar embalagem do lote." }
  }
}

export async function getInsumos() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const insumos = await prisma.insumo.findMany({
      orderBy: { nome: "asc" }
    })
    return { success: true, data: insumos }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar insumos:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar insumos." }
  }
}

export async function adicionarEstoqueInsumo(id: string, quantidade: number) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID inválido." }
    }
    if (quantidade <= 0) {
      return { success: false, error: "A quantidade a adicionar deve ser maior que zero." }
    }

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
  } catch (error: any) {
    console.error("Erro ao adicionar estoque:", error)
    return { success: false, error: error.message || "Falha ao adicionar estoque." }
  }
}

export async function consumirEstoqueInsumo(id: string, quantidade: number) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID inválido." }
    }
    if (quantidade <= 0) {
      return { success: false, error: "A quantidade a consumir deve ser maior que zero." }
    }

    // Verifica estoque disponível antes de decrementar
    const current = await prisma.insumo.findUnique({ where: { id } })
    if (!current || current.estoqueAtual < quantidade) {
      return { success: false, error: "Estoque insuficiente para consumo." }
    }

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
  } catch (error: any) {
    console.error("Erro ao consumir estoque:", error)
    return { success: false, error: error.message || "Falha ao consumir estoque." }
  }
}

export async function atualizarEstoqueInsumoExato(id: string, quantidade: number) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID inválido." }
    }
    if (quantidade < 0) {
      return { success: false, error: "O estoque atual não pode ser negativo." }
    }

    const insumo = await prisma.insumo.update({
      where: { id },
      data: {
        estoqueAtual: quantidade
      }
    })
    revalidatePath("/producao")
    return { success: true, data: insumo }
  } catch (error: any) {
    console.error("Erro ao atualizar estoque exato:", error)
    return { success: false, error: error.message || "Falha ao atualizar estoque." }
  }
}

export async function criarInsumo(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = criarInsumoSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data
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
  } catch (error: any) {
    console.error("Erro ao criar insumo:", error)
    return { success: false, error: error.message || "Falha ao criar insumo." }
  }
}
