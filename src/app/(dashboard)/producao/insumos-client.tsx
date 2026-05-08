"use client"

import { useTransition } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { adicionarEstoqueInsumo, consumirEstoqueInsumo } from "@/actions/producao"

interface Insumo {
  id: string
  nome: string
  estoqueAtual: number
  estoqueMinimo: number
  unidade: string
}

export function InsumosClient({ initialInsumos }: { initialInsumos: Insumo[] }) {
  const [isPending, startTransition] = useTransition()
  
  async function handleUpdateEstoque(id: string, quantidade: number, tipo: 'add' | 'sub') {
    startTransition(async () => {
      try {
        const action = tipo === 'add' ? adicionarEstoqueInsumo : consumirEstoqueInsumo
        const result = await action(id, quantidade)
        
        if (result.success) {
          toast.success(`Estoque atualizado com sucesso!`)
        } else {
          toast.error(result.error || "Erro ao atualizar estoque.")
        }
      } catch (error) {
        toast.error("Erro inesperado.")
      }
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Estoque de Insumos</CardTitle>
          <CardDescription>Materiais utilizados no processo de embalagem.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Insumo</TableHead>
                <TableHead>Estoque Atual</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialInsumos.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.nome}</TableCell>
                  <TableCell>{i.estoqueAtual} {i.unidade}</TableCell>
                  <TableCell>{i.estoqueMinimo} {i.unidade}</TableCell>
                  <TableCell>
                    {i.estoqueAtual < i.estoqueMinimo ? (
                      <Badge variant="destructive">Crítico</Badge>
                    ) : (
                      <Badge variant="secondary">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8"
                        onClick={() => handleUpdateEstoque(i.id, 1, 'sub')}
                        disabled={isPending}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8"
                        onClick={() => handleUpdateEstoque(i.id, 1, 'add')}
                        disabled={isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {initialInsumos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum insumo cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sugestão de Validade</CardTitle>
            <CardDescription>Algoritmo de proteção de validade.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-xs text-blue-800 font-semibold uppercase mb-1">Regra de Negócio</p>
                <p className="text-sm text-blue-700">
                  A validade final é calculada como 30 dias após a data de hoje, 
                  **nunca ultrapassando** a validade original informada pela granja.
                </p>
             </div>
             <div className="space-y-2">
                <p className="text-sm font-medium">Exemplo:</p>
                <div className="text-xs space-y-1">
                   <div className="flex justify-between"><span>Validade Granja:</span> <span>15/06/2026</span></div>
                   <div className="flex justify-between"><span>Data Embalagem:</span> <span>05/05/2026</span></div>
                   <div className="flex justify-between font-bold border-t pt-1 mt-1 text-green-700">
                      <span>Validade Sugerida:</span> <span>04/06/2026</span>
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>
    </div>
  )
}
