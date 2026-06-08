"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Building2, Phone, Calendar, Loader2 } from "lucide-react"
import { EditarClienteModal } from "./editar-cliente-modal"
import { excluirCliente } from "@/actions/clientes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Cliente {
  id: string
  nome: string
  cnpj: string | null
  email: string | null
  cep: string | null
  rua: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  telefone: string | null
  contato: string | null
  createdAt: Date | string
  pedidos: { id: string }[]
}

interface ClientesTableProps {
  clientes: Cliente[]
  isAdmin: boolean
}

export function ClientesTable({ clientes, isAdmin }: ClientesTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleExcluir(id: string) {
    if (!confirm("Tem certeza que deseja excluir este cliente permanentemente?")) {
      return
    }

    setDeletingId(id)
    try {
      const result = await excluirCliente(id)
      if (result.success) {
        toast.success("Cliente excluído com sucesso!")
        router.refresh()
      } else {
        toast.error(result.error || "Erro ao excluir cliente.")
      }
    } catch (e) {
      toast.error("Erro inesperado ao excluir cliente.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <Table className="min-w-[650px]">
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Pedidos</TableHead>
            <TableHead>Cadastro</TableHead>
            <TableHead className="w-[80px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                Nenhum cliente cadastrado.
              </TableCell>
            </TableRow>
          ) : (
            clientes.map((c) => (
              <TableRow key={c.id} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-800">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <div className="flex flex-col">
                      <span>{c.nome}</span>
                      {c.cnpj && <span className="text-[10px] text-muted-foreground font-normal">{c.cnpj}</span>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs text-slate-600 gap-0.5">
                    {c.telefone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {c.telefone}
                      </div>
                    )}
                    {c.email && <span className="text-muted-foreground">{c.email}</span>}
                    {!c.telefone && !c.email && <span className="text-slate-400 font-normal">Sem contato</span>}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-700">
                  {c.pedidos.length} {c.pedidos.length === 1 ? "pedido" : "pedidos"}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {format(new Date(c.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <EditarClienteModal cliente={c} />
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleExcluir(c.id)}
                        disabled={deletingId === c.id}
                      >
                        {deletingId === c.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
