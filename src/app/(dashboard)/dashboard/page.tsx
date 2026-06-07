import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  CircleDollarSign, 
  Package, 
  TrendingUp,
  AlertTriangle
} from "lucide-react"
import { getDashboardData } from "@/actions/dashboard"
import { ProducaoChart } from "./producao-chart"
import { FaturamentoChart } from "./faturamento-chart"
import { OnboardingCards } from "./onboarding-cards"
import { PeriodSelector } from "./period-selector"
import { getCurrentUser } from "@/lib/auth-utils"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{ period?: string }>
}

export default async function DashboardPage(props: PageProps) {
  const searchParams = await props.searchParams
  const period = searchParams.period || "30d"

  const user = await getCurrentUser()
  const showOnboarding = user ? !user.onboardingDismissed : false

  const result = await getDashboardData(period)
  const data = result.success && result.data ? result.data : {
    receitaMensal: 0,
    lotesProcessados: 0,
    rendimentoMedio: 0,
    insumosCriticosCount: 0,
    insumosCriticosNomes: "Nenhum insumo crítico",
    ranking: [],
    producaoTrintaDias: [],
    faturamentoTrintaDias: [],
    ticketMedioClientes: [],
    topProdutos: [],
    contasAPagarCount: 0,
    contasAPagarValor: 0,
    contasAReceberCount: 0,
    contasAReceberValor: 0
  }

  const isDaily = period === "7d" || period === "30d"

  const formatTipoEmbalagem = (tipo: string) => {
    if (tipo === "6") return "Estojo c/ 6 Ovos"
    if (tipo === "12") return "Estojo c/ 12 Ovos"
    if (tipo === "15") return "Bandeja c/ 15 Ovos"
    return `Embalagem ${tipo}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Bem-vindo ao centro de controle do Entreposto Serra.</p>
        </div>
        <PeriodSelector currentPeriod={period} />
      </div>

      <OnboardingCards initialShow={showOnboarding} />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Faturamento */}
        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Faturamento ({period})</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-400">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.receitaMensal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Faturamento no período
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Fluxo Financeiro Pendente (Clickable) */}
        <Link href="/financeiro" className="block group">
          <Card className="glass-panel hover-lift h-full border border-indigo-500/10 hover:border-indigo-500/25 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Contas Pendentes</CardTitle>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <CircleDollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <table className="w-full text-xs text-slate-500">
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-zinc-800/50">
                    <td className="py-1 font-medium text-slate-600 dark:text-slate-400">A Receber</td>
                    <td className="py-1 text-center text-slate-400 font-semibold">({data.contasAReceberCount})</td>
                    <td className="py-1 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.contasAReceberValor)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium text-slate-600 dark:text-slate-400">A Pagar</td>
                    <td className="py-1 text-center text-slate-400 font-semibold">({data.contasAPagarCount})</td>
                    <td className="py-1 text-right font-bold text-rose-600 dark:text-rose-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.contasAPagarValor)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-[10px] text-indigo-500 group-hover:text-indigo-600 font-bold mt-2.5 flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-all">
                Ver no Financeiro →
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Lotes Processados */}
        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Lotes Processados</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/35 text-blue-600 dark:text-blue-400">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.lotesProcessados}</div>
            <p className="text-xs text-slate-400 mt-1">
              Lotes recebidos no período
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Rendimento Médio */}
        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Rendimento Médio</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/35 text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.rendimentoMedio.toFixed(1)}%</div>
            <p className="text-xs text-slate-400 mt-1">
              Média de aproveitamento no período
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Insumos Críticos */}
        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Insumos Críticos</CardTitle>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
              data.insumosCriticosCount > 0 ? 'bg-red-50 dark:bg-red-950/35 text-red-500' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'
            }`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.insumosCriticosCount}</div>
            <p className="text-xs text-slate-400 mt-1 truncate" title={data.insumosCriticosNomes}>
              {data.insumosCriticosNomes}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side: Faturamento */}
        <Card className="glass-panel hover-lift">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
              {isDaily ? "Faturamento Diário" : "Faturamento Mensal"}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Valor faturado no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <FaturamentoChart data={data.faturamentoTrintaDias} />
          </CardContent>
        </Card>

        {/* Right Side: Volume de Produção */}
        <Card className="glass-panel hover-lift">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
              {isDaily ? "Volume de Produção Diário" : "Volume de Produção Mensal"}
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Volume de ovos processados no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ProducaoChart data={data.producaoTrintaDias} />
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Ticket Médio por Cliente */}
        <Card className="glass-panel hover-lift flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Ticket Médio por Cliente</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Valor médio gasto por cliente por pedido no período.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-zinc-900">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-l-lg">Cliente</th>
                  <th scope="col" className="px-4 py-3 text-center">Pedidos</th>
                  <th scope="col" className="px-4 py-3 text-right">Total Faturado</th>
                  <th scope="col" className="px-4 py-3 text-right rounded-r-lg">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {data.ticketMedioClientes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      Nenhum pedido no período
                    </td>
                  </tr>
                ) : (
                  data.ticketMedioClientes.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{item.nome}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-700 dark:text-slate-300">{item.pedidos}</td>
                      <td className="px-4 py-3.5 text-right font-medium text-slate-600 dark:text-slate-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-indigo-600 dark:text-indigo-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.ticketMedio)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Right Column: Top Produtos and Quality Ranking */}
        <div className="flex flex-col gap-6">
          {/* Top Selling Products */}
          <Card className="glass-panel hover-lift">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Top Produtos Mais Vendidos</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Ranking dos produtos mais vendidos no período.
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-zinc-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 rounded-l-lg">Produto</th>
                    <th scope="col" className="px-4 py-3 text-center">Quant. Vendida</th>
                    <th scope="col" className="px-4 py-3 text-right rounded-r-lg">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProdutos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-400">
                        Nenhuma venda no período
                      </td>
                    </tr>
                  ) : (
                    data.topProdutos.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-zinc-800 hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            {i + 1}
                          </span>
                          {formatTipoEmbalagem(item.tipoEmbalagem)}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-700 dark:text-slate-300">{item.quantidadeBandejas.toLocaleString('pt-BR')} bandejas</td>
                        <td className="px-4 py-3.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.faturamento)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Ranking de Qualidade */}
          <Card className="glass-panel hover-lift">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Ranking de Qualidade (Fornecedores)</CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Melhores granjas (menor índice de quebra no período).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.ranking.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm">
                    Nenhum lote triado no período
                  </div>
                ) : (
                  data.ranking.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-bold text-slate-500">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.name}</p>
                          <p className="text-xs text-slate-400">Perda: {item.loss}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/35 px-2.5 py-1 rounded-full">
                        {item.yield} de rendimento
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
