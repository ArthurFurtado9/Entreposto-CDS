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
import { Pencil, Loader2 } from "lucide-react"
import { atualizarFornecedor } from "@/actions/fornecedores"
import { toast } from "sonner"

interface Fornecedor {
  id: string
  nome: string
  contato?: string | null
  email?: string | null
}

export function EditarFornecedorModal({ fornecedor }: { fornecedor: Fornecedor }) {
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
      const result = await atualizarFornecedor(fornecedor.id, data)
      if (result.success) {
        toast.success("Fornecedor atualizado com sucesso!")
        setOpen(false)
      } else {
        toast.error(result.error || "Erro ao atualizar fornecedor.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Granja</DialogTitle>
            <DialogDescription>
              Atualize os dados deste fornecedor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Granja / Empresa</Label>
              <Input id="nome" name="nome" defaultValue={fornecedor.nome} placeholder="Ex: Granja Bela Vista" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contato">Contato / Telefone</Label>
              <Input id="contato" name="contato" defaultValue={fornecedor.contato || ""} placeholder="(00) 00000-0000" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" defaultValue={fornecedor.email || ""} placeholder="contato@granja.com" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
