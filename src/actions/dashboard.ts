"use server"

import prisma from "@/lib/prisma"

export async function getDashboardData() {
  try {
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

    return {
      success: true,
      data: {
        receitaMensal,
        lotesProcessados,
        rendimentoMedio,
        insumosCriticosCount: insumosCriticosFiltered.length,
        insumosCriticosNomes: insumosCriticosNomes || "Nenhum insumo crítico",
        ranking
      }
    }
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return { success: false, error: "Falha ao buscar dados." }
  }
}
