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
import { criarFornecedor } from "@/actions/fornecedores"
import { toast } from "sonner"

export function NovoFornecedorModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      nome: formData.get("nome") as string,
      contato: formData.get("contato") as string,
      email: formData.get("email") as string,
    }

    try {
      const result = await criarFornecedor(data)
      if (result.success) {
        toast.success("Fornecedor cadastrado com sucesso!")
        setOpen(false)
      } else {
        toast.error(result.error || "Erro ao cadastrar fornecedor.")
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
        <Button className="bg-slate-900 hover:bg-slate-800">
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Granja</DialogTitle>
            <DialogDescription>
              Adicione um novo fornecedor de ovos ao sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Granja / Empresa</Label>
              <Input id="nome" name="nome" placeholder="Ex: Granja Bela Vista" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contato">Contato / Telefone</Label>
              <Input id="contato" name="contato" placeholder="(00) 00000-0000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" placeholder="contato@granja.com" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Fornecedor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
