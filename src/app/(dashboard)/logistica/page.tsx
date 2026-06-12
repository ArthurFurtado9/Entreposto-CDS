import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { getPedidosLogistica, getLotesDisponiveis, getClientes } from "@/actions/logistica"
import { BotaoCarregamento } from "./botao-carregamento"
import { EditarPedidoModal } from "./editar-pedido-modal"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getCurrentUser } from "@/lib/auth-utils"
import { BotaoExcluirPedido } from "./botao-excluir-pedido"

export default async function LogisticaPage() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  const resultPedidos = await getPedidosLogistica()
  const resultLotes = await getLotesDisponiveis()
  const resultClientes = await getClientes()
  
  const pedidos = (resultPedidos.success && resultPedidos.data) ? resultPedidos.data : []
  const estoqueLotes = (resultLotes.success && resultLotes.data) ? resultLotes.data : []
  const clientes = (resultClientes.success && resultClientes.data) ? resultClientes.data : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Vendas e Saídas</h1>
          <p className="text-sm text-muted-foreground">Gerencie a separação de pedidos B2B e alocação de estoque.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <BotaoCarregamento lotes={estoqueLotes} clientes={clientes} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Painel de Saídas</CardTitle>
            <CardDescription>Pedidos aguardando separação e envio.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table className="min-w-[500px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Qtd (Ovos)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-4">Nenhum pedido encontrado.</TableCell>
                  </TableRow>
                )}
                {pedidos.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id.slice(-6)}</TableCell>
                    <TableCell>{p.cliente}</TableCell>
                    <TableCell>{p.qtd}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "PENDENTE" ? "outline" : p.status === "SEPARACAO" ? "default" : "secondary"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <EditarPedidoModal pedidoId={p.id} clientes={clientes} lotes={estoqueLotes} />
                        {isAdmin && <BotaoExcluirPedido id={p.id} />}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Alocação FIFO (Saída Inteligente)</CardTitle>
            <CardDescription>Lotes sugeridos pelo sistema para saída prioritária.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {estoqueLotes.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">Nenhum lote disponível.</div>
                )}
                {estoqueLotes.map((l: any) => (
                   <div key={l.id} className="flex items-center gap-4 border p-3 rounded-lg relative overflow-hidden">
                      {l.status === "FIFO" && (
                         <div className="absolute top-0 right-0 bg-orange-500 text-[10px] text-white px-2 py-0.5 font-bold rounded-bl-lg">
                            PRIORIDADE (FIFO)
                         </div>
                      )}
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                         <Package2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                         <p className="font-mono text-sm font-bold">{l.id.slice(-8)}</p>
                         <p className="text-xs text-muted-foreground">Vencimento: {format(new Date(l.validade), "dd/MM/yyyy", { locale: ptBR })}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold">{l.ovos}</p>
                         <p className="text-[10px] text-muted-foreground uppercase">Ovos</p>
                      </div>
                       {l.status === "RESERVADO" && (
                         <div className="ml-2">
                            <Badge variant="outline">Bloqueado</Badge>
                         </div>
                       )}
                   </div>
                ))}
             </div>
             <div className="mt-4 p-4 bg-muted rounded-lg border border-dashed text-center">
                <p className="text-xs text-muted-foreground italic">
                   Travamento de estoque ativado: Lotes em carregamento são reservados automaticamente para evitar vendas duplicadas.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Package2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.91A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.09L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}
