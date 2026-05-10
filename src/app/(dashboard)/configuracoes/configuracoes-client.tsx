"use client"

import {
  Settings,
  Building2,
  CircleDollarSign,
  Users,
  Shield,
  Database,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabEmpresa } from "./tab-empresa"
import { TabFinanceiro } from "./tab-financeiro"
import { TabEquipe } from "./tab-equipe"
import { TabSeguranca } from "./tab-seguranca"
import { TabDados } from "./tab-dados"

interface ConfiguracoesClientProps {
  currentUserId: string
  companyProfile: any
  expenseCategories: any[]
  paymentConditions: any[]
  users: any[]
  auditLogs: any[]
}

export function ConfiguracoesClient({
  currentUserId,
  companyProfile,
  expenseCategories,
  paymentConditions,
  users,
  auditLogs,
}: ConfiguracoesClientProps) {
  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 dark:bg-zinc-950 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Settings className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Configurações
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as configurações do sistema ERP
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="empresa" className="space-y-6">
        <div className="overflow-x-auto pb-1">
          <TabsList className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm h-11 gap-1 p-1">
            <TabsTrigger
              value="empresa"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md px-4 rounded-lg transition-all"
            >
              <Building2 className="size-4" />
              <span className="hidden sm:inline">Empresa</span>
            </TabsTrigger>
            <TabsTrigger
              value="financeiro"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md px-4 rounded-lg transition-all"
            >
              <CircleDollarSign className="size-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger
              value="equipe"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md px-4 rounded-lg transition-all"
            >
              <Users className="size-4" />
              <span className="hidden sm:inline">Equipe</span>
            </TabsTrigger>
            <TabsTrigger
              value="seguranca"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md px-4 rounded-lg transition-all"
            >
              <Shield className="size-4" />
              <span className="hidden sm:inline">Segurança</span>
            </TabsTrigger>
            <TabsTrigger
              value="dados"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md px-4 rounded-lg transition-all"
            >
              <Database className="size-4" />
              <span className="hidden sm:inline">Dados</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="empresa" className="border-none p-0 outline-none mt-0">
          <TabEmpresa initialData={companyProfile} />
        </TabsContent>

        <TabsContent value="financeiro" className="border-none p-0 outline-none mt-0">
          <TabFinanceiro
            initialCategories={expenseCategories}
            initialConditions={paymentConditions}
          />
        </TabsContent>

        <TabsContent value="equipe" className="border-none p-0 outline-none mt-0">
          <TabEquipe initialUsers={users} currentUserId={currentUserId} />
        </TabsContent>

        <TabsContent value="seguranca" className="border-none p-0 outline-none mt-0">
          <TabSeguranca initialLogs={auditLogs} />
        </TabsContent>

        <TabsContent value="dados" className="border-none p-0 outline-none mt-0">
          <TabDados />
        </TabsContent>
      </Tabs>
    </div>
  )
}
