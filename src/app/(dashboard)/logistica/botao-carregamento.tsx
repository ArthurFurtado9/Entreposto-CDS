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
import { Badge } from "@/components/ui/badge"
import { Truck, Loader2 } from "lucide-react"
import { registrarCarregamento } from "@/actions/logistica"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function BotaoCarregamento({ lotes, clientes = [] }: { lotes: any[], clientes?: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Lotes selecionados (apenas IDs)
  const [selectedLoteIds, setSelectedLoteIds] = useState<string[]>([])

  // Itens de Embalagem
  const [qtd6, setQtd6] = useState(0)
  const [preco6, setPreco6] = useState(0)
  
  const [qtd12, setQtd12] = useState(0)
  const [preco12, setPreco12] = useState(0)
  
  const [qtd15, setQtd15] = useState(0)
  const [preco15, setPreco15] = useState(0)

  const valorTotal = (qtd6 * preco6) + (qtd12 * preco12) + (qtd15 * preco15)
  const totalOvosRequeridos = (qtd6 * 6) + (qtd12 * 12) + (qtd15 * 15)
  
  const totalOvosDisponiveis = selectedLoteIds.reduce((acc, id) => {
    const lote = lotes.find(l => l.id === id)
    return acc + (lote?.ovos || 0)
  }, 0)

  const isMatch = totalOvosRequeridos > 0 && totalOvosDisponiveis >= totalOvosRequeridos
  const validadeCalculada = new Date()
  validadeCalculada.setDate(validadeCalculada.getDate() + 30)

  function handleSelectLote(id: string | null) {
    if (!id || id === "none") return
    if (!selectedLoteIds.includes(id)) {
      setSelectedLoteIds([...selectedLoteIds, id])
    }
  }

  function handleRemoveLote(id: string) {
    setSelectedLoteIds(selectedLoteIds.filter(item => item !== id))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    if (selectedLoteIds.length === 0) {
      toast.error("Selecione pelo menos um Lote Interno.")
      return
    }

    if (!isMatch) {
      toast.error(`Estoque selecionado nos lotes (${totalOvosDisponiveis}) é insuficiente para a quantidade total necessária (${totalOvosRequeridos}).`)
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
        loteIds: selectedLoteIds,
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
        setSelectedLoteIds([])
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
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) {
        setSelectedLoteIds([])
      }
    }}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Adicionar Lote Interno</Label>
                <Select value="" onValueChange={handleSelectLote}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um lote para adicionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {lotes.map(l => {
                      const jaSelecionado = selectedLoteIds.includes(l.id)
                      return (
                        <SelectItem key={l.id} value={l.id} disabled={jaSelecionado || l.ovos <= 0}>
                          Lote #{l.id.slice(-8).toUpperCase()} ({l.ovos} ovos disp.)
                        </SelectItem>
                      )
                    })}
                    {lotes.length === 0 && <SelectItem value="none" disabled>Sem lotes disponíveis</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedLoteIds.length > 0 && (
              <div className="border rounded-lg p-3 bg-slate-50/50 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lotes Selecionados</h4>
                <div className="divide-y text-sm">
                  {selectedLoteIds.map(id => {
                    const originalLote = lotes.find(item => item.id === id)
                    return (
                      <div key={id} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                        <span className="font-medium text-slate-700">
                          Lote #{id.slice(-8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-600">
                            {originalLote ? originalLote.ovos.toLocaleString("pt-BR") : 0} ovos disponíveis
                          </span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon-sm" 
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7"
                            onClick={() => handleRemoveLote(id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

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

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 rounded-lg border text-sm font-medium bg-slate-50/50">
              <div className="text-slate-600">
                Ovos dos Itens: <span className="font-bold">{totalOvosRequeridos.toLocaleString("pt-BR")}</span>
              </div>
              <div className="text-slate-600">
                Capacidade Disponível: <span className="font-bold">{totalOvosDisponiveis.toLocaleString("pt-BR")}</span>
              </div>
              <div>
                {isMatch ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/80 font-semibold">
                    Estoque Suficiente
                  </Badge>
                ) : (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 font-semibold">
                    {totalOvosRequeridos > 0 && totalOvosDisponiveis < totalOvosRequeridos ? "Estoque Insuficiente" : "Selecione Lotes/Itens"}
                  </Badge>
                )}
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
            <Button type="submit" disabled={loading || !isMatch} className="bg-slate-900">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirmar Carregamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
