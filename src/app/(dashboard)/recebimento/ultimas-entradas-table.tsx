"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { estornarRecebimentoLote } from "@/actions/fornecedores"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Lote {
  id: string
  quantidadeOriginal: number
  dataRecebimento: Date | string
  status: "RECEBIDO" | "AGUARDANDO_TRIAGEM" | "TRIADO"
  fornecedor: {
    nome: string
  }
}

interface UltimasEntradasTableProps {
  lotes: Lote[]
}

export function UltimasEntradasTable({ lotes }: UltimasEntradasTableProps) {
  const router = useRouter()
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirmDelete() {
    if (!selectedLoteId) return
    setIsDeleting(true)
    try {
      const result = await estornarRecebimentoLote(selectedLoteId)
      if (result.success) {
        toast.success("Recebimento estornado com sucesso!")
        setSelectedLoteId(null)
        router.refresh()
      } else {
        toast.error(result.error || "Erro ao estornar lote.")
      }
    } catch (e) {
      toast.error("Erro inesperado.")
    } finally {
      setIsDeleting(false)
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "AGUARDANDO_TRIAGEM":
      case "RECEBIDO":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200/60 hover:bg-amber-100/80 font-medium">
            Aguardando Triagem
          </Badge>
        )
      case "TRIADO":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/80 font-medium">
            Triado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <Card className="border-none shadow-sm bg-white w-full">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            Últimas Entradas Registradas
          </CardTitle>
          <CardDescription>
            Histórico recente de recebimentos. Você pode estornar lançamentos que ainda não passaram pela triagem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">ID do Lote</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Quantidade (Ovos)</TableHead>
                  <TableHead>Data de Entrada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      Nenhum lote recebido recentemente.
                    </TableCell>
                  </TableRow>
                ) : (
                  lotes.map((lote) => {
                    const isAguardando = lote.status === "AGUARDANDO_TRIAGEM" || lote.status === "RECEBIDO"
                    return (
                      <TableRow key={lote.id} className="hover:bg-slate-50/50">
                        <TableCell className="font-mono text-xs font-semibold text-slate-500">
                          #{lote.id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700">
                          {lote.fornecedor.nome}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700">
                          {lote.quantidadeOriginal.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-slate-500">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {format(new Date(lote.dataRecebimento), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(lote.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          {isAguardando ? (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setSelectedLoteId(lote.id)}
                              title="Estornar recebimento"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled
                              className="text-slate-300"
                              title="Não é possível estornar lotes já triados"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedLoteId !== null} onOpenChange={(open) => !open && setSelectedLoteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Estornar Recebimento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja estornar este recebimento? Esta ação irá deletar permanentemente o lote e o respectivo lançamento financeiro associado. Esta operação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setSelectedLoteId(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Estornando...
                </>
              ) : (
                "Confirmar Estorno"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
