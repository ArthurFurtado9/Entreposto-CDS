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

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const result = await getDashboardData()
  const data = result.success && result.data ? result.data : {
    receitaMensal: 0,
    lotesProcessados: 0,
    rendimentoMedio: 0,
    insumosCriticosCount: 0,
    insumosCriticosNomes: "Nenhum insumo crítico",
    ranking: [],
    producaoTrintaDias: [],
    faturamentoTrintaDias: []
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Bem-vindo ao centro de controle do Entreposto Serra.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Receita Mensal</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600">
              <CircleDollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.receitaMensal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Receita de pedidos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Lotes Processados</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.lotesProcessados}</div>
            <p className="text-xs text-slate-400 mt-1">
              Lotes recebidos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Rendimento Médio</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.rendimentoMedio.toFixed(1)}%</div>
            <p className="text-xs text-slate-400 mt-1">
              Média de aproveitamento este mês
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Insumos Críticos</CardTitle>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
              data.insumosCriticosCount > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'
            }`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.insumosCriticosCount}</div>
            <p className="text-xs text-slate-400 mt-1 truncate" title={data.insumosCriticosNomes}>
              {data.insumosCriticosNomes}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-panel hover-lift">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Visão Geral de Produção</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Volume de ovos processados nos últimos 30 dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ProducaoChart data={data.producaoTrintaDias} />
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Faturamento Diário</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Valor faturado nos últimos 30 dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <FaturamentoChart data={data.faturamentoTrintaDias} />
          </CardContent>
        </Card>

        <Card className="glass-panel hover-lift">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-900">Ranking de Qualidade</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Melhores granjas (menor % de quebra).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col justify-center">
            <div className="space-y-3">
              {data.ranking.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-400">Nenhum dado disponível</p>
                </div>
              ) : (
                data.ranking.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-400">Perda: {item.loss}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {item.yield}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
