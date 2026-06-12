"use client"

import { useState, useCallback } from "react"
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
import { Pencil, Loader2, Search } from "lucide-react"
import { atualizarFornecedor } from "@/actions/fornecedores"
import { toast } from "sonner"
import { formatPhoneOrCell } from "@/lib/utils"

interface Fornecedor {
  id: string
  nome: string
  cnpj?: string | null
  contato?: string | null
  email?: string | null
  cep?: string | null
  rua?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
}

function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

function stripCnpj(value: string): string {
  return value.replace(/\D/g, "")
}

interface BrasilApiCnpjResponse {
  razao_social: string
  cep: string
  descricao_tipo_de_logradouro: string
  logradouro: string
  numero: string
  bairro: string
  municipio: string
  uf: string
  ddd_telefone_1: string
}

export function EditarFornecedorModal({ fornecedor }: { fornecedor: Fornecedor }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingCnpj, setFetchingCnpj] = useState(false)
  const [fetchingCep, setFetchingCep] = useState(false)

  // Controlled fields
  const [cnpj, setCnpj] = useState("")
  const [nome, setNome] = useState("")
  const [contato, setContato] = useState(fornecedor.contato ? formatPhoneOrCell(fornecedor.contato) : "")
  const [email, setEmail] = useState("")
  const [cep, setCep] = useState("")
  const [rua, setRua] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")

  const fetchCnpjData = useCallback(async (rawCnpj: string) => {
    setFetchingCnpj(true)
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`)
      if (!response.ok) {
        toast.error("CNPJ não encontrado ou inválido")
        return
      }
      const data: BrasilApiCnpjResponse = await response.json()
      
      setNome(data.razao_social || "")
      setCep(data.cep || "")
      const tipoLog = data.descricao_tipo_de_logradouro || ""
      const logradouro = data.logradouro || ""
      const numero = data.numero || ""
      setRua([tipoLog, logradouro, numero].filter(Boolean).join(" "))
      setBairro(data.bairro || "")
      setCidade(data.municipio || "")
      setEstado(data.uf || "")
      if (data.ddd_telefone_1) {
        setContato(formatPhoneOrCell(data.ddd_telefone_1))
      }
      toast.success("Dados preenchidos automaticamente!")
    } catch {
      toast.error("CNPJ não encontrado ou inválido")
    } finally {
      setFetchingCnpj(false)
    }
  }, [])

  function handleCnpjChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = stripCnpj(e.target.value)
    const formatted = formatCnpj(e.target.value)
    setCnpj(formatted)

    if (raw.length === 14) {
      fetchCnpjData(raw)
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

    const data = {
      nome,
      cnpj: stripCnpj(cnpj) || undefined,
      contato: contato || undefined,
      email: email || undefined,
      cep: cep || undefined,
      rua: rua || undefined,
      bairro: bairro || undefined,
      cidade: cidade || undefined,
      estado: estado || undefined,
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
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (val) {
        setNome(fornecedor.nome)
        setCnpj(fornecedor.cnpj ? formatCnpj(fornecedor.cnpj) : "")
        setContato(fornecedor.contato ? formatPhoneOrCell(fornecedor.contato) : "")
        setEmail(fornecedor.email || "")
        setCep(fornecedor.cep || "")
        setRua(fornecedor.rua || "")
        setBairro(fornecedor.bairro || "")
        setCidade(fornecedor.cidade || "")
        setEstado(fornecedor.estado || "")
      }
    }}>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
          <Pencil className="h-4 w-4" />
        </Button>
      } />
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Granja</DialogTitle>
            <DialogDescription>
              Atualize as informações cadastrais do fornecedor. Digite o CNPJ para preencher os dados automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-left">
            {/* CNPJ */}
            <div className="grid gap-2">
              <Label htmlFor="cnpj" className="flex items-center gap-1">
                CNPJ
                {fetchingCnpj && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
              </Label>
              <div className="relative">
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={cnpj}
                  onChange={handleCnpjChange}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {fetchingCnpj ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Search className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Nome / Razão Social */}
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome da Granja / Razão Social</Label>
              <Input
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Granja Bela Vista"
                required
              />
            </div>

            {/* Contato e E-mail */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contato">Contato / Telefone</Label>
                <Input
                  id="contato"
                  name="contato"
                  value={contato}
                  onChange={(e) => setContato(formatPhoneOrCell(e.target.value))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@granja.com"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="border-t pt-3 mt-1">
              <p className="text-sm font-medium text-muted-foreground mb-3">Endereço</p>

              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr_80px] gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cep" className="flex items-center gap-1">
                      CEP
                      {fetchingCep && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
                    </Label>
                    <Input
                      id="cep"
                      name="cep"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="estado">UF</Label>
                    <Input
                      id="estado"
                      name="estado"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rua">Rua / Logradouro</Label>
                  <Input
                    id="rua"
                    name="rua"
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    placeholder="Rua Exemplo, 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      name="bairro"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Centro"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || fetchingCnpj} className="bg-slate-900">
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

