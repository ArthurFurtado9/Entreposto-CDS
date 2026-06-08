"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UserPlus, Loader2, Search } from "lucide-react"
import { criarClienteCompleto } from "@/actions/clientes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function NovoClienteForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchingCep, setFetchingCep] = useState(false)
  const [formKey, setFormKey] = useState(0)

  // Endereço controlado para preenchimento por CEP
  const [rua, setRua] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")

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
      const result = await criarClienteCompleto(rawData)
      if (result.success) {
        toast.success("Cliente cadastrado com sucesso!")
        setFormKey(prev => prev + 1)
        setRua("")
        setBairro("")
        setCidade("")
        setEstado("")
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
          <UserPlus className="h-4 w-4" />
          Cadastrar Novo Cliente
        </CardTitle>
        <CardDescription>
          Preencha a ficha cadastral do cliente B2B.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome / Razão Social</Label>
            <Input id="nome" name="nome" placeholder="Ex: Supermercado Todo Dia" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
              <Input id="cnpj" name="cnpj" placeholder="Ex: 00.000.000/0001-00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail (Opcional)</Label>
              <Input id="email" name="email" type="email" placeholder="Ex: compras@super.com" />
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
              <Input id="telefone" name="telefone" placeholder="Ex: (54) 99999-9999" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contato">Nome do Contato</Label>
              <Input id="contato" name="contato" placeholder="Ex: João Silva (Comprador)" />
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
