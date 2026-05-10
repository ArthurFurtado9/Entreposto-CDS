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
import { excluirLote } from "@/actions/ovoscopia"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MenuLotesTriados({ lote, isAdmin }: { lote: any, isAdmin: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

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

  const handleEdit = () => {
    toast.info("A edição avançada de lotes triados será disponibilizada na próxima atualização.")
    setEditOpen(false)
  }

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Lote: {lote.id.slice(-6)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Fornecedor</Label>
            <Input defaultValue={lote.fornecedor?.nome} disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Qtd. Original</Label>
              <Input defaultValue={lote.quantidadeOriginal} disabled />
            </div>
            <div className="space-y-2">
              <Label>Aproveitada</Label>
              <Input defaultValue={lote.quantidadeAproveitada} disabled />
            </div>
          </div>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg border">
            Nota: Atualmente, para alterar quebras de um lote triado que já está em uso, é necessário excluí-lo e registrar o recebimento novamente. Edição direta em desenvolvimento.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button onClick={handleEdit}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
