"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts"

interface GraficosFornecedoresProps {
  volumeMensal: { name: string; value: number }[]
  historicoRefugo: { date: string; [key: string]: any }[]
  nomesFornecedores: string[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"]

export function GraficosFornecedores({ 
  volumeMensal, 
  historicoRefugo, 
  nomesFornecedores 
}: GraficosFornecedoresProps) {

  const totalVolume = volumeMensal.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Volume de Fornecimento */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">Volume de Fornecimento (Mês)</CardTitle>
          <CardDescription>Participação de volume (ovos) por fornecedor no mês corrente.</CardDescription>
        </CardHeader>
        <CardContent>
          {totalVolume === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-xs text-center">
              Nenhuma entrega registrada no mês atual.
            </div>
          ) : (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={volumeMensal}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {volumeMensal.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        const percent = ((data.value / totalVolume) * 100).toFixed(1)
                        return (
                          <div className="bg-white dark:bg-zinc-950 p-2 border border-slate-100 dark:border-zinc-800 rounded-lg shadow-md text-xs">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">{data.name}</p>
                            <p className="font-bold text-slate-900 dark:text-white mt-1">
                              {data.value.toLocaleString("pt-BR")} ovos ({percent}%)
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-slate-500 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Histórico de Qualidade/Perdas */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-slate-900">Histórico de Refugo (%)</CardTitle>
          <CardDescription>Taxa de ovos avariados (trincados + quebrados + descarte) nas triagens dos últimos 30 dias.</CardDescription>
        </CardHeader>
        <CardContent>
          {historicoRefugo.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-slate-400 text-xs text-center">
              Nenhuma triagem realizada nos últimos 30 dias.
            </div>
          ) : (
            <div className="h-[260px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicoRefugo} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const sortedPayload = [...payload].sort((a, b) => Number(b.value) - Number(a.value))
                        return (
                          <div className="bg-white dark:bg-zinc-950 p-2.5 border border-slate-100 dark:border-zinc-800 rounded-lg shadow-md text-xs space-y-1 max-w-[200px]">
                            <p className="font-bold text-slate-500 dark:text-slate-400">Data: {label}</p>
                            <div className="space-y-0.5">
                              {sortedPayload.map((p, idx) => (
                                <div key={idx} className="flex justify-between items-center gap-4">
                                  <span className="text-slate-600 dark:text-slate-400 font-medium">{p.name}:</span>
                                  <span className="font-bold" style={{ color: p.color }}>{p.value}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  {nomesFornecedores.map((nome, index) => (
                    <Line
                      key={nome}
                      type="monotone"
                      dataKey={nome}
                      name={nome}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  ))}
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs text-slate-500 font-medium">{value}</span>}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
