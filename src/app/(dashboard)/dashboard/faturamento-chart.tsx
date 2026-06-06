"use client"

import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts"

interface FaturamentoChartProps {
  data: { date: string; valor: number }[]
}

export function FaturamentoChart({ data }: FaturamentoChartProps) {
  const totalBilled = data.reduce((acc, curr) => acc + curr.valor, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  if (totalBilled === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500">Nenhum faturamento registrado nos últimos 30 dias</p>
        <p className="text-xs text-slate-400 mt-1">Os dados aparecerão quando pedidos de logística forem faturados.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs text-slate-400">Total faturado no período:</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatCurrency(totalBilled)}</span>
      </div>
      <div className="flex-1 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-zinc-800" />
            <XAxis 
              dataKey="date" 
              stroke="#888888" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => value >= 1000 ? `R$ ${(value/1000).toFixed(0)}k` : `R$ ${value}`}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-zinc-950 p-2.5 border border-slate-100 dark:border-zinc-800 rounded-lg shadow-md">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{payload[0].payload.date}</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {formatCurrency(Number(payload[0].value))}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="valor" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValor)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
