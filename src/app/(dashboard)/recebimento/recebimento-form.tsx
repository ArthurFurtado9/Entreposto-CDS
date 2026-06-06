"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Truck, Calendar, Hash } from "lucide-react"
import { registrarRecebimentoLote } from "@/actions/fornecedores"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RecebimentoFormProps {
  fornecedores: { id: string; nome: string }[]
}

export function RecebimentoForm({ fornecedores }: RecebimentoFormProps) {
  const [loading, setLoading] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      fornecedorId: formData.get("fornecedorId") as string,
      quantidadeOriginal: parseInt(formData.get("quantidade") as string),
      validadeOriginal: formData.get("validade") as string,
      valorBandeja: parseFloat(formData.get("valorBandeja") as string),
    }

    try {
      const result = await registrarRecebimentoLote(data)
      if (result.success) {
        toast.success("Lote recebido com sucesso! Aguardando Ovoscopia.")
        setFormKey(prev => prev + 1)
        router.refresh()
      } else {
        toast.error(result.error || "Erro ao registrar recebimento.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="w-full max-w-2xl">
      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-slate-900" />
            Dados da Carga
          </CardTitle>
          <CardDescription>
            Informe os detalhes do lote que acabou de chegar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="fornecedorId">Fornecedor (Granja)</Label>
            <Select name="fornecedorId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a granja de origem" />
              </SelectTrigger>
              <SelectContent>
                {fornecedores.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantidade" className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-slate-400" />
                Quantidade (Ovos)
              </Label>
              <Input 
                id="quantidade" 
                name="quantidade" 
                type="number" 
                placeholder="Ex: 3600" 
                required 
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="validade" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Validade Original
              </Label>
              <Input 
                id="validade" 
                name="validade" 
                type="date" 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="valorBandeja" className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400">R$</span>
                Valor da Bandeja (30 ovos)
              </Label>
              <Input 
                id="valorBandeja" 
                name="valorBandeja" 
                type="number" 
                step="0.01"
                placeholder="Ex: 20.50" 
                required 
                min="0.01"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading} className="bg-slate-900 px-8">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Registrar Entrada
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
