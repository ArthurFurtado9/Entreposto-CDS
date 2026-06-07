"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireRole } from "@/lib/auth-utils"
import { z } from "zod"

const itemCarregamentoSchema = z.object({
  tipo: z.enum(['6', '12', '15']),
  quantidadeBandejas: z.number().int().nonnegative("A quantidade de bandejas não pode ser negativa."),
  precoBandeja: z.number().nonnegative("O preço da bandeja não pode ser negativo."),
})

const registrarCarregamentoSchema = z.object({
  loteIds: z.array(z.string()).min(1, "Deve selecionar pelo menos um lote interno."),
  nomeCliente: z.string().min(1, "Nome do cliente é obrigatório."),
  itens: z.array(itemCarregamentoSchema).min(1, "Deve carregar pelo menos um item."),
  valorTotal: z.number().nonnegative("O valor total não pode ser negativo."),
})

const criarClienteSchema = z.object({
  nome: z.string().min(2, "Nome do cliente deve ter pelo menos 2 caracteres."),
  cnpj: z.string().optional().nullable().or(z.literal("")),
})

export async function getPedidosLogistica() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

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
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar pedidos:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar pedidos." }
  }
}

export async function getLotesDisponiveis() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

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
      status: index === 0 ? "FIFO" : "DISPONIVEL"
    }))

    return { success: true, data: formatados }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar lotes:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar lotes." }
  }
}

export async function getClientes() {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true }
    })
    return { success: true, data: clientes }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar clientes:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar clientes." }
  }
}

export async function registrarCarregamento(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = registrarCarregamentoSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data

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

      // 3. Calcula total de ovos e valida correspondência com os lotes
      const totalOvos = data.itens.reduce((acc, item) => acc + (item.quantidadeBandejas * parseInt(item.tipo)), 0)

      if (totalOvos <= 0) {
        throw new Error("Quantidade total de ovos deve ser maior que zero.")
      }

      // Buscar os lotes selecionados e ordenar por validade (FIFO)
      const lotesInternos = await tx.loteInterno.findMany({
        where: {
          id: {
            in: data.loteIds
          }
        },
        orderBy: {
          validadeSugerida: "asc"
        }
      })

      if (lotesInternos.length !== data.loteIds.length) {
        throw new Error("Um ou mais lotes internos selecionados não foram encontrados.")
      }

      const estoqueTotalDisponivel = lotesInternos.reduce((acc, l) => acc + l.estoqueDisponivel, 0)
      if (estoqueTotalDisponivel < totalOvos) {
        throw new Error(`Estoque insuficiente nos lotes selecionados. Disponível: ${estoqueTotalDisponivel}, Solicitado: ${totalOvos}`)
      }

      // Processar e consumir os lotes sequencialmente
      let restanteAAlocar = totalOvos
      for (const lote of lotesInternos) {
        if (restanteAAlocar <= 0) break

        const consumo = Math.min(lote.estoqueDisponivel, restanteAAlocar)
        if (consumo > 0) {
          // Criar item do pedido para este lote
          await tx.itemPedido.create({
            data: {
              pedidoId: pedido.id,
              loteInternoId: lote.id,
              quantidade: consumo
            }
          })

          // Descontar do estoque do Lote Interno
          await tx.loteInterno.update({
            where: { id: lote.id },
            data: {
              estoqueDisponivel: {
                decrement: consumo
              }
            }
          })

          restanteAAlocar -= consumo
        }
      }

      if (restanteAAlocar > 0) {
        throw new Error("Falha inesperada ao alocar a quantidade de ovos nos lotes.")
      }

      // 4. Inserir itens de venda
      for (const item of data.itens) {
        await tx.itemVenda.create({
          data: {
            pedidoId: pedido.id,
            tipoEmbalagem: item.tipo,
            quantidadeBandejas: item.quantidadeBandejas,
            precoBandeja: item.precoBandeja
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

      // 6. Tentar descontar insumos
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
               // Verifica se há insumo suficiente antes de decrementar
               if (insumo.estoqueAtual < item.quantidadeBandejas) {
                 throw new Error(`Estoque insuficiente do insumo '${insumo.nome}'. Disponível: ${insumo.estoqueAtual}`)
               }
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
  } catch (error: any) {
    console.error("Erro ao registrar carregamento:", error)
    return { success: false, error: error.message || "Falha ao registrar carregamento e gerar faturamento." }
  }
}

export async function criarCliente(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = criarClienteSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data
    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null
      }
    })
    revalidatePath("/logistica")
    return { success: true, data: cliente }
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error)
    return { success: false, error: "Falha ao criar cliente. CNPJ ou Nome já cadastrado." }
  }
}

export async function excluirPedido(id: string) {
  try {
    await requireAdmin()

    if (!id || typeof id !== "string") {
      return { success: false, error: "ID de pedido inválido." }
    }
    
    // Deletar financeiro atrelado
    await prisma.financeiro.deleteMany({ where: { pedidoId: id } })
    
    // Restituir estoque
    const itens = await prisma.itemPedido.findMany({ where: { pedidoId: id } })
    for (const item of itens) {
       await prisma.loteInterno.update({
         where: { id: item.loteInternoId },
         data: { estoqueDisponivel: { increment: item.quantidade } }
       })
    }
    
    // Deletar itens e o pedido
    await prisma.itemPedido.deleteMany({ where: { pedidoId: id } })
    await prisma.itemVenda.deleteMany({ where: { pedidoId: id } })
    await prisma.pedido.delete({ where: { id } })
    
    revalidatePath("/logistica")
    revalidatePath("/financeiro")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao excluir pedido:", error)
    return { success: false, error: error.message || "Falha ao excluir pedido." }
  }
}
