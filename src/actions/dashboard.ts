"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

export async function getDashboardData(period: string = "30d") {
  try {
    await requireAuth()
    
    const hoje = new Date()
    let dataInicio = new Date()

    if (period === "7d") {
      dataInicio.setDate(hoje.getDate() - 7)
    } else if (period === "30d") {
      dataInicio.setDate(hoje.getDate() - 30)
    } else if (period === "3m") {
      dataInicio.setMonth(hoje.getMonth() - 3)
    } else if (period === "6m") {
      dataInicio.setMonth(hoje.getMonth() - 6)
    } else if (period === "12m") {
      dataInicio.setMonth(hoje.getMonth() - 12)
    } else {
      dataInicio.setDate(hoje.getDate() - 30)
    }

    // Receita no período
    const receitaMensalResult = await prisma.financeiro.aggregate({
      where: {
        tipo: "RECEBER",
        createdAt: { gte: dataInicio }
      },
      _sum: {
        valor: true
      }
    })
    const receitaMensal = Number(receitaMensalResult._sum.valor || 0)

    // Lotes Processados no período
    const lotesProcessados = await prisma.loteEntrada.count({
      where: {
        createdAt: { gte: dataInicio }
      }
    })

    // Rendimento Médio no período
    const lotesTriados = await prisma.loteEntrada.findMany({
      where: {
        status: "TRIADO",
        createdAt: { gte: dataInicio }
      },
      select: { rendimentoPorcentagem: true }
    })
    const rendimentoMedio = lotesTriados.length > 0
      ? lotesTriados.reduce((acc, l) => acc + l.rendimentoPorcentagem, 0) / lotesTriados.length
      : 0

    // Insumos Críticos
    const insumosCriticos = await prisma.insumo.findMany({})
    const insumosCriticosFiltered = insumosCriticos.filter(i => i.estoqueAtual < i.estoqueMinimo)
    const insumosCriticosNomes = insumosCriticosFiltered.slice(0, 2).map(i => i.nome).join(" e ")

    // Ranking de Qualidade no período
    const fornecedores = await prisma.fornecedor.findMany({
      include: {
        lotes: {
          where: { 
            status: "TRIADO",
            createdAt: { gte: dataInicio }
          },
          select: { rendimentoPorcentagem: true }
        }
      }
    })

    const ranking = fornecedores.map(f => {
      const rendimentos = f.lotes.map(l => l.rendimentoPorcentagem)
      const media = rendimentos.length > 0 ? rendimentos.reduce((a, b) => a + b, 0) / rendimentos.length : 0
      return {
        name: f.nome,
        yield: `${media.toFixed(1)}%`,
        loss: `${(100 - media).toFixed(1)}%`,
        rawYield: media
      }
    })
    .filter(f => f.rawYield > 0)
    .sort((a, b) => b.rawYield - a.rawYield)
    .slice(0, 3)

    // Helpers para labels determinísticos
    const getDailyLabel = (date: Date) => {
      const d = String(date.getDate()).padStart(2, '0')
      const m = String(date.getMonth() + 1).padStart(2, '0')
      return `${d}/${m}`
    }

    const getMonthLabel = (date: Date) => {
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const y = String(date.getFullYear()).slice(-2)
      return `${m}/${y}`
    }

    // Volume de ovos processados no período (lotes triados)
    const lotesPeriodo = await prisma.loteEntrada.findMany({
      where: {
        status: "TRIADO",
        updatedAt: { gte: dataInicio }
      },
      select: {
        quantidadeAproveitada: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: "asc"
      }
    })

    // Faturamento no período
    const financeiroReceberPeriodo = await prisma.financeiro.findMany({
      where: {
        tipo: "RECEBER",
        createdAt: { gte: dataInicio }
      },
      select: {
        valor: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    const isDaily = period === "7d" || period === "30d"
    const volumePorLabel: { [key: string]: number } = {}
    const faturamentoPorLabel: { [key: string]: number } = {}
    const orderedLabels: string[] = []

    if (isDaily) {
      const numDias = period === "7d" ? 7 : 30
      for (let i = numDias - 1; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const label = getDailyLabel(d)
        volumePorLabel[label] = 0
        faturamentoPorLabel[label] = 0
        orderedLabels.push(label)
      }

      for (const lote of lotesPeriodo) {
        const label = getDailyLabel(lote.updatedAt)
        if (volumePorLabel[label] !== undefined) {
          volumePorLabel[label] += lote.quantidadeAproveitada
        }
      }

      for (const f of financeiroReceberPeriodo) {
        const label = getDailyLabel(f.createdAt)
        if (faturamentoPorLabel[label] !== undefined) {
          faturamentoPorLabel[label] += Number(f.valor)
        }
      }
    } else {
      const numMeses = period === "3m" ? 3 : period === "6m" ? 6 : 12
      for (let i = numMeses - 1; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const label = getMonthLabel(d)
        volumePorLabel[label] = 0
        faturamentoPorLabel[label] = 0
        orderedLabels.push(label)
      }

      for (const lote of lotesPeriodo) {
        const label = getMonthLabel(lote.updatedAt)
        if (volumePorLabel[label] !== undefined) {
          volumePorLabel[label] += lote.quantidadeAproveitada
        }
      }

      for (const f of financeiroReceberPeriodo) {
        const label = getMonthLabel(f.createdAt)
        if (faturamentoPorLabel[label] !== undefined) {
          faturamentoPorLabel[label] += Number(f.valor)
        }
      }
    }

    const producaoTrintaDias = orderedLabels.map(label => ({
      date: label,
      volume: volumePorLabel[label]
    }))

    const faturamentoTrintaDias = orderedLabels.map(label => ({
      date: label,
      valor: faturamentoPorLabel[label]
    }))

    // Ticket Médio de Clientes no período
    const pedidos = await prisma.pedido.findMany({
      where: {
        createdAt: { gte: dataInicio }
      },
      include: {
        cliente: true,
        financeiro: true
      }
    })

    const clientStats: { [clientId: string]: { nome: string, totalValor: number, totalPedidos: number } } = {}
    for (const p of pedidos) {
      if (!p.cliente) continue
      const cId = p.cliente.id
      if (!clientStats[cId]) {
        clientStats[cId] = { nome: p.cliente.nome, totalValor: 0, totalPedidos: 0 }
      }
      clientStats[cId].totalPedidos += 1
      if (p.financeiro) {
        clientStats[cId].totalValor += Number(p.financeiro.valor)
      }
    }

    const ticketMedioClientes = Object.values(clientStats).map(c => ({
      nome: c.nome,
      pedidos: c.totalPedidos,
      total: c.totalValor,
      ticketMedio: c.totalPedidos > 0 ? c.totalValor / c.totalPedidos : 0
    })).sort((a, b) => b.ticketMedio - a.ticketMedio)

    // Top Produtos Mais Vendidos e sua Quantidade
    const itensVenda = await prisma.itemVenda.findMany({
      where: {
        createdAt: { gte: dataInicio }
      }
    })

    const prodStats: { [tipo: string]: { tipoEmbalagem: string, quantidadeBandejas: number, totalFaturamento: number } } = {}
    for (const item of itensVenda) {
      const tipo = item.tipoEmbalagem
      if (!prodStats[tipo]) {
        prodStats[tipo] = { tipoEmbalagem: tipo, quantidadeBandejas: 0, totalFaturamento: 0 }
      }
      prodStats[tipo].quantidadeBandejas += item.quantidadeBandejas
      prodStats[tipo].totalFaturamento += item.quantidadeBandejas * item.precoBandeja
    }

    const topProdutos = Object.values(prodStats).map(p => ({
      tipoEmbalagem: p.tipoEmbalagem,
      quantidadeBandejas: p.quantidadeBandejas,
      faturamento: p.totalFaturamento
    })).sort((a, b) => b.quantidadeBandejas - a.quantidadeBandejas)

    // Contas Pendentes no período
    const contasPagarPendente = await prisma.financeiro.findMany({
      where: {
        tipo: "PAGAR",
        status: "PENDENTE",
        createdAt: { gte: dataInicio }
      },
      select: { valor: true }
    })

    const contasReceberPendente = await prisma.financeiro.findMany({
      where: {
        tipo: "RECEBER",
        status: "PENDENTE",
        createdAt: { gte: dataInicio }
      },
      select: { valor: true }
    })

    const contasAPagarCount = contasPagarPendente.length
    const contasAPagarValor = contasPagarPendente.reduce((acc, c) => acc + Number(c.valor), 0)

    const contasAReceberCount = contasReceberPendente.length
    const contasAReceberValor = contasReceberPendente.reduce((acc, c) => acc + Number(c.valor), 0)

    return {
      success: true,
      data: {
        receitaMensal,
        lotesProcessados,
        rendimentoMedio,
        insumosCriticosCount: insumosCriticosFiltered.length,
        insumosCriticosNomes: insumosCriticosNomes || "Nenhum insumo crítico",
        ranking,
        producaoTrintaDias,
        faturamentoTrintaDias,
        ticketMedioClientes,
        topProdutos,
        contasAPagarCount,
        contasAPagarValor,
        contasAReceberCount,
        contasAReceberValor
      }
    }
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return { success: false, error: "Falha ao buscar dados." }
  }
}
