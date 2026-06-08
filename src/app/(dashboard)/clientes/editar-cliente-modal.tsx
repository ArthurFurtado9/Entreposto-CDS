"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Loader2 } from "lucide-react"
import { editarCliente } from "@/actions/clientes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Cliente {
  id: string
  nome: string
  cnpj: string | null
  email: string | null
  cep: string | null
  rua: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  telefone: string | null
  contato: string | null
}

export function EditarClienteModal({ cliente }: { cliente: Cliente }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingCep, setFetchingCep] = useState(false)

  // Estados locais para preenchimento de endereço
  const [rua, setRua] = useState(cliente.rua || "")
  const [bairro, setBairro] = useState(cliente.bairro || "")
  const [cidade, setCidade] = useState(cliente.cidade || "")
  const [estado, setEstado] = useState(cliente.estado || "")

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.target.value.replace(/\D/g, "")
    if (cep.length !== 8) return

    setFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (data.erro) {
        toast.error("CEP não encontrado.")
      } else {
        setRua(data.logradouro || "")
        setBairro(data.bairro || "")
        setCidade(data.localidade || "")
        setEstado(data.uf || "")
        toast.success("Endereço preenchido via CEP!")
      }
    } catch (err) {
      toast.error("Erro ao buscar CEP.")
    } finally {
      setFetchingCep(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const rawData = {
      nome: formData.get("nome") as string,
      cnpj: formData.get("cnpj") as string,
      email: formData.get("email") as string,
      cep: formData.get("cep") as string,
      rua: formData.get("rua") as string,
      bairro: formData.get("bairro") as string,
      cidade: formData.get("cidade") as string,
      estado: formData.get("estado") as string,
      telefone: formData.get("telefone") as string,
      contato: formData.get("contato") as string,
    }

    try {
      const result = await editarCliente(cliente.id, rawData)
      if (result.success) {
        toast.success("Cliente atualizado com sucesso!")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Erro ao salvar alterações.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (val) {
        setRua(cliente.rua || "")
        setBairro(cliente.bairro || "")
        setCidade(cliente.cidade || "")
        setEstado(cliente.estado || "")
      }
    }}>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
          <Pencil className="h-4 w-4" />
        </Button>
      } />
      <DialogContent className="sm:max-w-[500px] bg-white max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações cadastrais do cliente B2B.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 text-left">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome / Razão Social</Label>
              <Input id="nome" name="nome" defaultValue={cliente.nome} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                <Input id="cnpj" name="cnpj" defaultValue={cliente.cnpj || ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail (Opcional)</Label>
                <Input id="email" name="email" type="email" defaultValue={cliente.email || ""} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2 col-span-1">
                <Label htmlFor="cep" className="flex items-center gap-1">
                  CEP
                  {fetchingCep && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
                </Label>
                <Input 
                  id="cep" 
                  name="cep" 
                  defaultValue={cliente.cep || ""} 
                  onBlur={handleCepBlur}
                />
              </div>
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="rua">Rua / Logradouro</Label>
                <Input 
                  id="rua" 
                  name="rua" 
                  value={rua} 
                  onChange={e => setRua(e.target.value)} 
                  placeholder="Ex: Av. Júlio de Castilhos" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input 
                  id="bairro" 
                  name="bairro" 
                  value={bairro} 
                  onChange={e => setBairro(e.target.value)} 
                  placeholder="Ex: Centro" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input 
                  id="cidade" 
                  name="cidade" 
                  value={cidade} 
                  onChange={e => setCidade(e.target.value)} 
                  placeholder="Ex: Caxias do Sul" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Input 
                  id="estado" 
                  name="estado" 
                  value={estado} 
                  onChange={e => setEstado(e.target.value)} 
                  placeholder="Ex: RS" 
                  maxLength={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" name="telefone" defaultValue={cliente.telefone || ""} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contato">Nome do Contato</Label>
                <Input id="contato" name="contato" defaultValue={cliente.contato || ""} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading ? (
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
  )
}
