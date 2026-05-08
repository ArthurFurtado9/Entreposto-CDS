"use client"

import { useState, useTransition } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { finalizarTriagem } from "@/actions/ovoscopia"
import { Loader2 } from "lucide-react"

interface Lote {
  id: string
  quantidadeOriginal: number
  fornecedor: { nome: string }
  dataRecebimento: Date
}

export function OvoscopiaClient({ lotes }: { lotes: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [selectedLoteId, setSelectedLoteId] = useState<string>("")
  const [broken, setBroken] = useState(0)
  const [cracked, setCracked] = useState(0)
  const [discard, setDiscard] = useState(0)

  const selectedLote = lotes.find(l => l.id === selectedLoteId)
  const original = selectedLote?.quantidadeOriginal || 0
  const aproveitada = original - (broken + cracked + discard)
  const yieldPercent = original > 0 ? (aproveitada / original) * 100 : 0

  function handleSubmit() {
    if (!selectedLoteId) {
      toast.error("Selecione um lote para triagem.")
      return
    }

    startTransition(async () => {
      try {
        const result = await finalizarTriagem({
          loteId: selectedLoteId,
          quebras: {
            trincados: cracked,
            quebrados: broken,
            descarte: discard
          }
        })

        if (result.success) {
          toast.success("Triagem finalizada com sucesso! Lote Interno e Financeiro gerados.")
          setSelectedLoteId("")
          setBroken(0)
          setCracked(0)
          setDiscard(0)
        } else {
          toast.error(result.error || "Erro ao finalizar triagem.")
        }
      } catch (error) {
        toast.error("Erro inesperado.")
      }
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Seleção de Lote</CardTitle>
          <CardDescription>Lotes aguardando triagem manual.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="lote">Lote Pendente</Label>
            <Select onValueChange={(val) => setSelectedLoteId(val || "")} value={selectedLoteId}>
              <SelectTrigger id="lote">
                <SelectValue placeholder="Selecione um lote" />
              </SelectTrigger>
              <SelectContent>
                {lotes.map((lote) => (
                  <SelectItem key={lote.id} value={lote.id}>
                    {lote.fornecedor.nome} - {lote.quantidadeOriginal} ovos ({new Date(lote.dataRecebimento).toLocaleDateString()})
                  </SelectItem>
                ))}
                {lotes.length === 0 && (
                  <SelectItem value="none" disabled>Nenhum lote pendente</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedLote && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quantidade Original:</span>
                <span className="font-bold">{selectedLote.quantidadeOriginal} ovos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Data Recebimento:</span>
                <span>{new Date(selectedLote.dataRecebimento).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados da Triagem</CardTitle>
          <CardDescription>Informe as quebras detectadas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="trincados">Trincados</Label>
              <Input 
                id="trincados" 
                type="number" 
                value={cracked || ""} 
                onChange={(e) => setCracked(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quebrados">Quebrados</Label>
              <Input 
                id="quebrados" 
                type="number" 
                value={broken || ""} 
                onChange={(e) => setBroken(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descarte">Descarte</Label>
              <Input 
                id="descarte" 
                type="number" 
                value={discard || ""} 
                onChange={(e) => setDiscard(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-muted p-4 space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span>Quantidade Aproveitada:</span>
                <span className="font-bold">{aproveitada} ovos</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span>Rendimento do Lote:</span>
                <Badge variant={yieldPercent > 95 ? "default" : "destructive"}>
                  {yieldPercent.toFixed(2)}%
                </Badge>
             </div>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleSubmit}
            disabled={isPending || !selectedLoteId}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isPending ? "Finalizando..." : "Finalizar Triagem"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
