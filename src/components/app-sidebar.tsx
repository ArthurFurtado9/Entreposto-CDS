"use client"

import * as React from "react"
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-orange-600 text-white">
            <Package className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Entreposto Serra</span>
            <span className="truncate text-xs">ERP Caipira</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} render={
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  } />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Configurações">
                <Settings />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
