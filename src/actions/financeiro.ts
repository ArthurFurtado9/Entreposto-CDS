"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { FinanceiroStatus } from "@prisma/client"

export async function getContasAPagar() {
  try {
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
  } catch (error) {
    console.error("Erro ao buscar contas a pagar:", error)
    return { success: false, error: "Falha ao buscar contas a pagar." }
  }
}

export async function darBaixaConta(id: string) {
  try {
    await prisma.financeiro.update({
      where: { id },
      data: {
        status: "PAGO",
        dataPagamento: new Date(),
      },
    })

    revalidatePath("/financeiro")
    return { success: true }
  } catch (error) {
    console.error("Erro ao dar baixa na conta:", error)
    return { success: false, error: "Falha ao processar o pagamento." }
  }
}
