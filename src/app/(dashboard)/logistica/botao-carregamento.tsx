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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Truck, Loader2 } from "lucide-react"
import { registrarCarregamento } from "@/actions/logistica"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function BotaoCarregamento({ lotes, clientes = [] }: { lotes: any[], clientes?: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loteId, setLoteId] = useState("")

  const [qtd6, setQtd6] = useState(0)
  const [preco6, setPreco6] = useState(0)
  
  const [qtd12, setQtd12] = useState(0)
  const [preco12, setPreco12] = useState(0)
  
  const [qtd15, setQtd15] = useState(0)
  const [preco15, setPreco15] = useState(0)

  const valorTotal = (qtd6 * preco6) + (qtd12 * preco12) + (qtd15 * preco15)
  const validadeCalculada = new Date()
  validadeCalculada.setDate(validadeCalculada.getDate() + 30)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (!loteId) {
      toast.error("Selecione o Lote.")
      return
    }

    if (valorTotal <= 0) {
      toast.error("O valor total do carregamento deve ser maior que zero.")
      return
    }

    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const nomeCliente = formData.get("cliente") as string

    try {
      const data = {
        loteInternoId: loteId,
        nomeCliente,
        valorTotal,
        itens: [
          { tipo: '6' as const, quantidadeBandejas: qtd6, precoBandeja: preco6 },
          { tipo: '12' as const, quantidadeBandejas: qtd12, precoBandeja: preco12 },
          { tipo: '15' as const, quantidadeBandejas: qtd15, precoBandeja: preco15 },
        ]
      }

      const result = await registrarCarregamento(data)
      if (result.success) {
        toast.success("Carregamento registrado e faturado com sucesso!")
        setOpen(false)
        setQtd6(0); setPreco6(0);
        setQtd12(0); setPreco12(0);
        setQtd15(0); setPreco15(0);
      } else {
        toast.error(result.error || "Erro ao iniciar carregamento.")
      }
    } catch (error) {
      toast.error("Erro inesperado ao iniciar carregamento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-slate-900">
          <Truck className="mr-2 h-4 w-4" />
          Iniciar Carregamento
        </Button>
      } />
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Registrar Carregamento</DialogTitle>
            <DialogDescription>
              Preencha os dados da carga para expedir os ovos e faturar o pedido.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cliente">Nome do Cliente</Label>
                <Input id="cliente" name="cliente" list="clientes-list" placeholder="Ex: Supermercado Central" required autoComplete="off" />
                <datalist id="clientes-list">
                  {clientes.map(c => (
                    <option key={c.id} value={c.nome} />
                  ))}
                </datalist>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lote">Lote Interno (FIFO)</Label>
                <Select value={loteId} onValueChange={(val) => setLoteId(val || "")} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {lotes.map(l => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.id.slice(-8)} ({l.ovos} ovos disp.)
                      </SelectItem>
                    ))}
                    {lotes.length === 0 && <SelectItem value="none" disabled>Sem lotes</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-700">Composição da Carga (Bandejas)</h3>
              
              {/* Bandejas de 6 */}
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="text-xs">Bandeja de 6 (Qtd)</Label>
                  <Input type="number" min="0" value={qtd6 || ""} onChange={e => setQtd6(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Preço Unit. (R$)</Label>
                  <Input type="number" min="0" step="0.01" value={preco6 || ""} onChange={e => setPreco6(Number(e.target.value))} />
                </div>
                <div className="text-right pb-2 text-sm font-medium text-slate-600">
                  Subtotal: R$ {(qtd6 * preco6).toFixed(2)}
                </div>
              </div>

              {/* Bandejas de 12 */}
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="text-xs">Bandeja de 12 (Qtd)</Label>
                  <Input type="number" min="0" value={qtd12 || ""} onChange={e => setQtd12(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Preço Unit. (R$)</Label>
                  <Input type="number" min="0" step="0.01" value={preco12 || ""} onChange={e => setPreco12(Number(e.target.value))} />
                </div>
                <div className="text-right pb-2 text-sm font-medium text-slate-600">
                  Subtotal: R$ {(qtd12 * preco12).toFixed(2)}
                </div>
              </div>

              {/* Bandejas de 15 */}
              <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="text-xs">Bandeja de 15 (Qtd)</Label>
                  <Input type="number" min="0" value={qtd15 || ""} onChange={e => setQtd15(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs">Preço Unit. (R$)</Label>
                  <Input type="number" min="0" step="0.01" value={preco15 || ""} onChange={e => setPreco15(Number(e.target.value))} />
                </div>
                <div className="text-right pb-2 text-sm font-medium text-slate-600">
                  Subtotal: R$ {(qtd15 * preco15).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Validade do Lote</p>
                <p className="text-sm font-medium">{format(validadeCalculada, "dd/MM/yyyy", { locale: ptBR })} (30 dias)</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Valor Total a Receber</p>
                <p className="text-2xl font-bold">R$ {valorTotal.toFixed(2)}</p>
              </div>
            </div>

          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirmar Carregamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
