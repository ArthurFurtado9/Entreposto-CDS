"use client"

import { useEffect, useState, useTransition } from "react"
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
import { Pencil, Loader2 } from "lucide-react"
import { getPedidoDetalhes, editarPedido } from "@/actions/logistica"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Lote {
  id: string
  ovos: number
  validade: string
  status: string
}

interface Cliente {
  id: string
  nome: string
}

interface EditarPedidoModalProps {
  pedidoId: string
  clientes: Cliente[]
  lotes: Lote[] // Lotes disponíveis atualmente
}

export function EditarPedidoModal({ pedidoId, clientes, lotes }: EditarPedidoModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Dados do pedido detalhado
  const [pedidoDetails, setPedidoDetails] = useState<any>(null)

  // Estados dos inputs
  const [selectedClienteId, setSelectedClienteId] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedLoteIds, setSelectedLoteIds] = useState<string[]>([])

  const [qtd6, setQtd6] = useState(0)
  const [preco6, setPreco6] = useState("")
  const [qtd12, setQtd12] = useState(0)
  const [preco12, setPreco12] = useState("")
  const [qtd15, setQtd15] = useState(0)
  const [preco15, setPreco15] = useState("")

  // Cálculos
  const parsedPreco6 = parseFloat(preco6 || "0")
  const parsedPreco12 = parseFloat(preco12 || "0")
  const parsedPreco15 = parseFloat(preco15 || "0")

  const valorTotal = (qtd6 * parsedPreco6) + (qtd12 * parsedPreco12) + (qtd15 * parsedPreco15)
  const totalOvosRequeridos = (qtd6 * 6) + (qtd12 * 12) + (qtd15 * 15)

  // Ajustar os lotes disponíveis para incluir o estoque reservado por este pedido
  const [displayLotes, setDisplayLotes] = useState<Lote[]>([])

  useEffect(() => {
    if (open) {
      setLoading(true)
      getPedidoDetalhes(pedidoId).then((res) => {
        if (res.success && res.data) {
          const ped = res.data
          setPedidoDetails(ped)
          setSelectedClienteId(ped.clienteId)
          setSelectedStatus(ped.status)
          setSelectedLoteIds(ped.itens.map((i: any) => i.loteInternoId))

          // Mapear itens de venda
          const item6 = ped.itensVenda?.find((i: any) => i.tipoEmbalagem === "6")
          const item12 = ped.itensVenda?.find((i: any) => i.tipoEmbalagem === "12")
          const item15 = ped.itensVenda?.find((i: any) => i.tipoEmbalagem === "15")

          if (ped.itensVenda && ped.itensVenda.length > 0) {
            setQtd6(item6 ? item6.quantidadeBandejas : 0)
            setPreco6(item6 ? item6.precoBandeja.toFixed(2) : "")
            setQtd12(item12 ? item12.quantidadeBandejas : 0)
            setPreco12(item12 ? item12.precoBandeja.toFixed(2) : "")
            setQtd15(item15 ? item15.quantidadeBandejas : 0)
            setPreco15(item15 ? item15.precoBandeja.toFixed(2) : "")
          } else {
            // Pedido antigo sem itensVenda. Vamos inferir como bandejas de 12 por padrão.
            const totalOvos = ped.itens.reduce((acc: number, i: any) => acc + i.quantidade, 0)
            const valorTotal = ped.financeiro ? Number(ped.financeiro.valor) : 0
            const totalBandejas12 = Math.floor(totalOvos / 12)
            if (totalBandejas12 > 0) {
              setQtd12(totalBandejas12)
              setPreco12((valorTotal / totalBandejas12).toFixed(2))
              setQtd6(0); setPreco6("")
              setQtd15(0); setPreco15("")
            } else {
              const totalBandejas6 = Math.floor(totalOvos / 6)
              if (totalBandejas6 > 0) {
                setQtd6(totalBandejas6)
                setPreco6((valorTotal / totalBandejas6).toFixed(2))
              } else {
                setQtd6(0); setPreco6("")
              }
              setQtd12(0); setPreco12("")
              setQtd15(0); setPreco15("")
            }
          }

          // Ajustar estoque dos lotes em exibição
          const localLotes = JSON.parse(JSON.stringify(lotes)) as Lote[]
          ped.itens.forEach((item: any) => {
            const existing = localLotes.find(l => l.id === item.loteInternoId)
            if (existing) {
              existing.ovos += item.quantidade
            } else {
              localLotes.push({
                id: item.loteInternoId,
                ovos: item.quantidade,
                validade: item.loteInterno?.validadeSugerida ? new Date(item.loteInterno.validadeSugerida).toISOString() : new Date().toISOString(),
                status: "RESERVADO"
              })
            }
          })
          setDisplayLotes(localLotes)
        } else {
          toast.error(res.error || "Erro ao carregar dados do pedido.")
          setOpen(false)
        }
        setLoading(false)
      })
    }
  }, [open, pedidoId, lotes])

  const totalOvosDisponiveis = selectedLoteIds.reduce((acc, id) => {
    const lote = displayLotes.find(l => l.id === id)
    return acc + (lote?.ovos || 0)
  }, 0)

  const isMatch = totalOvosRequeridos > 0 && totalOvosDisponiveis >= totalOvosRequeridos

  function handleSelectLote(id: string | null) {
    if (!id || id === "none") return
    if (!selectedLoteIds.includes(id)) {
      setSelectedLoteIds([...selectedLoteIds, id])
    }
  }

  function handleRemoveLote(id: string) {
    setSelectedLoteIds(selectedLoteIds.filter(item => item !== id))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (selectedLoteIds.length === 0) {
      toast.error("Selecione pelo menos um Lote Interno.")
      return
    }

    if (!isMatch) {
      toast.error(`Estoque nos lotes selecionados (${totalOvosDisponiveis}) é insuficiente para a quantidade necessária (${totalOvosRequeridos}).`)
      return
    }

    if (valorTotal <= 0) {
      toast.error("O valor total do pedido deve ser maior que zero.")
      return
    }

    startTransition(async () => {
      try {
        const data = {
          clienteId: selectedClienteId,
          status: selectedStatus as any,
          valorTotal,
          loteIds: selectedLoteIds,
          itens: [
            { tipo: '6' as const, quantidadeBandejas: qtd6, precoBandeja: parsedPreco6 },
            { tipo: '12' as const, quantidadeBandejas: qtd12, precoBandeja: parsedPreco12 },
            { tipo: '15' as const, quantidadeBandejas: qtd15, precoBandeja: parsedPreco15 },
          ]
        }

        const result = await editarPedido(pedidoId, data)
        if (result.success) {
          toast.success("Pedido atualizado com sucesso!")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error || "Erro ao atualizar pedido.")
        }
      } catch (err) {
        toast.error("Erro inesperado ao salvar alterações.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900" title="Editar pedido">
          <Pencil className="h-4 w-4" />
        </Button>
      } />
      <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Editar Pedido: #{pedidoId.slice(-6).toUpperCase()}</DialogTitle>
          <DialogDescription>
            Edite o cliente, status ou a composição da carga. O ID do pedido permanecerá o mesmo.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Carregando detalhes do pedido...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-cliente">Cliente</Label>
                <Select value={selectedClienteId} onValueChange={(val) => setSelectedClienteId(val || "")}>
                  <SelectTrigger id="edit-cliente">
                    <SelectValue placeholder="Selecione o cliente...">
                      {clientes.find(c => c.id === selectedClienteId)?.nome}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status do Pedido</Label>
                <Select value={selectedStatus} onValueChange={(val) => setSelectedStatus(val || "")}>
                  <SelectTrigger id="edit-status" className="w-full">
                    <SelectValue placeholder="Status..." />
                  </SelectTrigger>
                  <SelectContent className="min-w-[320px]">
                    <SelectItem value="PENDENTE">Aguardando Separação (Pendente)</SelectItem>
                    <SelectItem value="SEPARACAO">Em Separação</SelectItem>
                    <SelectItem value="ENVIADO">Carregado e Enviado</SelectItem>
                    <SelectItem value="ENTREGUE">Entregue ao Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Adicionar Lote Interno</Label>
                <Select value="" onValueChange={handleSelectLote}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha um lote..." />
                  </SelectTrigger>
                  <SelectContent className="min-w-[350px]">
                    {displayLotes.map(l => {
                      const jaSelecionado = selectedLoteIds.includes(l.id)
                      return (
                        <SelectItem key={l.id} value={l.id} disabled={jaSelecionado || l.ovos <= 0}>
                          Lote #{l.id.slice(-8).toUpperCase()} ({l.ovos} ovos disp.)
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedLoteIds.length > 0 && (
              <div className="border rounded-lg p-3 bg-slate-50/50 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lotes Selecionados (Origem dos Ovos)</h4>
                <div className="divide-y text-sm">
                  {selectedLoteIds.map(id => {
                    const originalLote = displayLotes.find(item => item.id === id)
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
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={preco6} 
                    onChange={e => setPreco6(e.target.value)} 
                    onBlur={e => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) setPreco6(val.toFixed(2))
                    }}
                  />
                </div>
                <div className="text-right pb-2 text-sm font-medium text-slate-600">
                  Subtotal: R$ {(qtd6 * parsedPreco6).toFixed(2)}
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
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={preco12} 
                    onChange={e => setPreco12(e.target.value)} 
                    onBlur={e => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) setPreco12(val.toFixed(2))
                    }}
                  />
                </div>
                <div className="text-right pb-2 text-sm font-medium text-slate-600">
                  Subtotal: R$ {(qtd12 * parsedPreco12).toFixed(2)}
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
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={preco15} 
                    onChange={e => setPreco15(e.target.value)} 
                    onBlur={e => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) setPreco15(val.toFixed(2))
                    }}
                  />
                </div>
                <div className="text-right pb-2 text-sm font-medium text-slate-600">
                  Subtotal: R$ {(qtd15 * parsedPreco15).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
              <div className="flex gap-4">
                <div>
                  <span className="text-slate-500">Ovos Requeridos:</span>{" "}
                  <strong className="text-slate-800">{totalOvosRequeridos}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Estoque Selecionado:</span>{" "}
                  <strong className={isMatch ? "text-emerald-600" : "text-rose-600"}>
                    {totalOvosDisponiveis}
                  </strong>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Valor Total da Carga:</span>{" "}
                <strong className="text-indigo-600 text-lg">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}
                </strong>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-slate-900">
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Pedido"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
