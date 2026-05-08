"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Loader2 } from "lucide-react"
import { atualizarEstoqueInsumoExato } from "@/actions/producao"
import { toast } from "sonner"

interface Insumo {
  id: string
  nome: string
  estoqueAtual: number
  unidade: string
}

export function EditarInsumoModal({ insumo }: { insumo: Insumo }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const novaQuantidade = Number(formData.get("quantidade"))

    try {
      const result = await atualizarEstoqueInsumoExato(insumo.id, novaQuantidade)
      if (result.success) {
        toast.success("Quantidade de estoque atualizada com sucesso!")
        setOpen(false)
      } else {
        toast.error(result.error || "Erro ao atualizar quantidade.")
      }
    } catch (error) {
      toast.error("Erro inesperado ao salvar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Quantidade de Estoque</DialogTitle>
            <DialogDescription>
              Informe a quantidade exata atual para o insumo <strong>{insumo.nome}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantidade">Quantidade Atual ({insumo.unidade})</Label>
              <Input 
                id="quantidade" 
                name="quantidade" 
                type="number" 
                defaultValue={insumo.estoqueAtual} 
                required 
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Estoque"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
