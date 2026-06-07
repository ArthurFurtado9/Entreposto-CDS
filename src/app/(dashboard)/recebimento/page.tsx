import { getFornecedores, getUltimosLotesRecebidos, getRecebimentoResumoDiario } from "@/actions/fornecedores"
import { RecebimentoForm } from "./recebimento-form"
import { ResumoDiarioCards } from "./resumo-diario-cards"
import { UltimasEntradasTable } from "./ultimas-entradas-table"

export const dynamic = "force-dynamic"

export default async function RecebimentoPage() {
  const [fornecedoresRes, ultimosLotesRes, resumoRes] = await Promise.all([
    getFornecedores(),
    getUltimosLotesRecebidos(),
    getRecebimentoResumoDiario()
  ])

  const fornecedores = (fornecedoresRes.success && fornecedoresRes.data) ? fornecedoresRes.data : []
  const ultimosLotes = (ultimosLotesRes.success && ultimosLotesRes.data) ? ultimosLotesRes.data : []
  const resumoStats = (resumoRes.success && resumoRes.data) ? resumoRes.data : {
    ovosRecebidosHoje: 0,
    cargasHoje: 0,
    lotesPendentesTriagem: 0
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Recebimento de Lotes de Ovos</h1>
        <p className="text-sm text-muted-foreground">Registre a entrada física de lotes de ovos no entreposto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <RecebimentoForm fornecedores={fornecedores} />
        </div>
        <div className="lg:col-span-1">
          <ResumoDiarioCards stats={resumoStats} />
        </div>
      </div>

      <div className="w-full">
        <UltimasEntradasTable lotes={ultimosLotes as any} fornecedores={fornecedores} />
      </div>
    </div>
  )
}

