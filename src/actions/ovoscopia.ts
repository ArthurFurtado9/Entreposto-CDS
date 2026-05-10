"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-utils"

export async function getLotesAguardandoTriagem() {
  try {
    const lotes = await prisma.loteEntrada.findMany({
      where: { status: "AGUARDANDO_TRIAGEM" },
      include: { fornecedor: true },
      orderBy: { dataRecebimento: "asc" }
    })
    return { success: true, data: lotes }
  } catch (error) {
    console.error("Erro ao buscar lotes:", error)
    return { success: false, error: "Falha ao buscar lotes para triagem." }
  }
}

export async function finalizarTriagem(data: {
  loteId: string
  quebras: {
    trincados: number
    quebrados: number
    descarte: number
  }
}) {
  try {
    const lote = await prisma.loteEntrada.findUnique({
      where: { id: data.loteId }
    })

    if (!lote) return { success: false, error: "Lote não encontrado." }

    const { trincados, quebrados, descarte } = data.quebras
    const quantidadeAproveitada = lote.quantidadeOriginal - (trincados + quebrados + descarte)
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
  } catch (error) {
    console.error("Erro ao finalizar triagem:", error)
    return { success: false, error: "Falha ao processar triagem do lote." }
  }
}

export async function getLotesTriados() {
  try {
    const lotes = await prisma.loteEntrada.findMany({
      where: { status: "TRIADO" },
      include: { fornecedor: true },
      orderBy: { dataRecebimento: "desc" }
    })
    return { success: true, data: lotes }
  } catch (error) {
    console.error("Erro ao buscar lotes triados:", error)
    return { success: false, error: "Falha ao buscar lotes triados." }
  }
}

export async function excluirLote(id: string) {
  try {
    await requireAdmin()
    
    // Deletar financeiro atrelado ao LoteEntrada
    await prisma.financeiro.deleteMany({ where: { loteEntradaId: id } })
    
    // Deletar usos de insumos atrelados ao LoteInterno
    const lotesInternos = await prisma.loteInterno.findMany({ where: { loteEntradaId: id } })
    for (const li of lotesInternos) {
       await prisma.usoInsumo.deleteMany({ where: { loteInternoId: li.id } })
       await prisma.itemPedido.deleteMany({ where: { loteInternoId: li.id } }) // cuidado: isso apaga itens de pedidos!
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
  } catch (error) {
    console.error("Erro ao excluir lote:", error)
    return { success: false, error: "Falha ao excluir lote. Verifique dependências (pedidos)." }
  }
}
