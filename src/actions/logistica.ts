"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPedidosLogistica() {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        status: {
          in: ["PENDENTE", "SEPARACAO", "ENVIADO", "ENTREGUE"]
        }
      },
      include: {
        cliente: true,
        itens: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Calcular a quantidade total por pedido (somando os itens)
    const formatados = pedidos.map(p => {
      const qtdTotal = p.itens.reduce((acc, item) => acc + item.quantidade, 0)
      return {
        id: p.id,
        cliente: p.cliente.nome,
        qtd: qtdTotal,
        status: p.status,
        data: p.dataPedido.toISOString(),
      }
    })

    return { success: true, data: formatados }
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return { success: false, error: "Falha ao buscar pedidos." }
  }
}

export async function getLotesDisponiveis() {
  try {
    const lotes = await prisma.loteInterno.findMany({
      where: {
        estoqueDisponivel: { gt: 0 }
      },
      orderBy: {
        validadeSugerida: 'asc' // FIFO
      }
    })
    
    const formatados = lotes.map((l, index) => ({
      id: l.id,
      ovos: l.estoqueDisponivel,
      validade: l.validadeSugerida.toISOString(),
      status: index === 0 ? "FIFO" : "DISPONIVEL" // O primeiro é o FIFO, ou podemos ter logica mais avançada
    }))

    return { success: true, data: formatados }
  } catch (error) {
    console.error("Erro ao buscar lotes:", error)
    return { success: false, error: "Falha ao buscar lotes." }
  }
}

export async function iniciarCarregamento() {
  try {
    // Atualiza todos os pedidos em SEPARACAO para ENVIADO
    const atualizados = await prisma.pedido.updateMany({
      where: {
        status: "SEPARACAO"
      },
      data: {
        status: "ENVIADO"
      }
    })
    
    revalidatePath("/logistica")
    return { success: true, count: atualizados.count }
  } catch (error) {
    console.error("Erro ao iniciar carregamento:", error)
    return { success: false, error: "Falha ao iniciar carregamento." }
  }
}
