import { 
  getFornecedores, 
  getUltimosLotesRecebidos, 
  getRecebimentoResumoDiario,
  getRecebimentoChartData 
} from "@/actions/fornecedores"
import { RecebimentoForm } from "./recebimento-form"
import { ResumoDiarioCards } from "./resumo-diario-cards"
import { UltimasEntradasTable } from "./ultimas-entradas-table"
import { RecebimentoChart } from "./recebimento-chart"

export const dynamic = "force-dynamic"

export default async function RecebimentoPage() {
  const [fornecedoresRes, ultimosLotesRes, resumoRes, chartRes] = await Promise.all([
    getFornecedores(),
    getUltimosLotesRecebidos(),
    getRecebimentoResumoDiario(),
    getRecebimentoChartData()
  ])

  const fornecedores = (fornecedoresRes.success && fornecedoresRes.data) ? fornecedoresRes.data : []
  const ultimosLotes = (ultimosLotesRes.success && ultimosLotesRes.data) ? ultimosLotesRes.data : []
  const resumoStats = (resumoRes.success && resumoRes.data) ? resumoRes.data : {
    ovosRecebidosHoje: 0,
    cargasHoje: 0,
    lotesPendentesTriagem: 0
  }
  const chartData = (chartRes.success && chartRes.data) ? chartRes.data : []

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Recebimento de Lotes de Ovos</h1>
        <p className="text-sm text-muted-foreground">Registre a entrada física de lotes de ovos no entreposto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <RecebimentoForm fornecedores={fornecedores} />
        </div>
        <div className="lg:col-span-4">
          <RecebimentoChart data={chartData} />
        </div>
        <div className="lg:col-span-3">
          <ResumoDiarioCards stats={resumoStats} />
        </div>
      </div>

      <div className="w-full">
        <UltimasEntradasTable lotes={ultimosLotes as any} fornecedores={fornecedores} />
      </div>
    </div>
  )
}

