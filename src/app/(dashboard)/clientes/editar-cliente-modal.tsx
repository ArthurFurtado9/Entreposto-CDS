"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Loader2 } from "lucide-react"
import { editarCliente } from "@/actions/clientes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formatPhoneOrCell, formatCnpj } from "@/lib/utils"
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
  const [fetchingCnpj, setFetchingCnpj] = useState(false)

  // Controlled Form State
  const [nome, setNome] = useState(cliente.nome)
  const [cnpj, setCnpj] = useState(cliente.cnpj ? formatCnpj(cliente.cnpj) : "")
  const [email, setEmail] = useState(cliente.email || "")
  const [cep, setCep] = useState(cliente.cep || "")
  const [rua, setRua] = useState(cliente.rua || "")
  const [bairro, setBairro] = useState(cliente.bairro || "")
  const [cidade, setCidade] = useState(cliente.cidade || "")
  const [estado, setEstado] = useState(cliente.estado || "")
  const [telefone, setTelefone] = useState(cliente.telefone ? formatPhoneOrCell(cliente.telefone) : "")
  const [contato, setContato] = useState(cliente.contato || "")

  async function handleCnpjBlur(e: React.FocusEvent<HTMLInputElement>) {
    const rawCnpj = e.target.value.replace(/\D/g, "")
    if (rawCnpj.length !== 14) return

    setFetchingCnpj(true)
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`)
      const data = await res.json()
      if (res.ok && data) {
        setNome(data.razao_social || data.nome_fantasia || "")
        if (data.cep) {
          setCep(data.cep)
          setRua(data.logradouro || "")
          setBairro(data.bairro || "")
          setCidade(data.municipio || "")
          setEstado(data.uf || "")
        }
        if (data.ddd_telefone_1) {
          setTelefone(formatPhoneOrCell(`(${data.ddd_telefone_1.substring(0, 2)}) ${data.ddd_telefone_1.substring(2)}`))
        } else if (data.telefone) {
          setTelefone(formatPhoneOrCell(data.telefone))
        }
        if (data.email) {
          setEmail(data.email)
        }
        toast.success("Dados da empresa preenchidos via CNPJ!")
      } else {
        toast.error("CNPJ não encontrado ou erro na busca.")
      }
    } catch (err) {
      toast.error("Erro ao buscar CNPJ.")
    } finally {
      setFetchingCnpj(false)
    }
  }

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const rawCep = e.target.value.replace(/\D/g, "")
    if (rawCep.length !== 8) return

    setFetchingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
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

    const rawData = {
      nome,
      cnpj,
      email,
      cep,
      rua,
      bairro,
      cidade,
      estado,
      telefone,
      contato,
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
        setNome(cliente.nome)
        setCnpj(cliente.cnpj ? formatCnpj(cliente.cnpj) : "")
        setEmail(cliente.email || "")
        setCep(cliente.cep || "")
        setRua(cliente.rua || "")
        setBairro(cliente.bairro || "")
        setCidade(cliente.cidade || "")
        setEstado(cliente.estado || "")
        setTelefone(cliente.telefone ? formatPhoneOrCell(cliente.telefone) : "")
        setContato(cliente.contato || "")
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
              Atualize as informações cadastrais do cliente B2B. Digite o CNPJ para preencher os dados automaticamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4 text-left">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome / Razão Social</Label>
              <Input 
                id="nome" 
                name="nome" 
                value={nome} 
                onChange={e => setNome(e.target.value)}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cnpj" className="flex items-center gap-1">
                  CNPJ (Opcional)
                  {fetchingCnpj && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
                </Label>
                <Input 
                  id="cnpj" 
                  name="cnpj" 
                  value={cnpj} 
                  onChange={e => setCnpj(formatCnpj(e.target.value))}
                  onBlur={handleCnpjBlur}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail (Opcional)</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                />
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
                  value={cep} 
                  onChange={e => setCep(e.target.value)}
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
                <Input 
                  id="telefone" 
                  name="telefone" 
                  value={telefone} 
                  onChange={e => setTelefone(formatPhoneOrCell(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contato">Nome do Contato</Label>
                <Input 
                  id="contato" 
                  name="contato" 
                  value={contato} 
                  onChange={e => setContato(e.target.value)}
                />
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

