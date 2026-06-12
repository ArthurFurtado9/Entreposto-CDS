"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Package, 
  Users, 
  Settings, 
  TrendingUp, 
  CircleDollarSign, 
  ClipboardCheck, 
  Truck, 
  Download, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  User as UserIcon,
  Bell
} from "lucide-react";
import { HeaderSearch } from "@/components/header-search";
import { logout } from "@/actions/auth";

interface MenuItem {
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const navigationMenu: MenuCategory[] = [
  {
    title: "Empresa",
    items: [
      { name: "Visão Geral", description: "Painel de controle com indicadores", href: "/dashboard", icon: LayoutDashboard },
      { name: "Relatórios & BI", description: "Gráficos avançados e analytics de perdas", href: "/bi", icon: TrendingUp },
    ]
  },
  {
    title: "Cadastros",
    items: [
      { name: "Clientes B2B", description: "Compradores e distribuidores parceiros", href: "/clientes", icon: Users },
      { name: "Fornecedores", description: "Granjas produtoras de ovos integradas", href: "/fornecedores", icon: Users },
      { name: "Produtos (Catálogo)", description: "Visualizar e editar produtos e kits", href: "/produtos", icon: Package },
      { name: "Funcionários", description: "Cadastro de colaboradores e cargos", href: "/funcionarios", icon: Users },
    ]
  },
  {
    title: "Estoque & Produção",
    items: [
      { name: "Recebimento de Lotes", description: "Entrada e rastreabilidade na granja", href: "/recebimento", icon: Download },
      { name: "Ovoscopia (Triagem)", description: "Classificação física de qualidade e perdas", href: "/ovoscopia", icon: ClipboardCheck },
      { name: "Produção e Insumos", description: "Controle de embalagens, caixas e cartelas", href: "/producao", icon: Package },
    ]
  },
  {
    title: "Vendas",
    items: [
      { name: "Vendas (Saídas)", description: "Expedição de pedidos e controle FIFO", href: "/logistica", icon: Truck },
    ]
  },
  {
    title: "Financeiro",
    items: [
      { name: "Controle de Caixa", description: "Lançamento de receitas e despesas", href: "/financeiro", icon: CircleDollarSign },
    ]
  },
  {
    title: "Configurações",
    items: [
      { name: "Ajustes Gerais", description: "Dados fiscais, equipe e permissões", href: "/configuracoes", icon: Settings },
      { name: "Gestão de Equipe", description: "Controle de acessos de funcionários", href: "/configuracoes?tab=equipe", icon: Users },
      { name: "Dados da Empresa", description: "Configuração de faturamento da empresa", href: "/configuracoes?tab=empresa", icon: Settings },
    ]
  }
];

interface TopNavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
  } | null;
}

