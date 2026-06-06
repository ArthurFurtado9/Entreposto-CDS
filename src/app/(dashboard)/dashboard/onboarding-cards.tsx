"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Download, 
  ClipboardCheck, 
  Truck, 
  CircleDollarSign, 
  Package, 
  X, 
  Sparkles 
} from "lucide-react"

export function OnboardingCards() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("onboarding_guide_dismissed")
    if (!dismissed) {
      setShow(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem("onboarding_guide_dismissed", "true")
    setShow(false)
  }

  if (!show) return null

  const steps = [
    {
      title: "Fornecedores",
      description: "Gerencie as granjas parceiras e analise o rendimento e histórico de quebra de ovos mensal.",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      title: "Recebimento de Ovos",
      description: "Registre a chegada de ovos dos fornecedores. Contas a pagar são emitidas no financeiro automaticamente.",
      icon: Download,
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    },
    {
      title: "Ovoscopia (Triagem)",
      description: "Classifique os ovos em tipos comerciais, quebrados e trincados para refinar o estoque final.",
      icon: ClipboardCheck,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
    {
      title: "Logística (Picking)",
      description: "Realize o carregamento de pedidos com distribuição e alocação automática de lotes (FIFO).",
      icon: Truck,
      color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      title: "Financeiro",
      description: "Gerencie contas a pagar, faturas a receber de clientes e veja o Lucro Líquido em tempo real.",
      icon: CircleDollarSign,
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      title: "Produção e Insumos",
      description: "Controle embalagens, caixas e bandejas. Alertas automáticos avisam quando o estoque está crítico.",
      icon: Package,
      color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  ]

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-950 text-white relative overflow-hidden p-6 rounded-2xl mb-6">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />
      
      <div className="flex items-start justify-between gap-4 relative z-10 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Guia de Integração: Entenda as Abas do Sistema</h2>
            <p className="text-xs text-slate-400">Guia prático das funções gerais do ERP para o seu primeiro acesso.</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg h-8 w-8"
          title="Ocultar guia de integração"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        {steps.map((step) => (
          <div 
            key={step.title} 
            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${step.color} transition-all duration-300 group-hover:scale-105`}>
              <step.icon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
