"use server"

import prisma from "@/lib/prisma"

export async function getBIData() {
  try {
    // Ranking de Qualidade (Rendimento %)
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
        rendimento: Number(media.toFixed(1)),
        loss: Number((100 - media).toFixed(1)),
      }
    })
    .sort((a, b) => b.rendimento - a.rendimento)
    // Only keeping top 5 or all? The chart can handle all, but let's take top 10.
    .slice(0, 10)

    // Alocação de Perdas
    const agregacaoPerdas = await prisma.loteEntrada.aggregate({
      where: { status: "TRIADO" },
      _sum: {
        quantidadeTrincados: true,
        quantidadeQuebrados: true,
        quantidadeDescarte: true,
      }
    })

    const trincados = agregacaoPerdas._sum.quantidadeTrincados || 0
    const quebrados = agregacaoPerdas._sum.quantidadeQuebrados || 0
    const descarte = agregacaoPerdas._sum.quantidadeDescarte || 0
    const totalPerdas = trincados + quebrados + descarte

    const alocacaoPerdas = [
      { 
        label: "Ovos Trincados", 
        value: totalPerdas > 0 ? `${((trincados / totalPerdas) * 100).toFixed(1)}%` : "0%", 
        color: "bg-orange-500",
        raw: trincados
      },
      { 
        label: "Quebra no Transporte", // Assuming this is quebrados
        value: totalPerdas > 0 ? `${((quebrados / totalPerdas) * 100).toFixed(1)}%` : "0%", 
        color: "bg-red-500",
        raw: quebrados
      },
      { 
        label: "Descarte / Sujeira", 
        value: totalPerdas > 0 ? `${((descarte / totalPerdas) * 100).toFixed(1)}%` : "0%", 
        color: "bg-slate-500",
        raw: descarte
      },
    ].sort((a, b) => b.raw - a.raw)

    return { 
      success: true, 
      data: {
        ranking: ranking.length > 0 ? ranking : [{ name: "Sem dados", rendimento: 0, loss: 0 }],
        alocacaoPerdas
      }
    }
  } catch (error) {
    console.error("Erro ao buscar dados de BI:", error)
    return { success: false, error: "Falha ao buscar dados de BI." }
  }
}
