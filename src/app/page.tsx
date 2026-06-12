"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Egg,
  ClipboardCheck,
  Hourglass,
  TrendingUp,
  Check,
  Users,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Package,
  Layers,
  CheckCircle2,
  Cloud,
  FileText,
  Menu,
  X,
  Play,
  TrendingDown,
  Building2,
  Info
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"recebimento" | "classificacao" | "estoque" | "financeiro">("recebimento");
  const [isAnnual, setIsAnnual] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Tab details content
  const tabContent = {
    recebimento: {
      title: "Recebimento & Rastreabilidade de Lotes",
      description: "Esqueça as planilhas e anotações em papel no recebimento. Dê entrada nos lotes de ovos de forma rápida, registrando dados cruciais como fornecedor, lote de origem, quantidade e data de postura.",
      bullets: [
        "Integração com API de CNPJ e CEP para cadastro instantâneo de granjas parceiras.",
        "Rastreabilidade garantida: cada caixa gerada carrega o histórico completo de origem.",
        "Alertas visuais de qualidade na entrada (amostra de peso e quebras iniciais)."
      ],
      badge: "Passo 1: Entrada",
      mockup: (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 md:p-6 shadow-2xl font-mono text-xs border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <span className="text-slate-400">novo_recebimento.ts</span>
          </div>
          <div className="space-y-2">
            <p className="text-amber-400">{"{"}</p>
            <p className="pl-4"><span className="text-indigo-400">"fornecedor"</span>: <span className="text-emerald-400">"Granja Vale do Sol Ltda"</span>,</p>
            <p className="pl-4"><span className="text-indigo-400">"cnpj"</span>: <span className="text-emerald-400">"12.345.678/0001-90"</span> <span className="text-slate-500">// Auto-completado</span>,</p>
            <p className="pl-4"><span className="text-indigo-400">"quantidadeOvos"</span>: <span className="text-amber-500">36000</span> <span className="text-slate-500">// 100 caixas</span>,</p>
            <p className="pl-4"><span className="text-indigo-400">"dataPostura"</span>: <span className="text-emerald-400">"2026-06-08"</span>,</p>
            <p className="pl-4"><span className="text-indigo-400">"statusRastreio"</span>: <span className="text-emerald-400">"APROVADO_OVOSCOPIA"</span></p>
            <p className="text-amber-400">{"}"}</p>
          </div>
          <div className="mt-6 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-[11px] text-emerald-300">Lote gerado com sucesso: #LOTE-202606-9A</span>
          </div>
        </div>
      )
    },
    classificacao: {
      title: "Classificação Inteligente & Conversão de Kits",
      description: "Registre os resultados da ovoscopia e classificação por tipo (Jumbo, Extra, Grande, Médio, Pequeno, Industrial). Crie estruturas de produtos de forma visual e transforme caixas simples em kits automaticamente.",
      bullets: [
        "Detecção de quebras e descarte com relatórios percentuais de produtividade do lote.",
        "Mudança de formato automática: se você adicionar uma embalagem específica, o sistema atualiza a estrutura para kit.",
        "Legendas explicativas completas em todas as telas para tirar dúvidas da equipe de triagem."
      ],
      badge: "Passo 2: Processamento",
      mockup: (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 md:p-6 shadow-2xl font-mono text-xs border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex gap-1.5 items-center">
              <Egg className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-sans font-semibold">Ovoscopia & Classificação</span>
            </div>
            <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">KIT ATIVO</span>
          </div>
          <div className="space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/50">
                <p className="text-slate-400">Ovos Classificados</p>
                <p className="text-lg font-bold text-slate-200">35.420</p>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded border border-slate-700/50">
                <p className="text-slate-400">Aproveitamento</p>
                <p className="text-lg font-bold text-emerald-400">98.4%</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Jumbo (tipo 1)</span>
                <span className="text-slate-400">8.200 un (23%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "23%" }}></div>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Extra (tipo 2)</span>
                <span className="text-slate-400">18.500 un (52%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: "52%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-red-300">
                <span>Avarias / Quebras</span>
                <span className="text-red-400">580 un (1.6%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: "1.6%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    estoque: {
      title: "Controle de Estoque FIFO (PEPS) & Validade",
      description: "Ovos são produtos altamente perecíveis. O Avilógica gerencia seu estoque de forma inteligente, indicando automaticamente quais lotes devem ser expedidos primeiro para evitar vencimentos.",
      bullets: [
        "Alertas visuais de validade por cores: verde (lote novo), amarelo (atenção), vermelho (urgente).",
        "Reserva automática baseada em lotes antigos na criação de pedidos de expedição.",
        "Painel de quebras de embalagens e perdas para auditoria rápida de estoque físico."
      ],
      badge: "Passo 3: Armazenamento",
      mockup: (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 md:p-6 shadow-2xl font-sans text-xs border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="font-semibold text-slate-300">Fila de Despacho (FIFO / PEPS)</span>
            <Hourglass className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="space-y-2.5">
            <div className="p-2.5 bg-red-950/30 border border-red-800/40 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-red-200">Lote #982 - Granja Sol</p>
                <p className="text-[10px] text-red-400">Postura há 18 dias • Vence em 2 dias</p>
              </div>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded border border-red-500/30 text-[10px] font-bold">SAÍDA URGENTE</span>
            </div>
            <div className="p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-amber-200">Lote #988 - Granja Ouro</p>
                <p className="text-[10px] text-amber-400">Postura há 10 dias • Vence em 10 dias</p>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 text-[10px]">ATENÇÃO</span>
            </div>
            <div className="p-2.5 bg-slate-800/40 border border-slate-700/50 rounded-lg flex justify-between items-center text-slate-400">
              <div>
                <p className="font-semibold text-slate-300">Lote #994 - Granja Vale</p>
                <p className="text-[10px] text-slate-500">Postura há 2 dias • Vence em 18 dias</p>
              </div>
              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-[10px]">ESTÁVEL</span>
            </div>
          </div>
        </div>
      )
    },
    financeiro: {
      title: "Financeiro Completo & Controle Administrativo",
      description: "Tenha visibilidade total do caixa. Crie categorias personalizadas para entradas de vendas e saídas de despesas da operação, com relatórios analíticos de lucratividade.",
      bullets: [
        "Fluxo de caixa separado por categorias (Ração, Embalagens, Combustível, Venda Atacado).",
        "Controle de contas de funcionários criado diretamente pelo Dono com controle de acessos.",
        "Integração de prazos de recebimento e fluxo mensal projetado."
      ],
      badge: "Passo 4: Controle",
      mockup: (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 md:p-6 shadow-2xl font-sans text-xs border border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="font-semibold text-slate-300">Resumo Mensal</span>
            <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded text-[11px]">SALDO POSITIVO</span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-950/30 border border-emerald-900/40 p-2.5 rounded">
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Receitas</span>
                </div>
                <p className="text-sm font-bold text-emerald-300">R$ 142.850</p>
              </div>
              <div className="bg-red-950/30 border border-red-900/40 p-2.5 rounded">
                <div className="flex items-center gap-1 text-[10px] text-red-400 mb-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Despesas</span>
                </div>
                <p className="text-sm font-bold text-red-300">R$ 84.300</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] text-slate-400">
              <p className="font-semibold text-slate-300 mb-1">Maiores Custos:</p>
              <div className="flex justify-between">
                <span>1. EMBALAGENS (Caixas e Cartelas)</span>
                <span className="text-slate-200">R$ 32.400</span>
              </div>
              <div className="flex justify-between">
                <span>2. LOGÍSTICA & TRANSPORTE</span>
                <span className="text-slate-200">R$ 18.900</span>
              </div>
              <div className="flex justify-between">
                <span>3. SUPRIMENTOS (Granja)</span>
                <span className="text-slate-200">R$ 12.000</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group select-none">
            <span className="font-dm-sans text-2xl font-semibold tracking-tight">
              <span className="text-[#404040]">Avil</span>
              <span className="text-[#f9943b]">ó</span>
              <span className="text-[#404040]">gica</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection("funcionalidades")} className="hover:text-amber-600 transition-colors cursor-pointer">Funcionalidades</button>
            <button onClick={() => scrollToSection("didatico")} className="hover:text-amber-600 transition-colors cursor-pointer">O que é um ERP?</button>
            <button onClick={() => scrollToSection("precos")} className="hover:text-amber-600 transition-colors cursor-pointer">Planos</button>
            <button onClick={() => scrollToSection("beneficios")} className="hover:text-amber-600 transition-colors cursor-pointer">Diferenciais</button>
          </nav>

          {/* Header CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors px-4 py-2"
            >
              Acessar Sistema
            </Link>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 hover-lift active:scale-95 transition-all"
            >
              Começar Grátis
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-slate-600 md:hidden hover:text-slate-950 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* MOBILE NAV OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-200 p-6 space-y-6 md:hidden shadow-lg animate-fadeIn">
          <nav className="flex flex-col gap-4 text-base font-semibold text-slate-700">
            <button onClick={() => scrollToSection("funcionalidades")} className="text-left py-2 hover:text-amber-600 transition-colors">Funcionalidades</button>
            <button onClick={() => scrollToSection("didatico")} className="text-left py-2 hover:text-amber-600 transition-colors">O que é um ERP?</button>
            <button onClick={() => scrollToSection("precos")} className="text-left py-2 hover:text-amber-600 transition-colors">Planos</button>
            <button onClick={() => scrollToSection("beneficios")} className="text-left py-2 hover:text-amber-600 transition-colors">Diferenciais</button>
          </nav>
          <div className="h-px bg-slate-100"></div>
          <div className="flex flex-col gap-3">
            <Link 
              href="/login" 
              className="flex w-full items-center justify-center rounded-full border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Acessar Sistema
            </Link>
            <Link 
              href="/register" 
              className="flex w-full items-center justify-center rounded-full bg-amber-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 hover:shadow-md transition-all"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-28">
        
        {/* Ambient Blur Gradients */}
        <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-amber-200/40 blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 -z-10 h-96 w-96 rounded-full bg-orange-100/30 blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-600/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                ERP Especializado em Ovos e Aves
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Gestão inteligente para o seu{" "}
                <span className="bg-gradient-to-r from-amber-600 via-[#f9943b] to-orange-600 bg-clip-text text-transparent">
                  entreposto de ovos
                </span>
              </h1>
              <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
                Esqueça as planilhas perdidas, cadernos e as quebras invisíveis. O Avilógica automatiza seu recebimento, ovoscopia, controle FIFO (PEPS) de validade e faturamento em uma única plataforma na nuvem.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link 
                  href="/register" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-slate-800 hover-lift transition-all"
                >
                  Criar Conta Grátis
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => scrollToSection("didatico")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Ver Como Funciona
                </button>
              </div>

              {/* Mini Social Proof */}
              <div className="pt-6 border-t border-slate-200/60 max-w-md mx-auto lg:mx-0 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  <span className="inline-block h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">JA</span>
                  <span className="inline-block h-8 w-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold">ML</span>
                  <span className="inline-block h-8 w-8 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[10px] font-bold">PC</span>
                </div>
                <p className="text-xs text-slate-500 text-center sm:text-left font-medium">
                  Ideal para <span className="text-slate-800 font-bold">granjas familiares</span> e <span className="text-slate-800 font-bold">grandes entrepostos</span>.
                </p>
              </div>
            </div>

            {/* Right Hero Column (Mockup) */}
            <div className="lg:col-span-5 relative w-full max-w-md lg:max-w-none mx-auto">
              
              {/* Background Glow */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 blur-xl"></div>
              
              {/* Glassmorphic Live Preview */}
              <div className="relative glass border border-slate-200 rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col gap-4 text-xs">
                
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11px] leading-none">Entreposto Ovosfera</h4>
                      <span className="text-[9px] text-slate-400">Painel Principal</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-semibold text-[9px] tracking-wide uppercase">
                    ON-LINE
                  </span>
                </div>

                {/* Simulated Metrics Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/70 border border-slate-100 p-2.5 rounded-xl shadow-xs">
                    <p className="text-[9px] text-slate-400 font-medium leading-none">Classificados Hoje</p>
                    <p className="text-base font-bold text-slate-800 mt-1 leading-none">38.400</p>
                    <span className="text-[8px] text-emerald-600 font-semibold mt-1 inline-block">+12% vs ontem</span>
                  </div>
                  <div className="bg-white/70 border border-slate-100 p-2.5 rounded-xl shadow-xs">
                    <p className="text-[9px] text-slate-400 font-medium leading-none">Estoque FIFO</p>
                    <p className="text-base font-bold text-slate-800 mt-1 leading-none">124</p>
                    <span className="text-[8px] text-slate-400 font-medium mt-1 inline-block">Lotes Ativos</span>
                  </div>
                  <div className="bg-white/70 border border-slate-100 p-2.5 rounded-xl shadow-xs">
                    <p className="text-[9px] text-slate-400 font-medium leading-none">Quebras / Avaria</p>
                    <p className="text-base font-bold text-red-600 mt-1 leading-none">1.2%</p>
                    <span className="text-[8px] text-emerald-600 font-semibold mt-1 inline-block">Meta batida</span>
                  </div>
                </div>

                {/* Simulated Chart Box */}
                <div className="bg-white/70 border border-slate-100 p-3.5 rounded-xl shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-700">
                    <span>Divisão por Tipo (Jumbo vs Extra)</span>
                    <span className="text-slate-400">Total Caixa</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[9px] text-slate-500 w-10">Jumbo</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-700 w-8 text-right">35%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-slate-500 w-10">Extra</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-700 w-8 text-right">50%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-slate-500 w-10">Outros</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-slate-300 h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-700 w-8 text-right">15%</span>
                  </div>
                </div>

                {/* Simulated Notification Toast */}
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-700">
                    <Hourglass className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-amber-900 leading-none">Alerta de Estoque FIFO</p>
                    <p className="text-[9px] text-amber-700 mt-1 truncate">Lote #902 vence em 48h. Expedir imediatamente.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DIDACTIC SECTION: WHAT IS AN ERP? */}
      <section id="didatico" className="py-20 bg-slate-100/60 border-y border-slate-200/40 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Didática Prática</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              O que é um ERP e por que seu entreposto precisa de um?
            </h3>
            <p className="text-slate-600 text-base">
              A sigla ERP significa <em>Enterprise Resource Planning</em> (Planejamento de Recursos Empresariais). Na prática, é o sistema central que conecta todas as áreas do seu negócio para que funcionem em sintonia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
            
            {/* O Caos (Sem ERP) */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/60 shadow-xs relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold">X</span>
                Operação sem ERP (O Caos)
              </h4>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Anotações em papel:</strong> Fichas de entrada de ovos se rasgam, molham ou são arquivadas de forma confusa.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Desperdício de lotes (FIFO ignorado):</strong> Lotes mais novos saem antes por falta de controle visual, fazendo ovos antigos passarem da validade.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Planilhas travadas:</strong> O estoque não bate com o financeiro, exigindo horas extras de retrabalho manual para conciliar tudo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Falta de clareza financeira:</strong> Dificuldade extrema para saber o lucro exato do entreposto por caixa vendida.</span>
                </li>
              </ul>
            </div>

            {/* O Controle (Com Avilógica) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">✓</span>
                Com o Avilógica (O Controle)
              </h4>
              <ul className="space-y-3.5 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Dados 100% integrados:</strong> O recebimento cria lotes que alimentam a ovoscopia, que por sua vez define o estoque e as vendas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Inteligência FIFO:</strong> O sistema destaca e sugere os lotes mais maduros para faturamento, reduzindo perdas a zero.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Estrutura automatizada:</strong> O formato de kit é detectado no cadastro se o produto usar embalagens de caixas ou cartelas.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></span>
                  <span><strong>Controle analítico de caixa:</strong> Visualização gráfica imediata do caixa, com despesas categorizadas e receitas detalhadas.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* DYNAMIC MODULES TABS */}
      <section id="funcionalidades" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Recursos de Ponta a Ponta</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Desenhado para o fluxo do seu entreposto
            </h3>
            <p className="text-slate-600 text-base">
              Acompanhamos cada passo físico do ovo. Veja como o Avilógica atua em cada etapa do processamento.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-10 md:mt-12">
            
            <button 
              onClick={() => setActiveTab("recebimento")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "recebimento" 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              Recebimento
            </button>

            <button 
              onClick={() => setActiveTab("classificacao")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "classificacao" 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" />
              Classificação & Kits
            </button>

            <button 
              onClick={() => setActiveTab("estoque")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "estoque" 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Hourglass className="w-4 h-4" />
              Estoque FIFO
            </button>

            <button 
              onClick={() => setActiveTab("financeiro")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "financeiro" 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Financeiro
            </button>

          </div>

          {/* Interactive Feature Panel Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 items-center max-w-6xl mx-auto p-6 md:p-8 bg-slate-50 border border-slate-200/50 rounded-2xl">
            
            {/* Tab Copy Details */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                {tabContent[activeTab].badge}
              </span>
              <h4 className="text-2xl font-bold text-slate-900">
                {tabContent[activeTab].title}
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {tabContent[activeTab].description}
              </p>
              <div className="h-px bg-slate-200"></div>
              <ul className="space-y-3">
                {tabContent[activeTab].bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tab Visual Mockup */}
            <div className="lg:col-span-5">
              {tabContent[activeTab].mockup}
            </div>

          </div>

        </div>
      </section>

      {/* KEY BENEFITS / ADVANTAGES */}
      <section id="beneficios" className="py-20 bg-slate-100/50 border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Diferenciais do Sistema</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Por que escolher o Avilógica?
            </h3>
            <p className="text-slate-600 text-base">
              Não somos um ERP genérico de comércio. Focamos única e exclusivamente nas particularidades da produção e distribuição de ovos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            
            {/* Advantage 1 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                <Hourglass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Controle FIFO Automático</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Organize as saídas de ovos baseado estritamente na data de postura ou validade, diminuindo desperdício e protegendo o cliente final.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Conversão de Formato Automática</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Facilidade para cadastrar produtos como Kits estruturados. O sistema gerencia embalagens e ovos de forma associada.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Consulta CEP & CNPJ Integrada</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Rapidez no cadastramento de novos clientes ou fornecedores com busca de endereços e dados empresariais automáticos da Receita Federal.
              </p>
            </div>

            {/* Advantage 4 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Equipe sob Medida</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Cadastre seus funcionários de forma inline e defina o que cada um pode ver ou editar através de permissões customizadas de acesso.
              </p>
            </div>

            {/* Advantage 5 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                <Cloud className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">100% Online na Nuvem</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Acesse o painel do seu galpão, do escritório ou de viagens diretamente pelo celular ou tablet sem precisar de instalações locais.
              </p>
            </div>

            {/* Advantage 6 */}
            <div className="bg-white border border-slate-200/50 rounded-2xl p-6 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">Segurança de Dados</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Dados hospedados de forma segura com criptografia moderna. Apenas o Dono tem acesso às configurações fiscais e administrativas críticas.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="precos" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600">Planos e Preços</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Escolha o plano ideal para a sua produção
            </h3>
            <p className="text-slate-600 text-base">
              Valores flexíveis e transparentes. Teste gratuitamente por 14 dias sem fidelidade.
            </p>

            {/* Toggle Billing Period */}
            <div className="inline-flex items-center gap-3 bg-slate-100 p-1 rounded-full mt-6">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${!isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Mensal
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${isAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
              >
                Anual <span className="text-amber-600 font-bold bg-amber-100 px-1.5 py-0.5 rounded ml-1 text-[9px]">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto items-stretch">
            
            {/* Plan 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Produtor Solo</h4>
                <p className="text-xs text-slate-500">Perfeito para pequenos avicultores e produtores locais.</p>
                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {isAnnual ? "R$ 49" : "R$ 59"}
                  </span>
                  <span className="text-xs text-slate-500"> / mês</span>
                </div>
                <div className="h-px bg-slate-200"></div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Até 2 usuários ativos</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Recebimento e estoque FIFO</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Cadastro de produtos e kits</li>
                  <li className="flex items-center gap-2 text-slate-400 line-through"><Check className="w-4 h-4 text-slate-300 flex-shrink-0" /> Financeiro e faturamento completo</li>
                  <li className="flex items-center gap-2 text-slate-400 line-through"><Check className="w-4 h-4 text-slate-300 flex-shrink-0" /> Controle de funcionários inline</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link 
                  href="/register" 
                  className="w-full text-center inline-block rounded-full bg-white border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  Começar Teste Grátis
                </Link>
              </div>
            </div>

            {/* Plan 2: Best Value */}
            <div className="bg-slate-950 text-white border-2 border-amber-500 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl relative transform scale-105 z-10">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-slate-950 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                MAIS POPULAR
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Entreposto Crescimento</h4>
                <p className="text-xs text-slate-400">Para entrepostos em crescimento que precisam de fluxo financeiro completo.</p>
                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">
                    {isAnnual ? "R$ 99" : "R$ 119"}
                  </span>
                  <span className="text-xs text-slate-400"> / mês</span>
                </div>
                <div className="h-px bg-slate-800"></div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> Até 10 usuários ativos</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> Recebimento e estoque FIFO</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> Classificação & kits automático</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> Financeiro com categorias customizáveis</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> Controle de funcionários com permissões</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 flex-shrink-0" /> CEP e CNPJ automático integrado</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link 
                  href="/register" 
                  className="w-full text-center inline-block rounded-full bg-amber-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-md hover:bg-amber-600 hover:shadow-lg transition-all"
                >
                  Assinar com Teste Grátis
                </Link>
              </div>
            </div>

            {/* Plan 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Corporativo Integrado</h4>
                <p className="text-xs text-slate-500">Para grandes cadeias avícolas e multi-granjas.</p>
                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {isAnnual ? "R$ 199" : "R$ 239"}
                  </span>
                  <span className="text-xs text-slate-500"> / mês</span>
                </div>
                <div className="h-px bg-slate-200"></div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Usuários ilimitados</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Multi-entrepostos integrados</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Exportação avançada Excel/PDF</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Painel BI de estatísticas do dono</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Suporte técnico dedicado via Whats/Telefone</li>
                </ul>
              </div>
              <div className="pt-6">
                <Link 
                  href="/register" 
                  className="w-full text-center inline-block rounded-full bg-white border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  Falar com Consultor
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Decorative Ambient circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Pronto para transformar a gestão do seu entreposto?
          </h3>
          <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-400">
            Fim dos desperdícios por validade. Fim das anotações erradas. Fim do estresse fiscal. Comece a usar o Avilógica hoje mesmo de forma rápida e simples.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-600 hover-lift transition-all"
            >
              Experimentar de Graça
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 transition-all"
            >
              Fazer Login no ERP
            </Link>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Não é necessário cartão de crédito para testar. Setup simples em menos de 5 minutos.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Footer Logo Column */}
            <div className="space-y-4">
              <div className="flex items-center select-none">
                <span className="font-dm-sans text-2xl font-semibold tracking-tight">
                  <span className="text-white">Avil</span>
                  <span className="text-[#f9943b]">ó</span>
                  <span className="text-slate-200">gica</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ERP Especializado em Gestão de Entrepostos de Ovos. Integrando recebimento, controle FIFO e faturamento.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Software</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollToSection("funcionalidades")} className="hover:text-white transition-colors cursor-pointer">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection("didatico")} className="hover:text-white transition-colors cursor-pointer">O que é um ERP?</button></li>
                <li><button onClick={() => scrollToSection("precos")} className="hover:text-white transition-colors cursor-pointer">Tabela de Preços</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Empresa</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/login" className="hover:text-white transition-colors">Acessar Portal</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Cadastro</Link></li>
                <li><span className="text-slate-600">Sobre nós (Em breve)</span></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Contato & Suporte</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dúvidas ou suporte?<br />
                <span className="text-slate-300 font-semibold">suporte@avilógica.com.br</span><br />
                Segunda a Sexta das 8h às 18h.
              </p>
            </div>

          </div>

          <div className="h-px bg-slate-900 my-8"></div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
            <p>© {new Date().getFullYear()} Avilógica ERP. Todos os direitos reservados. Feito para o setor avícola.</p>
            <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-end text-slate-500">
              <Link href="/contato" className="hover:text-slate-200 transition-colors">Fale conosco</Link>
              <span>|</span>
              <Link href="/termos" className="hover:text-slate-200 transition-colors">Termos de uso</Link>
              <span>|</span>
              <Link href="/privacidade" className="hover:text-slate-200 transition-colors">Segurança e privacidade</Link>
              <span>|</span>
              <a 
                href={process.env.NEXT_PUBLIC_SITE_URL || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#f9943b] font-semibold hover:underline"
              >
                avilogica.com.br
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
