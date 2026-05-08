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
import { EditarInsumoModal } from "./editar-insumo-modal"

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
    <div className="grid gap-6">
      <Card>
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
                      <EditarInsumoModal insumo={i} />
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
    </div>
  )
}
