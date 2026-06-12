"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ClipboardCheck,
  Package,
  Truck,
  CircleDollarSign,
  TrendingUp,
  Settings,
  Users,
  Download,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Visão Geral",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Recebimento",
      url: "/recebimento",
      icon: Download,
    },
    {
      title: "Ovoscopia (Triagem)",
      url: "/ovoscopia",
      icon: ClipboardCheck,
    },
    {
      title: "Logística (Picking)",
      url: "/logistica",
      icon: Truck,
    },
    {
      title: "Financeiro",
      url: "/financeiro",
      icon: CircleDollarSign,
    },
    {
      title: "Produtos",
      url: "/produtos",
      icon: Package,
    },
    {
      title: "Produção e Insumos",
      url: "/producao",
      icon: Package,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
    },
    {
      title: "Fornecedores",
      url: "/fornecedores",
      icon: Users,
    },
    {
      title: "Relatórios / BI",
      url: "/bi",
      icon: TrendingUp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0"
      {...props}
    >
      {/* Dark overlay applied via CSS variables overrides */}
      <div className="absolute inset-0 bg-[#2d2d2d] -z-10" />

      <SidebarHeader className="!bg-transparent border-b border-slate-800/30">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-2 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center hover:opacity-95 transition-all"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex aspect-square size-9 items-center justify-center rounded-xl bg-[#f9943b] text-white shadow-lg shadow-[#f9943b]/30 group-data-[collapsible=icon]:size-8 shrink-0"
          >
            <Package className="size-5 group-data-[collapsible=icon]:size-4" />
          </motion.div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-dm-sans text-lg font-bold tracking-tight text-white select-none">
              <span>Avil</span>
              <span className="text-[#f9943b]">ó</span>
              <span className="text-slate-200">gica</span>
            </span>
            <span className="truncate text-[10px] uppercase tracking-wider text-slate-400 font-semibold">ERP de Ovos</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="!bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2 px-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2 group-data-[collapsible=icon]:px-0">
              {data.navMain.map((item) => {
                const isActive = pathname?.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={`rounded-lg transition-all duration-200 h-10 ${
                        isActive
                          ? 'bg-[#f9943b] text-white hover:bg-[#e07a2c] font-medium shadow-md shadow-[#f9943b]/25'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                      render={<a href={item.url} />}
                    >
                      <item.icon className={`size-4 ${isActive ? 'text-white' : ''}`} />
                      <span className="text-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="!bg-transparent border-t border-slate-800/40 mt-auto">
        <SidebarMenu className="px-2 group-data-[collapsible=icon]:px-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Configurações"
              className="rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 h-10"
              render={<a href="/configuracoes" />}
            >
              <Settings className="size-4" />
              <span className="text-sm">Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
