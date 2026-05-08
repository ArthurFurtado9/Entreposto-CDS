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
import { criarCliente } from "@/actions/logistica"
import { toast } from "sonner"

export function NovoClienteModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      nome: formData.get("nome") as string,
      cnpj: formData.get("cnpj") as string,
    }

    try {
      const result = await criarCliente(data)
      if (result.success) {
        toast.success("Cliente cadastrado com sucesso!")
        setOpen(false)
      } else {
        toast.error(result.error || "Erro ao cadastrar cliente.")
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
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Cliente
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente à base de dados para facilitar na hora do carregamento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome ou Razão Social</Label>
              <Input id="nome" name="nome" placeholder="Ex: Supermercado Central" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
              <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" />
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
