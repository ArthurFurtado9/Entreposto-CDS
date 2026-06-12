"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientesStats } from "@/actions/clientes"
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from "recharts"
import { Loader2, TrendingUp } from "lucide-react"

interface RankingItem {
  nome: string
  totalOvos: number
  totalGasto: number
}

export function ClientRankingCard() {
  const [period, setPeriod] = useState("30d")
  const [data, setData] = useState<RankingItem[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await getClientesStats(period)
      if (res.success && res.data) {
        setData(res.data as RankingItem[])
      } else {
        setData([])
      }
    })
  }, [period])

  const COLORS = ["#f9943b", "#e07a2c", "#c6631b", "#ab4e0d", "#8f3b00"]

  return (
    <Card className="border-none shadow-sm bg-white flex flex-col justify-between h-[360px]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#f9943b]" />
            Ranking de Compras (Clientes)
          </CardTitle>
          <CardDescription>Clientes que mais adquiriram volume no período.</CardDescription>
        </div>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-medium text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-300"
        >
          <option value="7d">7 dias</option>
          <option value="30d">30 dias</option>
          <option value="3m">3 meses</option>
          <option value="6m">6 meses</option>
          <option value="12m">12 meses</option>
        </select>
      </CardHeader>
      <CardContent className="flex-1 relative flex items-center justify-center min-h-[200px]">
        {isPending ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Atualizando ranking...
          </div>
        ) : data.length === 0 ? (
          <div className="text-slate-400 text-xs text-center py-8">
            Nenhuma compra registrada no período selecionado.
          </div>
        ) : (
          <div className="h-[220px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="nome" 
                  type="category" 
                  stroke="#888888" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload
                      return (
                        <div className="bg-white p-2 border rounded shadow-sm text-xs space-y-1">
                          <p className="font-bold text-slate-800">{item.nome}</p>
                          <p className="text-slate-600 font-medium">Volume: {item.totalOvos.toLocaleString("pt-BR")} ovos</p>
                          <p className="text-emerald-600 font-bold">Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalGasto)}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="totalOvos" radius={[0, 4, 4, 0]} barSize={14}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
