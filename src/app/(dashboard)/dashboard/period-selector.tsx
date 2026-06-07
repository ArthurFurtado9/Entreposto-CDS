"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface PeriodSelectorProps {
  currentPeriod: string
}

export function PeriodSelector({ currentPeriod }: PeriodSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const periods = [
    { label: "7d", value: "7d" },
    { label: "30d", value: "30d" },
    { label: "3m", value: "3m" },
    { label: "6m", value: "6m" },
    { label: "12m", value: "12m" },
  ]

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("period", value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex bg-slate-100/80 dark:bg-zinc-800/80 p-1 rounded-xl w-fit border border-slate-200/50 dark:border-zinc-700/50 backdrop-blur-sm shadow-sm transition-all duration-300">
      {periods.map((p) => {
        const isActive = currentPeriod === p.value
        return (
          <button
            key={p.value}
            onClick={() => handleSelect(p.value)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-sm scale-[1.02] border border-slate-200/20"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
