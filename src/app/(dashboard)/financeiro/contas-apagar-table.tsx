"use client"

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
import { toast } from "sonner"
import { darBaixaConta, excluirConta, estornarConta } from "@/actions/financeiro"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, Loader2, Trash2 } from "lucide-react"

interface ContasApagarTableProps {
  initialData: any[]
  isAdmin?: boolean
}

export function ContasApagarTable({ initialData, isAdmin }: ContasApagarTableProps) {
  const [data, setData] = useState(initialData)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDarBaixa = async (id: string) => {
    if (!confirm("Tem certeza que quer registrar o pagamento (dar baixa) desta conta?")) {
      return
    }
    setLoadingId(id)
    try {
      const result = await darBaixaConta(id)
      if (result.success) {
        toast.success("Pagamento registrado com sucesso!")
        setData((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, status: "PAGO" } : item
          )
        )
      } else {
        toast.error(result.error || "Erro ao processar pagamento.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setLoadingId(null)
    }
  }

  const handleEstornar = async (id: string) => {
    if (!confirm("Tem certeza que deseja estornar (cancelar a baixa) desta conta? Ela voltará para o status PENDENTE.")) {
      return
    }
    setLoadingId(id)
    try {
      const result = await estornarConta(id)
      if (result.success) {
        toast.success("Pagamento estornado com sucesso!")
        setData((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, status: "PENDENTE" } : item
          )
        )
      } else {
        toast.error(result.error || "Erro ao estornar pagamento.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setLoadingId(null)
    }
  }

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir permanentemente esta conta? Esta ação não pode ser desfeita e removerá o registro de todos os cálculos.")) {
      return
    }
    setDeletingId(id)
    try {
      const result = await excluirConta(id)
      if (result.success) {
        toast.success("Conta excluída com sucesso!")
        setData((prev) => prev.filter((item) => item.id !== id))
      } else {
        toast.error(result.error || "Erro ao excluir conta.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="overflow-x-auto">
    <Table className="min-w-[700px]">
      <TableHeader>
        <TableRow>
          <TableHead>Fornecedor</TableHead>
          <TableHead>Lote Ref.</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Nenhuma conta a pagar encontrada.
            </TableCell>
          </TableRow>
        ) : (
          data.map((conta) => (
            <TableRow key={conta.id}>
              <TableCell className="font-medium">
                {conta.loteEntrada?.fornecedor?.nome || "N/A"}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {conta.loteEntradaId?.slice(-8).toUpperCase() || "N/A"}
              </TableCell>
              <TableCell>
                {format(new Date(conta.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="font-semibold text-slate-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(conta.valor))}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={conta.status === "PENDENTE" ? "secondary" : "default"}
                  className={
                    conta.status === "PENDENTE" 
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }
                >
                  {conta.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                   {conta.status === "PENDENTE" ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 border-green-200 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleDarBaixa(conta.id)}
                      disabled={loadingId === conta.id || deletingId === conta.id}
                    >
                      {loadingId === conta.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Dar Baixa
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700 text-xs"
                      onClick={() => handleEstornar(conta.id)}
                      disabled={loadingId === conta.id || deletingId === conta.id}
                    >
                      {loadingId === conta.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Estornar"
                      )}
                    </Button>
                  )}
                  {isAdmin && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleExcluir(conta.id)}
                      disabled={loadingId === conta.id || deletingId === conta.id}
                    >
                      {deletingId === conta.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
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
