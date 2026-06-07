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
import { Trash2, Loader2, Calendar, Pencil } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { estornarRecebimentoLote, editarRecebimentoLote } from "@/actions/fornecedores"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Lote {
  id: string
  quantidadeOriginal: number
  dataRecebimento: Date | string
  status: "RECEBIDO" | "AGUARDANDO_TRIAGEM" | "TRIADO"
  fornecedorId: string
  fornecedor: {
    nome: string
  }
  financeiro?: {
    valor: number
  } | null
}

interface UltimasEntradasTableProps {
  lotes: Lote[]
  fornecedores: { id: string; nome: string }[]
}

export function UltimasEntradasTable({ lotes, fornecedores }: UltimasEntradasTableProps) {
  const router = useRouter()
  const [selectedLoteId, setSelectedLoteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Estados para edição
  const [editLote, setEditLote] = useState<Lote | null>(null)
  const [editFornecedorId, setEditFornecedorId] = useState("")
  const [editQuantidade, setEditQuantidade] = useState(0)
  const [editDataRecebimento, setEditDataRecebimento] = useState("")
  const [editValorBandeja, setEditValorBandeja] = useState(0)
  const [isEditing, setIsEditing] = useState(false)

  const handleStartEdit = (lote: Lote) => {
    setEditLote(lote)
    setEditFornecedorId(lote.fornecedorId)
    setEditQuantidade(lote.quantidadeOriginal)
    
    // Format date to local yyyy-MM-dd safely
    const d = new Date(lote.dataRecebimento)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    setEditDataRecebimento(`${year}-${month}-${day}`)
    
    const valBandeja = lote.financeiro 
      ? (Number(lote.financeiro.valor) / (lote.quantidadeOriginal / 30))
      : 0
    setEditValorBandeja(Number(valBandeja.toFixed(2)))
  }

  async function handleConfirmEdit(event: React.FormEvent) {
    event.preventDefault()
    if (!editLote) return
    setIsEditing(true)

    const data = {
      fornecedorId: editFornecedorId,
      quantidadeOriginal: editQuantidade,
      validadeOriginal: editDataRecebimento,
      valorBandeja: editValorBandeja,
    }

    try {
      const result = await editarRecebimentoLote(editLote.id, data)
      if (result.success) {
        toast.success("Lote editado com sucesso!")
        setEditLote(null)
        router.refresh()
      } else {
        toast.error(result.error || "Erro ao editar lote.")
      }
    } catch (e) {
      toast.error("Erro inesperado ao editar lote.")
    } finally {
      setIsEditing(false)
    }
  }

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
            Aguardando Ovoscopia
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
            Histórico recente de recebimentos. Você pode editar ou estornar lançamentos que ainda não passaram pela ovoscopia.
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
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
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
                          <div className="flex justify-end gap-1">
                            {isAguardando ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-slate-600 hover:bg-slate-100"
                                  onClick={() => handleStartEdit(lote)}
                                  title="Editar recebimento"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => setSelectedLoteId(lote.id)}
                                  title="Estornar recebimento"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  disabled
                                  className="text-slate-300"
                                  title="Lotes triados não podem ser editados"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  disabled
                                  className="text-slate-300"
                                  title="Não é possível estornar lotes já triados"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
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

      {/* Dialog de Confirmação de Estorno */}
      <Dialog open={selectedLoteId !== null} onOpenChange={(open) => !open && setSelectedLoteId(null)}>
        <DialogContent className="sm:max-w-md bg-white">
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

      {/* Dialog de Edição */}
      <Dialog open={editLote !== null} onOpenChange={(open) => !open && setEditLote(null)}>
        <DialogContent className="sm:max-w-md bg-white">
          <form onSubmit={handleConfirmEdit}>
            <DialogHeader>
              <DialogTitle>Editar Lote de Entrada</DialogTitle>
              <DialogDescription>
                Atualize as informações do lote de entrada. O ID #{editLote?.id.slice(-6).toUpperCase()} será mantido.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editFornecedorId">Fornecedor (Granja)</Label>
                <Select 
                  value={editFornecedorId} 
                  onValueChange={(val) => setEditFornecedorId(val || "")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a granja de origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="editQuantidade">Quantidade (Ovos)</Label>
                <Input 
                  id="editQuantidade" 
                  type="number" 
                  value={editQuantidade || ""} 
                  onChange={(e) => setEditQuantidade(parseInt(e.target.value))}
                  required 
                  min="1"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="editDataRecebimento">Data de Recebimento</Label>
                <Input 
                  id="editDataRecebimento" 
                  type="date" 
                  value={editDataRecebimento} 
                  onChange={(e) => setEditDataRecebimento(e.target.value)}
                  required 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="editValorBandeja" className="flex items-center gap-1.5 whitespace-nowrap">
                  Valor da Bandeja (30 ovos)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">R$</span>
                  <Input 
                    id="editValorBandeja" 
                    type="number" 
                    step="0.01" 
                    className="pl-8"
                    value={editValorBandeja || ""} 
                    onChange={(e) => setEditValorBandeja(parseFloat(e.target.value))}
                    required 
                    min="0.01"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                disabled={isEditing}
                onClick={() => setEditLote(null)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isEditing}
                className="bg-slate-900 text-white"
              >
                {isEditing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
