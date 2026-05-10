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
import { getFornecedores } from "@/actions/fornecedores"
import { NovoFornecedorModal } from "./novo-fornecedor-modal"
import { EditarFornecedorModal } from "./editar-fornecedor-modal"
import { Building2, Phone, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getCurrentUser } from "@/lib/auth-utils"
import { BotaoExcluirFornecedor } from "./botao-excluir-fornecedor"

export default async function FornecedoresPage() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  const result = await getFornecedores()
  const fornecedores = (result.success && result.data) ? result.data : []

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Gestão de Fornecedores</h1>
          <p className="text-sm text-muted-foreground">Cadastre e gerencie as granjas parceiras.</p>
        </div>
        <NovoFornecedorModal />
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Lista de Granjas</CardTitle>
          <CardDescription>Todas as empresas cadastradas no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    Nenhum fornecedor cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                fornecedores.map((f: any) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        {f.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {f.contato || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {f.email || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
  )
}
