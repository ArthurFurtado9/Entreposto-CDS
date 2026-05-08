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

export async function getClientes() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true }
    })
    return { success: true, data: clientes }
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return { success: false, error: "Falha ao buscar clientes." }
  }
}

interface ItemCarregamento {
  tipo: '6' | '12' | '15'
  quantidadeBandejas: number
  precoBandeja: number
}

interface RegistrarCarregamentoInput {
  loteInternoId: string
  nomeCliente: string
  itens: ItemCarregamento[]
  valorTotal: number
}

export async function registrarCarregamento(data: RegistrarCarregamentoInput) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Busca ou cria o cliente
      let cliente = await tx.cliente.findFirst({
        where: { nome: data.nomeCliente }
      })

      if (!cliente) {
        cliente = await tx.cliente.create({
          data: { nome: data.nomeCliente }
        })
      }

      // 2. Cria o pedido
      const pedido = await tx.pedido.create({
        data: {
          clienteId: cliente.id,
          status: "ENVIADO",
          dataPedido: new Date()
        }
      })

      // 3. Calcula total de ovos e cria item do pedido (relacionando com Lote)
      const totalOvos = data.itens.reduce((acc, item) => acc + (item.quantidadeBandejas * parseInt(item.tipo)), 0)

      if (totalOvos > 0) {
        await tx.itemPedido.create({
          data: {
            pedidoId: pedido.id,
            loteInternoId: data.loteInternoId,
            quantidade: totalOvos
          }
        })

        // 4. Desconta do estoque do Lote Interno
        await tx.loteInterno.update({
          where: { id: data.loteInternoId },
          data: {
            estoqueDisponivel: {
              decrement: totalOvos
            }
          }
        })
      }

      // 5. Gera a Conta a Receber no Financeiro
      const validade = new Date()
      validade.setDate(validade.getDate() + 30) // Validade 30 dias

      await tx.financeiro.create({
        data: {
          tipo: "RECEBER",
          valor: data.valorTotal,
          status: "PENDENTE",
          dataVencimento: validade,
          pedidoId: pedido.id
        }
      })

      // 6. Tentar descontar insumos (Bônus aprovado no plano)
      for (const item of data.itens) {
        if (item.quantidadeBandejas > 0) {
           let termo = ""
           if (item.tipo === '12') termo = "12 ovos"
           if (item.tipo === '15') termo = "Tampa de 15"
           
           if (termo) {
             const insumo = await tx.insumo.findFirst({
               where: { nome: { contains: termo } }
             })
             if (insumo) {
               await tx.insumo.update({
                 where: { id: insumo.id },
                 data: { estoqueAtual: { decrement: item.quantidadeBandejas } }
               })
             }
           }
        }
      }

      return pedido
    })

    revalidatePath("/logistica")
    revalidatePath("/financeiro")
    revalidatePath("/producao")
    return { success: true, data: result }
  } catch (error) {
    console.error("Erro ao registrar carregamento:", error)
    return { success: false, error: "Falha ao registrar carregamento e gerar faturamento." }
  }
}

export async function criarCliente(data: { nome: string; cnpj: string }) {
  try {
    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null
      }
    })
    revalidatePath("/logistica")
    return { success: true, data: cliente }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return { success: false, error: "Falha ao criar cliente." }
  }
}

