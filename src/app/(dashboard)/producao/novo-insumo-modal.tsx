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
import { Plus, Loader2 } from "lucide-react"
import { criarInsumo } from "@/actions/producao"
import { toast } from "sonner"

export function NovoInsumoModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      nome: formData.get("nome") as string,
      unidade: formData.get("unidade") as string,
      estoqueAtual: Number(formData.get("estoqueAtual")),
      estoqueMinimo: Number(formData.get("estoqueMinimo")),
    }

    try {
      const result = await criarInsumo(data)
      if (result.success) {
        toast.success("Insumo cadastrado com sucesso!")
        setOpen(false)
      } else {
        toast.error(result.error || "Erro ao cadastrar insumo.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-slate-900">
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Insumo
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Insumo</DialogTitle>
            <DialogDescription>
              Adicione um novo insumo ao estoque de produção.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Insumo</Label>
              <Input id="nome" name="nome" placeholder="Ex: Bandeja 30 Ovos" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unidade">Unidade de Medida</Label>
              <Input id="unidade" name="unidade" placeholder="Ex: Unidade, Cento, Rolo" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="estoqueAtual">Estoque Atual</Label>
                <Input id="estoqueAtual" name="estoqueAtual" type="number" min="0" step="0.01" defaultValue="0" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                <Input id="estoqueMinimo" name="estoqueMinimo" type="number" min="0" step="0.01" defaultValue="0" required />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
