"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Loader2, Plus, Trash2, SwitchCamera, Pencil } from "lucide-react"
import {
  createExpenseCategory,
  updateExpenseCategory,
  toggleExpenseCategory,
  deleteExpenseCategory,
  createPaymentCondition,
  updatePaymentCondition,
  deletePaymentCondition,
  createIncomeCategory,
  updateIncomeCategory,
  toggleIncomeCategory,
  deleteIncomeCategory,
} from "@/actions/configuracoes"

export function TabFinanceiro({
  initialCategories,
  initialIncomeCategories,
  initialConditions,
}: {
  initialCategories: any[]
  initialIncomeCategories: any[]
  initialConditions: any[]
}) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  // Modais de Criação
  const [catOpen, setCatOpen] = useState(false)
  const [catName, setCatName] = useState("")
  const [catValue, setCatValue] = useState("")
  const [catDesc, setCatDesc] = useState("")

  const [incOpen, setIncOpen] = useState(false)
  const [incName, setIncName] = useState("")
  const [incValue, setIncValue] = useState("")
  const [incDesc, setIncDesc] = useState("")

  const [condOpen, setCondOpen] = useState(false)
  const [condName, setCondName] = useState("")
  const [condDias, setCondDias] = useState("")

  // Modais de Edição
  const [editCatOpen, setEditCatOpen] = useState(false)
  const [editCatId, setEditCatId] = useState("")
  const [editCatName, setEditCatName] = useState("")
  const [editCatValue, setEditCatValue] = useState("")
  const [editCatDesc, setEditCatDesc] = useState("")

  const [editIncOpen, setEditIncOpen] = useState(false)
  const [editIncId, setEditIncId] = useState("")
  const [editIncName, setEditIncName] = useState("")
  const [editIncValue, setEditIncValue] = useState("")
  const [editIncDesc, setEditIncDesc] = useState("")

  const [editCondOpen, setEditCondOpen] = useState(false)
  const [editCondId, setEditCondId] = useState("")
  const [editCondName, setEditCondName] = useState("")
  const [editCondDias, setEditCondDias] = useState("")

  // --- CATEGORIAS DE DESPESAS (EXPENSES) ---
  const handleCreateCategory = async () => {
    if (!catName.trim()) return toast.error("Nome da categoria é obrigatório.")
    setLoadingAction("createCat")
    const res = await createExpenseCategory(
      catName, 
      catValue ? parseFloat(catValue) : undefined, 
      catDesc ? catDesc.trim() : undefined
    )
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria de despesa criada!")
      setCatName("")
      setCatValue("")
      setCatDesc("")
      setCatOpen(false)
    } else {
      toast.error(res.error)
    }
  }

  const handleOpenEditCategory = (cat: any) => {
    setEditCatId(cat.id)
    setEditCatName(cat.nome)
    setEditCatValue(cat.valorMensal ? cat.valorMensal.toString() : "")
    setEditCatDesc(cat.descricao || "")
    setEditCatOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editCatName.trim()) return toast.error("Nome da categoria é obrigatório.")
    setLoadingAction("updateCat")
    const res = await updateExpenseCategory(
      editCatId,
      editCatName,
      editCatValue ? parseFloat(editCatValue) : undefined,
      editCatDesc ? editCatDesc.trim() : undefined
    )
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria de despesa atualizada!")
      setEditCatOpen(false)
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
    if (!confirm("Tem certeza que deseja excluir esta categoria de despesa?")) return
    setLoadingAction(`deleteCat_${id}`)
    const res = await deleteExpenseCategory(id)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria de despesa excluída!")
    } else {
      toast.error(res.error)
    }
  }

  // --- CATEGORIAS DE ENTRADA (INCOME) ---
  const handleCreateIncomeCategory = async () => {
    if (!incName.trim()) return toast.error("Nome da categoria é obrigatório.")
    setLoadingAction("createInc")
    const res = await createIncomeCategory(
      incName, 
      incValue ? parseFloat(incValue) : undefined, 
      incDesc ? incDesc.trim() : undefined
    )
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria de entrada criada!")
      setIncName("")
      setIncValue("")
      setIncDesc("")
      setIncOpen(false)
    } else {
      toast.error(res.error)
    }
  }

  const handleOpenEditIncome = (inc: any) => {
    setEditIncId(inc.id)
    setEditIncName(inc.nome)
    setEditIncValue(inc.valorMensal ? inc.valorMensal.toString() : "")
    setEditIncDesc(inc.descricao || "")
    setEditIncOpen(true)
  }

  const handleUpdateIncomeCategory = async () => {
    if (!editIncName.trim()) return toast.error("Nome da categoria é obrigatório.")
    setLoadingAction("updateInc")
    const res = await updateIncomeCategory(
      editIncId,
      editIncName,
      editIncValue ? parseFloat(editIncValue) : undefined,
      editIncDesc ? editIncDesc.trim() : undefined
    )
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria de entrada atualizada!")
      setEditIncOpen(false)
    } else {
      toast.error(res.error)
    }
  }

  const handleToggleInc = async (id: string) => {
    setLoadingAction(`toggleInc_${id}`)
    const res = await toggleIncomeCategory(id)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Status atualizado!")
    } else {
      toast.error(res.error)
    }
  }

  const handleDeleteInc = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria de entrada?")) return
    setLoadingAction(`deleteInc_${id}`)
    const res = await deleteIncomeCategory(id)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Categoria de entrada excluída!")
    } else {
      toast.error(res.error)
    }
  }

  // --- CONDIÇÕES DE PAGAMENTO (PAYMENT CONDITIONS) ---
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

  const handleOpenEditCond = (cond: any) => {
    setEditCondId(cond.id)
    setEditCondName(cond.nome)
    setEditCondDias(cond.dias.toString())
    setEditCondOpen(true)
  }

  const handleUpdateCondition = async () => {
    if (!editCondName.trim() || !editCondDias) return toast.error("Preencha todos os campos.")
    setLoadingAction("updateCond")
    const res = await updatePaymentCondition(editCondId, editCondName, parseInt(editCondDias))
    setLoadingAction(null)
    if (res.success) {
      toast.success("Condição de pagamento atualizada!")
      setEditCondOpen(false)
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
      
      {/* Categoria de Entrada (Income Categories) */}
      <Card className="border-none shadow-sm glass-panel bg-white dark:bg-zinc-900">
        <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Categorias de Entrada (Receitas)</CardTitle>
            <CardDescription>Para classificar contas a receber.</CardDescription>
          </div>
          <Dialog open={incOpen} onOpenChange={setIncOpen}>
            <DialogTrigger render={
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 text-xs">
                <Plus className="size-4 mr-1" /> Nova Categoria
              </Button>
            } />
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Nova Categoria de Entrada</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Categoria *</Label>
                  <Input value={incName} onChange={(e) => setIncName(e.target.value)} placeholder="Ex: Venda Ovos, Venda Subprodutos..." />
                </div>
                <div className="space-y-2">
                  <Label>Valor Estimado Mensal (R$)</Label>
                  <Input type="number" step="0.01" value={incValue} onChange={(e) => setIncValue(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição / Notas</Label>
                  <Textarea value={incDesc} onChange={(e) => setIncDesc(e.target.value)} placeholder="Descreva brevemente a finalidade desta entrada..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIncOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateIncomeCategory} disabled={loadingAction === "createInc"} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {loadingAction === "createInc" ? <Loader2 className="size-4 animate-spin mr-2" /> : "Salvar"}
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
                <TableHead>Estimativa Mensal</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialIncomeCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6 text-xs">
                    Nenhuma categoria de receita cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                initialIncomeCategories.map((inc) => (
                  <TableRow key={inc.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{inc.nome}</TableCell>
                    <TableCell className="text-xs font-mono text-indigo-600 font-semibold">
                      {inc.valorMensal ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inc.valorMensal) : "R$ 0,00"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{inc.descricao || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={inc.ativo ? "default" : "secondary"} className={inc.ativo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""}>
                        {inc.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title="Editar"
                        onClick={() => handleOpenEditIncome(inc)}
                      >
                        <Pencil className="size-3.5 text-slate-500 hover:text-slate-800" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title={inc.ativo ? "Desativar" : "Ativar"}
                        disabled={loadingAction === `toggleInc_${inc.id}`}
                        onClick={() => handleToggleInc(inc.id)}
                      >
                        {loadingAction === `toggleInc_${inc.id}` ? <Loader2 className="size-3.5 animate-spin" /> : <SwitchCamera className="size-3.5 text-slate-500" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Excluir"
                        disabled={loadingAction === `deleteInc_${inc.id}`}
                        onClick={() => handleDeleteInc(inc.id)}
                      >
                        {loadingAction === `deleteInc_${inc.id}` ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card className="border-none shadow-sm glass-panel bg-white dark:bg-zinc-900">
        <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Categorias de Despesas</CardTitle>
            <CardDescription>Para classificar contas a pagar.</CardDescription>
          </div>
          <Dialog open={catOpen} onOpenChange={setCatOpen}>
            <DialogTrigger render={
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 text-xs">
                <Plus className="size-4 mr-1" /> Nova Categoria
              </Button>
            } />
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Nova Categoria de Despesa</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Categoria *</Label>
                  <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="Ex: Energia, Frete..." />
                </div>
                <div className="space-y-2">
                  <Label>Valor Estimado Mensal (R$)</Label>
                  <Input type="number" step="0.01" value={catValue} onChange={(e) => setCatValue(e.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição / Notas</Label>
                  <Textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Descreva a finalidade desta despesa..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCatOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateCategory} disabled={loadingAction === "createCat"} className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
                <TableHead>Estimativa Mensal</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6 text-xs">
                    Nenhuma categoria cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                initialCategories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{cat.nome}</TableCell>
                    <TableCell className="text-xs font-mono text-rose-600 font-semibold">
                      {cat.valorMensal ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.valorMensal) : "R$ 0,00"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{cat.descricao || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={cat.ativo ? "default" : "secondary"} className={cat.ativo ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""}>
                        {cat.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title="Editar"
                        onClick={() => handleOpenEditCategory(cat)}
                      >
                        <Pencil className="size-3.5 text-slate-500 hover:text-slate-800" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title={cat.ativo ? "Desativar" : "Ativar"}
                        disabled={loadingAction === `toggleCat_${cat.id}`}
                        onClick={() => handleToggleCat(cat.id)}
                      >
                        {loadingAction === `toggleCat_${cat.id}` ? <Loader2 className="size-3.5 animate-spin" /> : <SwitchCamera className="size-3.5 text-slate-500" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Excluir"
                        disabled={loadingAction === `deleteCat_${cat.id}`}
                        onClick={() => handleDeleteCat(cat.id)}
                      >
                        {loadingAction === `deleteCat_${cat.id}` ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
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
      <Card className="border-none shadow-sm glass-panel bg-white dark:bg-zinc-900">
        <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Condições de Pagamento</CardTitle>
            <CardDescription>Prazos utilizados em vendas e compras.</CardDescription>
          </div>
          <Dialog open={condOpen} onOpenChange={setCondOpen}>
            <DialogTrigger render={
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/20 text-xs">
                <Plus className="size-4 mr-1" /> Nova Condição
              </Button>
            } />
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Nova Condição de Pagamento</DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Nome * (Ex: Boleto 30 dias)</Label>
                  <Input value={condName} onChange={(e) => setCondName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número de Dias *</Label>
                  <Input type="number" min="0" value={condDias} onChange={(e) => setCondDias(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCondOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateCond} disabled={loadingAction === "createCond"} className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-6 text-xs">
                    Nenhuma condição cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                initialConditions.map((cond) => (
                  <TableRow key={cond.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{cond.nome}</TableCell>
                    <TableCell className="text-xs text-slate-600">{cond.dias} dias</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        title="Editar"
                        onClick={() => handleOpenEditCond(cond)}
                      >
                        <Pencil className="size-3.5 text-slate-500 hover:text-slate-800" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Excluir"
                        disabled={loadingAction === `deleteCond_${cond.id}`}
                        onClick={() => handleDeleteCond(cond.id)}
                      >
                        {loadingAction === `deleteCond_${cond.id}` ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* --- MODAIS DE EDIÇÃO COMPARTILHADOS --- */}

      {/* Editar Categoria Despesa */}
      <Dialog open={editCatOpen} onOpenChange={setEditCatOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Editar Categoria de Despesa</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Nome da Categoria *</Label>
              <Input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Valor Estimado Mensal (R$)</Label>
              <Input type="number" step="0.01" value={editCatValue} onChange={(e) => setEditCatValue(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descrição / Notas</Label>
              <Textarea value={editCatDesc} onChange={(e) => setEditCatDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCatOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateCategory} disabled={loadingAction === "updateCat"} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {loadingAction === "updateCat" ? <Loader2 className="size-4 animate-spin mr-2" /> : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editar Categoria Entrada */}
      <Dialog open={editIncOpen} onOpenChange={setEditIncOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Editar Categoria de Entrada</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Nome da Categoria *</Label>
              <Input value={editIncName} onChange={(e) => setEditIncName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Valor Estimado Mensal (R$)</Label>
              <Input type="number" step="0.01" value={editIncValue} onChange={(e) => setEditIncValue(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descrição / Notas</Label>
              <Textarea value={editIncDesc} onChange={(e) => setEditIncDesc(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditIncOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateIncomeCategory} disabled={loadingAction === "updateInc"} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {loadingAction === "updateInc" ? <Loader2 className="size-4 animate-spin mr-2" /> : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editar Condição de Pagamento */}
      <Dialog open={editCondOpen} onOpenChange={setEditCondOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Editar Condição de Pagamento</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Nome * (Ex: Boleto 30 dias)</Label>
              <Input value={editCondName} onChange={(e) => setEditCondName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Número de Dias *</Label>
              <Input type="number" min="0" value={editCondDias} onChange={(e) => setEditCondDias(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCondOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateCondition} disabled={loadingAction === "updateCond"} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {loadingAction === "updateCond" ? <Loader2 className="size-4 animate-spin mr-2" /> : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
