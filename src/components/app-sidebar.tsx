"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
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
      title: "Fornecedores",
      url: "/fornecedores",
      icon: Users,
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
      title: "Produção e Insumos",
      url: "/producao",
      icon: Package,
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
      <div className="absolute inset-0 bg-slate-900 -z-10" />

      <SidebarHeader className="!bg-transparent">
        <div className="flex items-center gap-3 px-2 py-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30"
          >
            <Package className="size-5" />
          </motion.div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-white">Entreposto</span>
            <span className="truncate text-[10px] uppercase tracking-wider text-slate-400 font-semibold">ERP Caipira</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="!bg-transparent">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2 px-3">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {data.navMain.map((item) => {
                const isActive = pathname?.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={`rounded-lg transition-all duration-200 h-10 ${
                        isActive
                          ? 'bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md shadow-blue-600/25'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
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

      <SidebarFooter className="!bg-transparent border-t border-slate-800 mt-auto">
        <SidebarMenu className="px-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Configurações"
              className="rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 h-10"
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
