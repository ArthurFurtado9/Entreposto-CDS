import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { getFornecedoresStats, getFornecedoresGraficosData } from "@/actions/fornecedores"
import { NovoFornecedorModal } from "./novo-fornecedor-modal"
import { EditarFornecedorModal } from "./editar-fornecedor-modal"
import { Building2, Phone, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getCurrentUser } from "@/lib/auth-utils"
import { BotaoExcluirFornecedor } from "./botao-excluir-fornecedor"
import { Badge } from "@/components/ui/badge"
import { GraficosFornecedores } from "./graficos-fornecedores"

export const dynamic = "force-dynamic"

export default async function FornecedoresPage() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  const [statsResult, chartsResult] = await Promise.all([
    getFornecedoresStats(),
    getFornecedoresGraficosData()
  ])

  const fornecedores = (statsResult.success && statsResult.data) ? statsResult.data : []
  const graficosData = (chartsResult.success && chartsResult.data) ? chartsResult.data : {
    volumeMensal: [],
    historicoRefugo: [],
    nomesFornecedores: []
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Gestão de Fornecedores</h1>
          <p className="text-sm text-muted-foreground">Cadastre e gerencie as granjas parceiras.</p>
        </div>
        <NovoFornecedorModal />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo - Tabela de Fornecedores */}
        <div className="lg:col-span-7 w-full">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Lista de Granjas</CardTitle>
              <CardDescription>Todas as empresas cadastradas no sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table className="min-w-[650px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Ovos Recebidos (Mês)</TableHead>
                      <TableHead>Aproveitamento (Mês)</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="w-[80px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fornecedores.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                          Nenhum fornecedor cadastrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fornecedores.map((f: any) => (
                        <TableRow key={f.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              <div className="flex flex-col">
                                <span>{f.nome}</span>
                                {f.email && <span className="text-xs text-muted-foreground font-normal">{f.email}</span>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              {f.contato || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-700">
                            {f.totalRecebidoMes.toLocaleString("pt-BR")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={f.rendimentoMedioMes >= 95 ? "default" : f.rendimentoMedioMes > 0 ? "destructive" : "secondary"}>
                              {f.rendimentoMedioMes.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              {format(new Date(f.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <EditarFornecedorModal fornecedor={f} />
                              {isAdmin && <BotaoExcluirFornecedor id={f.id} />}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lado Direito - Gráficos Comparativos */}
        <div className="lg:col-span-5 w-full">
          <GraficosFornecedores 
            volumeMensal={graficosData.volumeMensal}
            historicoRefugo={graficosData.historicoRefugo}
            nomesFornecedores={graficosData.nomesFornecedores}
          />
        </div>
      </div>
    </div>
  )
}
