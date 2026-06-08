"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend 
} from "recharts"

interface RecebimentoChartProps {
  data: { name: string; value: number }[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"]

export function RecebimentoChart({ data }: RecebimentoChartProps) {
  const totalVolume = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="border-none shadow-sm bg-white h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-900">Origem do Volume (30d)</CardTitle>
        <CardDescription>Distribuição de ovos recebidos por granja.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[220px]">
        {totalVolume === 0 ? (
          <div className="text-slate-400 text-xs text-center py-8">
            Nenhuma entrega registrada nos últimos 30 dias.
          </div>
        ) : (
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload
                      const percent = ((item.value / totalVolume) * 100).toFixed(1)
                      return (
                        <div className="bg-white dark:bg-zinc-950 p-2.5 border border-slate-100 dark:border-zinc-800 rounded-lg shadow-md text-xs">
                          <p className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</p>
                          <p className="font-bold text-slate-900 dark:text-white mt-1">
                            {item.value.toLocaleString("pt-BR")} ovos ({percent}%)
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
                  formatter={(value) => <span className="text-[10px] text-slate-500 font-medium truncate max-w-[80px] inline-block">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
