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
import { darBaixaConta } from "@/actions/financeiro"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle2, Loader2 } from "lucide-react"

interface ContasAReceberTableProps {
  initialData: any[]
}

export function ContasAReceberTable({ initialData }: ContasAReceberTableProps) {
  const [data, setData] = useState(initialData)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDarBaixa = async (id: string) => {
    setLoadingId(id)
    try {
      const result = await darBaixaConta(id)
      if (result.success) {
        toast.success("Recebimento registrado com sucesso!")
        setData((prev) => 
          prev.map((item) => 
            item.id === id ? { ...item, status: "PAGO" } : item
          )
        )
      } else {
        toast.error(result.error || "Erro ao processar recebimento.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Pedido Ref.</TableHead>
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
              Nenhuma fatura a receber encontrada.
            </TableCell>
          </TableRow>
        ) : (
          data.map((conta) => (
            <TableRow key={conta.id}>
              <TableCell className="font-medium">
                {conta.pedido?.cliente?.nome || "N/A"}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {conta.pedidoId?.slice(-8).toUpperCase() || "N/A"}
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
                  {conta.status === "PAGO" ? "RECEBIDO" : conta.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {conta.status === "PENDENTE" && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 border-green-200 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleDarBaixa(conta.id)}
                    disabled={loadingId === conta.id}
                  >
                    {loadingId === conta.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        Registrar PGTO
                      </>
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
