"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireRole, requireAuth } from "@/lib/auth-utils"
import { z } from "zod"

const clienteSchema = z.object({
  nome: z.string().min(2, "Nome do cliente deve ter pelo menos 2 caracteres."),
  cnpj: z.string().optional().nullable().or(z.literal("")),
  email: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email("Formato de e-mail inválido.").nullable().optional()
  ),
  cep: z.string().optional().nullable().or(z.literal("")),
  rua: z.string().optional().nullable().or(z.literal("")),
  bairro: z.string().optional().nullable().or(z.literal("")),
  cidade: z.string().optional().nullable().or(z.literal("")),
  estado: z.string().optional().nullable().or(z.literal("")),
  telefone: z.string().optional().nullable().or(z.literal("")),
  contato: z.string().optional().nullable().or(z.literal("")),
})

export async function getClientesList() {
  try {
    await requireAuth()
    const clientes = await prisma.cliente.findMany({
      orderBy: { nome: "asc" },
      include: {
        pedidos: {
          select: {
            id: true
          }
        }
      }
    })
    return { success: true, data: clientes }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar clientes:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar clientes." }
  }
}

export async function criarClienteCompleto(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = clienteSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data
    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null,
        email: data.email || null,
        cep: data.cep || null,
        rua: data.rua || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
        telefone: data.telefone || null,
        contato: data.contato || null,
      },
    })

    revalidatePath("/clientes")
    revalidatePath("/logistica")
    return { success: true, data: cliente }
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error)
    return { success: false, error: "Falha ao cadastrar cliente. CNPJ ou E-mail já pode estar em uso." }
  }
}

export async function editarCliente(id: string, rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = clienteSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const data = validated.data
    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nome: data.nome,
        cnpj: data.cnpj || null,
        email: data.email || null,
        cep: data.cep || null,
        rua: data.rua || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
        telefone: data.telefone || null,
        contato: data.contato || null,
      },
    })

    revalidatePath("/clientes")
    revalidatePath("/logistica")
    return { success: true, data: cliente }
  } catch (error: any) {
    console.error("Erro ao editar cliente:", error)
    return { success: false, error: "Falha ao editar cliente. CNPJ ou E-mail já pode estar em uso." }
  }
}

export async function excluirCliente(id: string) {
  try {
    await requireAdmin()

    // Verificar se possui pedidos
    const pedidosCount = await prisma.pedido.count({
      where: { clienteId: id }
    })

    if (pedidosCount > 0) {
      return { success: false, error: `Não é possível excluir o cliente porque ele já possui ${pedidosCount} pedidos registrados.` }
    }

    await prisma.cliente.delete({
      where: { id }
    })

    revalidatePath("/clientes")
    revalidatePath("/logistica")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao excluir cliente:", error)
    return { success: false, error: error.message || "Falha ao excluir cliente." }
  }
}

export async function getClientesStats(period: string) {
  try {
    await requireAuth()

    const now = new Date()
    let startDate = new Date()
    if (period === "7d") startDate.setDate(now.getDate() - 7)
    else if (period === "30d") startDate.setDate(now.getDate() - 30)
    else if (period === "3m") startDate.setMonth(now.getMonth() - 3)
    else if (period === "6m") startDate.setMonth(now.getMonth() - 6)
    else if (period === "12m") startDate.setMonth(now.getMonth() - 12)
    else startDate.setDate(now.getDate() - 30)

    const orders = await prisma.pedido.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ["ENVIADO", "ENTREGUE"] }
      },
      include: {
        cliente: true,
        itensVenda: true,
        itens: true
      }
    })

    const clientMap: Record<string, { nome: string; totalOvos: number; totalGasto: number }> = {}

    for (const order of orders) {
      const cId = order.clienteId
      if (!clientMap[cId]) {
        clientMap[cId] = { nome: order.cliente.nome, totalOvos: 0, totalGasto: 0 }
      }
      const orderOvos = order.itens.reduce((acc, item) => acc + item.quantidade, 0)
      clientMap[cId].totalOvos += orderOvos

      const totalOrderValue = order.itensVenda.reduce((acc, iv) => acc + (iv.quantidadeBandejas * iv.precoBandeja), 0)
      clientMap[cId].totalGasto += totalOrderValue
    }

    const ranking = Object.values(clientMap)
      .sort((a, b) => b.totalOvos - a.totalOvos)
      .slice(0, 10)

    return { success: true, data: ranking }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar estatísticas de clientes:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar estatísticas de clientes." }
  }
}
