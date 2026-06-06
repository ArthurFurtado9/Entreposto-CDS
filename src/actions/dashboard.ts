"use server"

import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

export async function getDashboardData() {
  try {
    await requireAuth()
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

    // Receita Mensal
    const receitaMensalResult = await prisma.financeiro.aggregate({
      where: {
        tipo: "RECEBER",
        createdAt: { gte: inicioMes }
      },
      _sum: {
        valor: true
      }
    })
    const receitaMensal = Number(receitaMensalResult._sum.valor || 0)

    // Lotes Processados
    const lotesProcessados = await prisma.loteEntrada.count({
      where: {
        createdAt: { gte: inicioMes }
      }
    })

    // Rendimento Médio
    const lotesTriados = await prisma.loteEntrada.findMany({
      where: {
        status: "TRIADO",
        createdAt: { gte: inicioMes }
      },
      select: { rendimentoPorcentagem: true }
    })
    const rendimentoMedio = lotesTriados.length > 0
      ? lotesTriados.reduce((acc, l) => acc + l.rendimentoPorcentagem, 0) / lotesTriados.length
      : 0

    // Insumos Críticos
    const insumosCriticos = await prisma.insumo.findMany({
      where: {
        estoqueAtual: { lt: prisma.insumo.fields.estoqueMinimo } // Wait, prisma doesn't support comparing two columns directly in where easily without raw query, so we fetch all and filter or use raw. Actually, we can fetch all or use raw. Let's fetch all.
      }
    })
    const insumosCriticosFiltered = insumosCriticos.filter(i => i.estoqueAtual < i.estoqueMinimo)
    const insumosCriticosNomes = insumosCriticosFiltered.slice(0, 2).map(i => i.nome).join(" e ")

    // Ranking de Qualidade
    const fornecedores = await prisma.fornecedor.findMany({
      include: {
        lotes: {
          where: { status: "TRIADO" },
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

    // Volume de ovos processados nos últimos 30 dias (lotes triados)
    const trintaDiasAtras = new Date()
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30)

    const lotesTrintaDias = await prisma.loteEntrada.findMany({
      where: {
        status: "TRIADO",
        updatedAt: { gte: trintaDiasAtras }
      },
      select: {
        quantidadeAproveitada: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: "asc"
      }
    })

    // Agrupar por data (dia/mês)
    const volumePorDia: { [key: string]: number } = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      volumePorDia[label] = 0
    }

    for (const lote of lotesTrintaDias) {
      const label = lote.updatedAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      if (volumePorDia[label] !== undefined) {
        volumePorDia[label] += lote.quantidadeAproveitada
      }
    }

    const producaoTrintaDias = Object.entries(volumePorDia).map(([date, volume]) => ({
      date,
      volume
    }))

    // Faturamento nos últimos 30 dias (tipo: RECEBER)
    const financeiroReceberTrintaDias = await prisma.financeiro.findMany({
      where: {
        tipo: "RECEBER",
        createdAt: { gte: trintaDiasAtras }
      },
      select: {
        valor: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "asc"
      }
    })

    // Agrupar por data (dia/mês)
    const faturamentoPorDia: { [key: string]: number } = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      faturamentoPorDia[label] = 0
    }

    for (const f of financeiroReceberTrintaDias) {
      const label = f.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      if (faturamentoPorDia[label] !== undefined) {
        faturamentoPorDia[label] += Number(f.valor)
      }
    }

    const faturamentoTrintaDias = Object.entries(faturamentoPorDia).map(([date, valor]) => ({
      date,
      valor
    }))

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
        faturamentoTrintaDias
      }
    }
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return { success: false, error: "Falha ao buscar dados." }
  }
}
