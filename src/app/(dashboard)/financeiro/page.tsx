import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CircleDollarSign, 
  ArrowDownCircle, 
  ArrowUpCircle,
  Calculator,
  Wallet,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { getContasAPagar, getContasAReceber } from "@/actions/financeiro"
import { ContasApagarTable } from "./contas-apagar-table"
import { ContasAReceberTable } from "./contas-areceber-table"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

export default async function FinanceiroPage() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  const resultPagar = await getContasAPagar()
  const contasAPagar = (resultPagar.success && resultPagar.data) ? resultPagar.data : []
  
  const resultReceber = await getContasAReceber()
  const contasAReceber = (resultReceber.success && resultReceber.data) ? resultReceber.data : []

  const totalPendentePagar = contasAPagar
    .filter(c => c.status === "PENDENTE")
    .reduce((acc, c) => acc + Number(c.valor), 0)

  const totalPendenteReceber = contasAReceber
    .filter(c => c.status === "PENDENTE")
    .reduce((acc, c) => acc + Number(c.valor), 0)

  const totalFaturamento = contasAReceber.reduce((acc, c) => acc + Number(c.valor), 0)
  const totalPagas = contasAPagar
    .filter(c => c.status === "PAGO")
    .reduce((acc, c) => acc + Number(c.valor), 0)

  const totalRecebido = contasAReceber
    .filter(c => c.status === "PAGO")
    .reduce((acc, c) => acc + Number(c.valor), 0)

  const lucroLiquido = totalRecebido - totalPagas
  const isLucroPositivo = lucroLiquido >= 0

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Módulo Financeiro</h1>
        <p className="text-muted-foreground">Gestão automatizada de contas e fluxo de caixa por lote.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {/* Highlighted Net Profit Card */}
        <Card className="border-none shadow-md bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 text-white hover:shadow-lg hover:shadow-indigo-600/15 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-indigo-100">Lucro Líquido</CardTitle>
            {isLucroPositivo ? (
              <TrendingUp className="h-4 w-4 text-emerald-300" />
            ) : (
              <TrendingDown className="h-4 w-4 text-rose-300" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroLiquido)}
            </div>
            <p className="text-[10px] text-indigo-200 mt-1">
              Recebido ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRecebido)}) - Pago
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm glass-panel hover-lift overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Faturamento (Mês)</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalFaturamento)}
            </div>
            <div className="flex items-center gap-1 mt-1">
               <Calculator className="h-3 w-3 text-muted-foreground" />
               <p className="text-[10px] text-muted-foreground">Total de faturas geradas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm glass-panel hover-lift overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Contas Pagas</CardTitle>
            <Wallet className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPagas)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total de despesas baixadas (Pagas)</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm glass-panel hover-lift overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Contas a Pagar</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendentePagar)}
            </div>
            <div className="flex items-center gap-1 mt-1">
               <Calculator className="h-3 w-3 text-muted-foreground" />
               <p className="text-[10px] text-muted-foreground">Obrigações não pagas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm glass-panel hover-lift overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Contas a Receber</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendenteReceber)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando recebimento</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pagar" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="pagar" className="data-[state=active]:bg-slate-100">Contas a Pagar</TabsTrigger>
            <TabsTrigger value="receber" className="data-[state=active]:bg-slate-100">Contas a Receber</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pagar" className="border-none p-0 outline-none">
           <Card className="border-none shadow-sm glass-panel">
              <CardHeader className="border-b border-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Pagamentos a Fornecedores</CardTitle>
                    <CardDescription>Lista de obrigações geradas automaticamente após triagem de lotes.</CardDescription>
                  </div>
                  <Badge variant="outline" className="h-6 bg-slate-50 text-slate-600 border-slate-200">
                    {contasAPagar.length} Registros
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ContasApagarTable initialData={JSON.parse(JSON.stringify(contasAPagar))} isAdmin={isAdmin} />
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="receber" className="border-none p-0 outline-none">
           <Card className="border-none shadow-sm glass-panel">
              <CardHeader className="border-b border-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Faturas de Clientes</CardTitle>
                    <CardDescription>Acompanhamento de recebíveis de vendas B2B.</CardDescription>
                  </div>
                  <Badge variant="outline" className="h-6 bg-slate-50 text-slate-600 border-slate-200">
                    {contasAReceber.length} Registros
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                 <ContasAReceberTable initialData={JSON.parse(JSON.stringify(contasAReceber))} isAdmin={isAdmin} />
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
