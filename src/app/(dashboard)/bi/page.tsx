"use client"

import { useEffect, useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from "recharts"
import { getBIData } from "@/actions/bi"

export default function BIPage() {
  const [data, setData] = useState<{ ranking: any[], alocacaoPerdas: any[] }>({
    ranking: [],
    alocacaoPerdas: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBIData().then((result) => {
      if (result.success && result.data) {
        setData(result.data)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando dados de BI...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Intelligence</h1>
        <p className="text-muted-foreground">Análise de desempenho, qualidade e indicadores estratégicos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ranking de Qualidade (Rendimento %)</CardTitle>
            <CardDescription>Percentual de ovos aproveitados por fornecedor.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ranking}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="text-sm font-bold">{payload[0].payload.name}</p>
                            <p className="text-sm text-green-600">Rendimento: {payload[0].value}%</p>
                            <p className="text-sm text-red-600">Perda: {payload[0].payload.loss}%</p>
                          </div>
                        );
                      }
                      return null;
                   }}
                />
                <Bar dataKey="rendimento" radius={[4, 4, 0, 0]}>
                  {data.ranking.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rendimento > 95 ? "#22c55e" : entry.rendimento > 90 ? "#eab308" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Alocação de Perdas</CardTitle>
            <CardDescription>Principais motivos de descarte no sistema.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[350px]">
             <div className="space-y-6 w-full max-w-[300px]">
                {data.alocacaoPerdas.length === 0 && (
                   <p className="text-sm text-muted-foreground text-center">Nenhum dado de perda registrado.</p>
                )}
                {data.alocacaoPerdas.map((item) => (
                   <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: item.value }}></div>
                      </div>
                   </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
