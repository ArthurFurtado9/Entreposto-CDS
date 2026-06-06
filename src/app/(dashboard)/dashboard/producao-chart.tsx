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

interface ProducaoChartProps {
  data: { date: string; volume: number }[]
}

export function ProducaoChart({ data }: ProducaoChartProps) {
  const totalVolume = data.reduce((acc, curr) => acc + curr.volume, 0)

  if (totalVolume === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500">Nenhum lote triado nos últimos 30 dias</p>
        <p className="text-xs text-slate-400 mt-1">Os dados aparecerão assim que os lotes forem processados na ovoscopia.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs text-slate-400">Total processado no período:</span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{totalVolume.toLocaleString('pt-BR')} ovos</span>
      </div>
      <div className="flex-1 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-zinc-950 p-2.5 border border-slate-100 dark:border-zinc-800 rounded-lg shadow-md">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{payload[0].payload.date}</p>
                      <p className="text-sm font-bold text-violet-600 dark:text-violet-400 mt-0.5">
                        {payload[0].value?.toLocaleString('pt-BR')} ovos
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="volume" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVolume)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