export function TopNavbar({ user }: TopNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (confirm("Deseja realmente sair do sistema?")) {
      await logout();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-md dark:bg-zinc-950/90 dark:border-zinc-800/60">
      <div className="w-full h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        
        {/* LEFT: LOGO AND NAVIGATION MENUS */}
        <div className="flex items-center gap-6 xl:gap-8 min-w-0">
          {/* LOGO (Minimalist text - no box icon) */}
          <Link href="/dashboard" className="flex items-center group select-none shrink-0">
            <span className="font-dm-sans text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
              <span className="text-[#404040] dark:text-slate-100">Avil</span>
              <span className="text-[#f9943b]">ó</span>
              <span className="text-[#404040] dark:text-slate-100">gica</span>
              <span className="text-slate-400 font-semibold ml-1.5 text-xs">ERP</span>
            </span>
          </Link>

          {/* DESKTOP NAVIGATION DROPDOWNS */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
            {navigationMenu.map((category) => {
              const isCategoryActive = category.items.some(item => pathname?.startsWith(item.href));

              return (
                <div key={category.title} className="relative group py-2">
                  <button 
                    className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      isCategoryActive
                        ? "bg-amber-50/70 text-[#f9943b]"
                        : "text-slate-600 hover:text-[#f9943b] hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {category.title}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Dropdown Flyout Card Wrapper (Bridges the hover gap using pt-2 instead of mt-1) */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block pt-2 z-50 animate-fadeIn">
                    <div className="w-80 bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xl p-3">
                      <div className="space-y-1">
                        {category.items.map((item) => {
                          const isItemActive = pathname === item.href;
                          const Icon = item.icon;
                          
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                isItemActive
                                  ? "bg-amber-50/60 text-slate-900 dark:bg-amber-950/20"
                                  : "hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isItemActive 
                                  ? "bg-amber-100/80 text-[#f9943b] dark:bg-amber-950/40" 
                                  : "bg-slate-100 text-slate-500 dark:bg-zinc-900 dark:text-slate-400"
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold block text-slate-950 dark:text-slate-100">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate mt-0.5 leading-normal">
                                  {item.description}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* RIGHT: SEARCH, BELL AND PROFILE */}
        <div className="hidden lg:flex items-center gap-3 flex-1 justify-end max-w-[750px] min-w-0">
          <HeaderSearch />
          
          {/* NOTIFICATION BELL */}
          <button className="relative p-2 text-slate-500 hover:text-[#f9943b] hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-zinc-900 rounded-full transition-all cursor-pointer">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#f9943b] ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
          </button>
          
          {/* USER PROFILE DROPDOWN */}
          <div className="relative group py-2">
            <button className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#f9943b] transition-all py-1.5 px-3 rounded-full hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-zinc-900 cursor-pointer">
              {/* Default gray avatar icon fallback */}
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                <UserIcon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-left hidden xl:block">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                  {user?.name || "Usuário"}
                </span>
                <span className="block text-[9px] text-slate-400 font-medium truncate uppercase tracking-widest">
                  {user?.role || "Operador"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            
            {/* Profile Dropdown Wrapper (Bridges hover gap) */}
            <div className="absolute right-0 top-full hidden group-hover:block pt-2 z-50 animate-fadeIn">
              <div className="w-64 bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xl p-4 space-y-3">
                {/* User Header */}
                <div className="pb-3 border-b border-slate-100 dark:border-zinc-900 space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {user?.name || "Operador"}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {user?.email || "usuario@avilogica.com.br"}
                  </span>
                </div>

                {/* Submenu Links */}
                <div className="space-y-1">
                  <Link 
                    href="/configuracoes?tab=empresa" 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Dados da Empresa
                  </Link>
                  <Link 
                    href="/configuracoes" 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Todas as Configurações
                  </Link>
                </div>

                {/* Plan Card */}
                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/40 dark:border-amber-900/30 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Plano Ativo</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 select-none">
                      {user?.role === "DONO" ? "Corporativo" : "Crescimento"}
                    </span>
                  </div>
                  <Link 
                    href="/configuracoes" 
                    className="w-full text-center block text-[10px] font-bold text-[#f9943b] hover:text-[#e07a2c] transition-colors mt-1"
                  >
                    Gerenciar Plano
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-900">
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold text-red-600 hover:text-red-700 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair da Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="flex lg:hidden items-center gap-1">
          {/* MOBILE NOTIFICATION BELL */}
          <button className="relative p-2 text-slate-500 hover:text-[#f9943b] dark:text-slate-400 cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#f9943b] ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* MOBILE FULL DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs lg:hidden"
            />

            {/* Menu Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-zinc-950 z-50 shadow-2xl flex flex-col p-6 overflow-y-auto lg:hidden"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-zinc-900">
                <span className="font-dm-sans text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200">
                  <span className="text-[#404040] dark:text-slate-100">Avil</span>
                  <span className="text-[#f9943b]">ó</span>
                  <span className="text-[#404040] dark:text-slate-100">gica</span>
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="py-4">
                <HeaderSearch />
              </div>

              {/* Mobile Menu List */}
              <div className="flex-1 space-y-4 py-4">
                {navigationMenu.map((category) => {
                  const isExpanded = activeMobileCategory === category.title;
                  
                  return (
                    <div key={category.title} className="space-y-1">
                      <button
                        onClick={() => setActiveMobileCategory(isExpanded ? null : category.title)}
                        className="w-full flex items-center justify-between py-2 text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                      >
                        <span>{category.title}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="pl-3 border-l border-slate-100 dark:border-zinc-900 space-y-2 py-1">
                          {category.items.map((item) => {
                            const isItemActive = pathname === item.href;
                            
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                className={`block py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                                  isItemActive
                                    ? "bg-amber-50 text-[#f9943b] font-bold"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                }`}
                              >
                                {item.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Footer (Logout) */}
              <div className="pt-6 border-t border-slate-100 dark:border-zinc-900 flex justify-between items-center mt-auto">
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    {user?.name || "Operador"}
                  </span>
                  <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {user?.role === "DONO" ? "Plano Corporativo" : "Plano Crescimento"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sair do ERP
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
