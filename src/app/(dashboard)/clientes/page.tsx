import { getClientesList } from "@/actions/clientes"
import { ClientesTable } from "./clientes-table"
import { NovoClienteForm } from "./novo-cliente-form"
import { ClientRankingCard } from "./client-ranking-card"
import { getCurrentUser } from "@/lib/auth-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ClientesPage() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  const resultList = await getClientesList()
  const clientes = (resultList.success && resultList.data) ? resultList.data : []

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users2 className="h-6 w-6 text-slate-700" />
          Gestão de Clientes B2B
        </h1>
        <p className="text-sm text-muted-foreground">Cadastre, edite e acompanhe os compradores e distribuidores parceiros.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo - Tabela de Clientes */}
        <div className="lg:col-span-7 w-full space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-slate-900">Clientes Cadastrados</CardTitle>
              <CardDescription>Lista completa de distribuidores e parceiros.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClientesTable clientes={clientes as any} isAdmin={isAdmin} />
            </CardContent>
          </Card>
        </div>

        {/* Lado Direito - Ranking & Cadastro */}
        <div className="lg:col-span-5 w-full space-y-6">
          <ClientRankingCard />
          <NovoClienteForm />
        </div>
      </div>
    </div>
  )
}
