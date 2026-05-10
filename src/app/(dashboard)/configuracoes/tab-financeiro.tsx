"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Loader2, Plus, Trash2, SwitchCamera } from "lucide-react"
import {
  createExpenseCategory,
  toggleExpenseCategory,
  deleteExpenseCategory,
  createPaymentCondition,
  deletePaymentCondition,
} from "@/actions/configuracoes"

export function TabFinanceiro({
  initialCategories,
  initialConditions,
}: {
  initialCategories: any[]
  initialConditions: any[]
}) {
  const [catName, setCatName] = useState("")
  const [condName, setCondName] = useState("")
  const [condDias, setCondDias] = useState("")

  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [catOpen, setCatOpen] = useState(false)
  const [condOpen, setCondOpen] = useState(false)

  const handleCreateCategory = async () => {
    if (!catName.trim()) return toast.error("Nome obrigatório.")
    setLoadingAction("createCat")
    const res = await createExpenseCategory(catName)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria criada!")
      setCatName("")
      setCatOpen(false)
    } else {
      toast.error(res.error)
    }
  }

  const handleToggleCat = async (id: string) => {
    setLoadingAction(`toggleCat_${id}`)
    const res = await toggleExpenseCategory(id)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Status atualizado!")
    } else {
      toast.error(res.error)
    }
  }

  const handleDeleteCat = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return
    setLoadingAction(`deleteCat_${id}`)
    const res = await deleteExpenseCategory(id)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria excluída!")
    } else {
      toast.error(res.error)
    }
  }

  const handleCreateCond = async () => {
    if (!condName.trim() || !condDias) return toast.error("Preencha todos os campos.")
    setLoadingAction("createCond")
    const res = await createPaymentCondition(condName, parseInt(condDias))
    setLoadingAction(null)
    if (res.success) {
      toast.success("Condição de pagamento criada!")
      setCondName("")
      setCondDias("")
      setCondOpen(false)
    } else {
      toast.error(res.error)
    }
  }

  const handleDeleteCond = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta condição?")) return
    setLoadingAction(`deleteCond_${id}`)
    const res = await deletePaymentCondition(id)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Condição excluída!")
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Expense Categories */}
      <Card className="border-none shadow-sm glass-panel">
        <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Categorias de Despesas</CardTitle>
            <CardDescription>Para classificar contas a pagar.</CardDescription>
          </div>
          <Dialog open={catOpen} onOpenChange={setCatOpen}>
            <DialogTrigger render={
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20">
                <Plus className="size-4 mr-1" /> Nova Categoria
              </Button>
            } />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria de Despesa</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Categoria</Label>
                  <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Ex: Energia, Frete..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCatOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateCategory} disabled={loadingAction === "createCat"}>
                  {loadingAction === "createCat" ? <Loader2 className="size-4 animate-spin mr-2" /> : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                    Nenhuma categoria cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                initialCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.nome}</TableCell>
                    <TableCell>
                      <Badge variant={cat.ativo ? "default" : "secondary"} className={cat.ativo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""}>
                        {cat.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        title={cat.ativo ? "Desativar" : "Ativar"}
                        disabled={loadingAction === `toggleCat_${cat.id}`}
                        onClick={() => handleToggleCat(cat.id)}
                      >
                        {loadingAction === `toggleCat_${cat.id}` ? <Loader2 className="size-4 animate-spin" /> : <SwitchCamera className="size-4 text-slate-500" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-50"
                        title="Excluir"
                        disabled={loadingAction === `deleteCat_${cat.id}`}
                        onClick={() => handleDeleteCat(cat.id)}
                      >
                        {loadingAction === `deleteCat_${cat.id}` ? <Loader2 className="size-4 animate-spin text-red-500" /> : <Trash2 className="size-4 text-red-500" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Conditions */}
      <Card className="border-none shadow-sm glass-panel">
        <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Condições de Pagamento</CardTitle>
            <CardDescription>Prazos utilizados em vendas e compras.</CardDescription>
          </div>
          <Dialog open={condOpen} onOpenChange={setCondOpen}>
            <DialogTrigger render={
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20">
                <Plus className="size-4 mr-1" /> Nova Condição
              </Button>
            } />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Condição de Pagamento</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Nome (Ex: Boleto 30 dias)</Label>
                  <Input value={condName} onChange={(e) => setCondName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número de Dias</Label>
                  <Input type="number" min="0" value={condDias} onChange={(e) => setCondDias(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCondOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateCond} disabled={loadingAction === "createCond"}>
                  {loadingAction === "createCond" ? <Loader2 className="size-4 animate-spin mr-2" /> : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Prazo (Dias)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialConditions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                    Nenhuma condição cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                initialConditions.map((cond) => (
                  <TableRow key={cond.id}>
                    <TableCell className="font-medium">{cond.nome}</TableCell>
                    <TableCell>{cond.dias} dias</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-50"
                        title="Excluir"
                        disabled={loadingAction === `deleteCond_${cond.id}`}
                        onClick={() => handleDeleteCond(cond.id)}
                      >
                        {loadingAction === `deleteCond_${cond.id}` ? <Loader2 className="size-4 animate-spin text-red-500" /> : <Trash2 className="size-4 text-red-500" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
