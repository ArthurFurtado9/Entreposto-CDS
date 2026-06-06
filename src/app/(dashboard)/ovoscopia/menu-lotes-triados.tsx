"use client"

import { useState } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { excluirLote, editarTriagem } from "@/actions/ovoscopia"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MenuLotesTriados({ lote, isAdmin }: { lote: any, isAdmin: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // Estados dos inputs de quebra
  const [trincados, setTrincados] = useState<number>(lote.quantidadeTrincados)
  const [quebrados, setQuebrados] = useState<number>(lote.quantidadeQuebrados)
  const [descarte, setDescarte] = useState<number>(lote.quantidadeDescarte)

  // Cálculo ao vivo do aproveitamento
  const totalQuebras = trincados + quebrados + descarte
  const aproveitada = Math.max(0, lote.quantidadeOriginal - totalQuebras)
  const rendimentoPorcentagem = (aproveitada / lote.quantidadeOriginal) * 100

  const handleExcluir = async () => {
    if (!confirm("Tem certeza que deseja excluir este lote? Lotes triados podem já ter sido utilizados em pedidos ou ter financeiro gerado.")) return
    
    setIsDeleting(true)
    try {
      const result = await excluirLote(lote.id)
      if (result.success) {
        toast.success("Lote excluído com sucesso.")
      } else {
        toast.error(result.error || "Erro ao excluir lote.")
      }
    } catch (e) {
      toast.error("Erro inesperado.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = async () => {
    if (totalQuebras > lote.quantidadeOriginal) {
      toast.error("A soma das quebras não pode exceder a quantidade original do lote.")
      return
    }

    setIsSaving(true)
    try {
      const result = await editarTriagem({
        loteId: lote.id,
        quebras: {
          trincados: Number(trincados),
          quebrados: Number(quebrados),
          descarte: Number(descarte)
        }
      })
      if (result.success) {
        toast.success("Lote de triagem atualizado com sucesso.")
        setEditOpen(false)
      } else {
        toast.error(result.error || "Erro ao atualizar lote.")
      }
    } catch (e) {
      toast.error("Erro inesperado ao salvar alterações.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={editOpen} onOpenChange={(open) => {
      setEditOpen(open)
      if (open) {
        // Reseta os valores ao abrir para garantir sincronia com os props atuais
        setTrincados(lote.quantidadeTrincados)
        setQuebrados(lote.quantidadeQuebrados)
        setDescarte(lote.quantidadeDescarte)
      }
    }}>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 p-0" />}>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger render={<DropdownMenuItem onSelect={(e) => e.preventDefault()} />}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Lote
          </DialogTrigger>
          {isAdmin && (
            <DropdownMenuItem onClick={handleExcluir} disabled={isDeleting} className="text-red-600 focus:bg-red-50 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Lote
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Editar Lote: {lote.id.slice(-6)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Fornecedor</Label>
              <Input defaultValue={lote.fornecedor?.nome} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <Label>Qtd. Original (Ovos)</Label>
              <Input defaultValue={lote.quantidadeOriginal} disabled className="bg-slate-50" />
            </div>
          </div>

          <div className="border-t border-slate-100 my-2 pt-2">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Ajustar Quebras (Triagem)</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="trincados-edit">Trincados</Label>
                <Input 
                  id="trincados-edit"
                  type="number" 
                  min={0}
                  value={trincados} 
                  onChange={(e) => setTrincados(Math.max(0, parseInt(e.target.value) || 0))} 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quebrados-edit">Quebrados</Label>
                <Input 
                  id="quebrados-edit"
                  type="number" 
                  min={0}
                  value={quebrados} 
                  onChange={(e) => setQuebrados(Math.max(0, parseInt(e.target.value) || 0))} 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="descarte-edit">Descarte</Label>
                <Input 
                  id="descarte-edit"
                  type="number" 
                  min={0}
                  value={descarte} 
                  onChange={(e) => setDescarte(Math.max(0, parseInt(e.target.value) || 0))} 
                />
              </div>
            </div>
          </div>

          {/* Resumo dinâmico */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-400">Novo Aproveitado: </span>
              <strong className="text-slate-800 text-sm">{aproveitada} ovos</strong>
            </div>
            <div>
              <span className="text-slate-400">Rendimento: </span>
              <strong className={`text-sm ${rendimentoPorcentagem >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {rendimentoPorcentagem.toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isSaving}>Cancelar</Button>
          <Button onClick={handleEdit} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
