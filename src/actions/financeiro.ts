"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth-utils"

export async function getContasAPagar() {
  try {
    await requireRole(["ADMIN", "FINANCEIRO"])

    const contas = await prisma.financeiro.findMany({
      where: {
        tipo: "PAGAR",
      },
      include: {
        loteEntrada: {
          include: {
            fornecedor: true,
          },
        },
      },
      orderBy: {
        dataVencimento: "asc",
      },
    })

    return { success: true, data: contas }
  } catch (error: any) {
    console.error("Erro ao buscar contas a pagar:", error)
    return { success: false, error: error.message || "Falha ao buscar contas a pagar." }
  }
}

export async function darBaixaConta(id: string) {
  try {
    await requireRole(["ADMIN", "FINANCEIRO"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID de conta inválido." }
    }

    await prisma.financeiro.update({
      where: { id },
      data: {
        status: "PAGO",
        dataPagamento: new Date(),
      },
    })

    revalidatePath("/financeiro")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao dar baixa na conta:", error)
    return { success: false, error: error.message || "Falha ao processar o pagamento." }
  }
}

export async function getContasAReceber() {
  try {
    await requireRole(["ADMIN", "FINANCEIRO"])

    const contas = await prisma.financeiro.findMany({
      where: {
        tipo: "RECEBER",
      },
      include: {
        pedido: {
          include: {
            cliente: true,
          },
        },
      },
      orderBy: {
        dataVencimento: "asc",
      },
    })

    return { success: true, data: contas }
  } catch (error: any) {
    console.error("Erro ao buscar contas a receber:", error)
    return { success: false, error: error.message || "Falha ao buscar contas a receber." }
  }
}

export async function excluirConta(id: string) {
  try {
    await requireRole(["ADMIN"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID de conta inválido." }
    }

    await prisma.financeiro.delete({
      where: { id },
    })

    revalidatePath("/financeiro")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao excluir conta:", error)
    return { success: false, error: error.message || "Falha ao excluir a conta." }
  }
}

export async function estornarConta(id: string) {
  try {
    await requireRole(["ADMIN", "FINANCEIRO"])

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID de conta inválido." }
    }

    await prisma.financeiro.update({
      where: { id },
      data: {
        status: "PENDENTE",
        dataPagamento: null,
      },
    })

    revalidatePath("/financeiro")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao estornar conta:", error)
    return { success: false, error: error.message || "Falha ao estornar o pagamento." }
  }
}


