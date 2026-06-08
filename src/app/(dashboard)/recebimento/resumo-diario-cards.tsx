import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Egg, Hourglass } from "lucide-react"

interface ResumoDiarioCardsProps {
  stats: {
    ovosRecebidosHoje: number
    cargasHoje: number
    lotesPendentesTriagem: number
  }
}

export function ResumoDiarioCards({ stats }: ResumoDiarioCardsProps) {
  const formattedOvos = new Intl.NumberFormat("pt-BR").format(stats.ovosRecebidosHoje)
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ovos Recebidos Hoje</span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Egg className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold text-slate-900">{formattedOvos}</div>
          <p className="text-xs text-slate-400 mt-1">Volume total registrado hoje</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cargas Descarregadas</span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Truck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold text-slate-900">
            {stats.cargasHoje} {stats.cargasHoje === 1 ? "Lote" : "Lotes"}
          </div>
          <p className="text-xs text-slate-400 mt-1">Cargas registradas hoje</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aguardando Triagem</span>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Hourglass className="h-4 w-4 animate-spin-slow" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold text-slate-900">
            {stats.lotesPendentesTriagem} {stats.lotesPendentesTriagem === 1 ? "Lote" : "Lotes"}
          </div>
          <p className="text-xs text-slate-400 mt-1">Lotes na fila de ovoscopia</p>
        </CardContent>
      </Card>
    </div>
  )
}
