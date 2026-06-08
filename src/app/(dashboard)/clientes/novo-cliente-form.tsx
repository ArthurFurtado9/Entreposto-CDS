"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UserPlus, Loader2 } from "lucide-react"
import { criarClienteCompleto } from "@/actions/clientes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function NovoClienteForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchingCep, setFetchingCep] = useState(false)
  const [fetchingCnpj, setFetchingCnpj] = useState(false)
  const [formKey, setFormKey] = useState(0)

  // Controlled Form State
  const [nome, setNome] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [email, setEmail] = useState("")
  const [cep, setCep] = useState("")
  const [rua, setRua] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [telefone, setTelefone] = useState("")
  const [contato, setContato] = useState("")

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
          setTelefone(`(${data.ddd_telefone_1.substring(0, 2)}) ${data.ddd_telefone_1.substring(2)}`)
        } else if (data.telefone) {
          setTelefone(data.telefone)
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
      const result = await criarClienteCompleto(rawData)
      if (result.success) {
        toast.success("Cliente cadastrado com sucesso!")
        setFormKey(prev => prev + 1)
        setNome("")
        setCnpj("")
        setEmail("")
        setCep("")
        setRua("")
        setBairro("")
        setCidade("")
        setEstado("")
        setTelefone("")
        setContato("")
        router.refresh()
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
    <Card className="border-none shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
          <UserPlus className="h-4 w-4 text-violet-600" />
          Cadastrar Novo Cliente
        </CardTitle>
        <CardDescription>
          Preencha a ficha cadastral do cliente B2B. Digite o CNPJ para preencher os dados automaticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome / Razão Social</Label>
            <Input 
              id="nome" 
              name="nome" 
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Supermercado Todo Dia" 
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
                onChange={e => setCnpj(e.target.value)}
                onBlur={handleCnpjBlur}
                placeholder="Ex: 00.000.000/0001-00" 
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
                placeholder="Ex: compras@super.com" 
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
                placeholder="Ex: 95000-000" 
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
              <Label htmlFor="estado">Estado (UF)</Label>
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
                onChange={e => setTelefone(e.target.value)}
                placeholder="Ex: (54) 99999-9999" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contato">Nome do Contato</Label>
              <Input 
                id="contato" 
                name="contato" 
                value={contato}
                onChange={e => setContato(e.target.value)}
                placeholder="Ex: João Silva (Comprador)" 
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={loading} className="bg-slate-900 w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                "Salvar Cliente"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

