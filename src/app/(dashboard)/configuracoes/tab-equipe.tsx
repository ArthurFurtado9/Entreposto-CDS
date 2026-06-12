"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Power, PowerOff, Trash2, Plus, ArrowLeft, Check, Shield } from "lucide-react"
import { updateUserRole, toggleUserActive, excluirUser, criarUsuario, createCustomPermission } from "@/actions/configuracoes"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TabEquipe({ 
  initialUsers, 
  currentUserId, 
  currentUserRole,
  customPermissions = []
}: { 
  initialUsers: any[]
  currentUserId: string 
  currentUserRole: string
  customPermissions?: any[]
}) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<"DONO" | "ADMIN" | "OPERADOR" | "FINANCEIRO" | "CUSTOM">("OPERADOR")
  const [selectedCustomPermId, setSelectedCustomPermId] = useState<string>("")
  const [isCreatingCustom, setIsCreatingCustom] = useState(false)
  const [customPermName, setCustomPermName] = useState("")
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const modules = [
    { id: "dashboard", label: "Dashboard" },
    { id: "recebimento", label: "Recebimento" },
    { id: "ovoscopia", label: "Ovoscopia" },
    { id: "produtos", label: "Produtos" },
    { id: "clientes", label: "Clientes" },
    { id: "logistica", label: "Vendas" },
    { id: "financeiro", label: "Financeiro" },
    { id: "configuracoes", label: "Configurações" }
  ]

  const handleRoleChange = async (userId: string, val: string) => {
    setLoadingAction(`role_${userId}`)
    let res
    if (val.startsWith("custom_")) {
      const customPermissionId = val.replace("custom_", "")
      res = await updateUserRole(userId, "OPERADOR", customPermissionId)
    } else {
      res = await updateUserRole(userId, val, null)
    }
    setLoadingAction(null)
    if (res.success) {
      toast.success("Nível de acesso atualizado!")
    } else {
      toast.error(res.error)
    }
  }

  const handleToggleStatus = async (userId: string) => {
    setLoadingAction(`status_${userId}`)
    const res = await toggleUserActive(userId)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Status atualizado!")
    } else {
      toast.error(res.error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário permanentemente? Esta ação não pode ser desfeita.")) {
      return
    }
    setLoadingAction(`delete_${userId}`)
    const res = await excluirUser(userId)
    setLoadingAction(null)
    if (res.success) {
      toast.success("Funcionário excluído do sistema!")
    } else {
      toast.error(res.error)
    }
  }

  const toggleModule = (modId: string) => {
    if (selectedModules.includes(modId)) {
      setSelectedModules(selectedModules.filter(id => id !== modId))
    } else {
      setSelectedModules([...selectedModules, modId])
    }
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setCpf("")
    setPassword("")
    setSelectedRole("OPERADOR")
    setSelectedCustomPermId("")
    setIsCreatingCustom(false)
    setCustomPermName("")
    setSelectedModules([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast.error("Nome e E-mail são obrigatórios.")
      return
    }

    setLoadingSubmit(true)
    try {
      let finalCustomPermId = selectedCustomPermId || null

      if (selectedRole === "CUSTOM" && isCreatingCustom) {
        if (!customPermName || customPermName.trim().length < 2) {
          toast.error("Insira o nome da permissão personalizada.")
          setLoadingSubmit(false)
          return
        }
        if (selectedModules.length === 0) {
          toast.error("Selecione pelo menos 1 módulo para a permissão personalizada.")
          setLoadingSubmit(false)
          return
        }

        const resPerm = await createCustomPermission(customPermName, selectedModules)
        if (!resPerm.success || !resPerm.data) {
          toast.error(resPerm.error || "Erro ao criar permissão personalizada.")
          setLoadingSubmit(false)
          return
        }
        finalCustomPermId = resPerm.data.id
      }

      const resUser = await criarUsuario({
        name,
        email,
        cpf: cpf || null,
        password: password || undefined,
        role: selectedRole === "CUSTOM" ? "OPERADOR" : selectedRole,
        customPermissionId: selectedRole === "CUSTOM" ? finalCustomPermId : null
      })

      if (resUser.success) {
        toast.success("Funcionário cadastrado com sucesso!")
        resetForm()
        setShowForm(false)
      } else {
        toast.error(resUser.error)
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar funcionário.")
    } finally {
      setLoadingSubmit(false)
    }
  }

  const isDono = currentUserRole === "DONO"

  if (showForm) {
    return (
      <Card className="border-none shadow-sm glass-panel animate-in fade-in duration-200">
        <CardHeader className="border-b border-slate-100 dark:border-zinc-800/50 flex flex-row items-center gap-4 py-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { setShowForm(false); resetForm(); }}
            className="size-8"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <CardTitle className="text-xl">Cadastrar Novo Funcionário</CardTitle>
            <CardDescription>
              Adicione um novo membro para a equipe com regras de acesso específicas.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: João Silva" 
                  required 
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Ex: joao@empresa.com" 
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cpf">CPF</Label>
                <Input 
                  id="cpf" 
                  value={cpf} 
                  onChange={(e) => setCpf(e.target.value)} 
                  placeholder="000.000.000-00" 
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Senha de Acesso (Padrão: 123456)</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Digite a senha ou deixe em branco" 
                  className="h-10"
                />
              </div>
            </div>

            <hr className="border-slate-100 dark:border-zinc-800/50" />

            {/* Nível de Acesso (Roles) */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Defina o Nível de Acesso</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { role: "DONO", label: "Dono", desc: "Gestão total do sistema, equipe e configurações restritas." },
                  { role: "ADMIN", label: "Admin", desc: "Gestão de cadastros e operacional. Sem controle de equipe." },
                  { role: "OPERADOR", label: "Operador", desc: "Acesso direto a Recebimento, Ovoscopia e Separar Pedidos." },
                  { role: "FINANCEIRO", label: "Financeiro", desc: "Acesso a faturamento, contas a pagar/receber e estornos." },
                  { role: "CUSTOM", label: "Personalizado", desc: "Monte permissões selecionando apenas os módulos desejados." },
                ].map((item) => (
                  <div 
                    key={item.role}
                    onClick={() => {
                      setSelectedRole(item.role as any)
                      if (item.role !== "CUSTOM") {
                        setIsCreatingCustom(false)
                      }
                    }}
                    className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all hover:border-orange-400 select-none ${
                      selectedRole === item.role 
                        ? "border-orange-500 bg-orange-50/30 dark:bg-orange-950/20 ring-1 ring-orange-500" 
                        : "border-slate-200 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{item.label}</span>
                      {selectedRole === item.role && (
                        <div className="size-4 rounded-full bg-[#f9943b] text-white flex items-center justify-center">
                          <Check className="size-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground leading-relaxed">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Configurações de Permissão Customizada */}
            {selectedRole === "CUSTOM" && (
              <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-6 bg-slate-50/30 dark:bg-zinc-900/20 space-y-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-zinc-800/30 pb-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Permissão Customizada</h4>
                    <p className="text-xs text-muted-foreground">Escolha uma permissão existente ou configure uma nova.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={isCreatingCustom ? "outline" : "default"}
                      size="sm"
                      onClick={() => setIsCreatingCustom(false)}
                    >
                      Usar Existente
                    </Button>
                    <Button
                      type="button"
                      variant={isCreatingCustom ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsCreatingCustom(true)}
                    >
                      + Criar Nova Permissão
                    </Button>
                  </div>
                </div>

                {!isCreatingCustom ? (
                  <div className="space-y-3">
                    <Label>Selecione uma Permissão Existente</Label>
                    {customPermissions.length === 0 ? (
                      <div className="text-sm text-muted-foreground border border-dashed rounded-lg p-6 text-center">
                        Nenhuma permissão personalizada criada ainda. Clique em "+ Criar Nova Permissão" para começar.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {customPermissions.map((perm) => (
                          <div 
                            key={perm.id}
                            onClick={() => setSelectedCustomPermId(perm.id)}
                            className={`cursor-pointer border rounded-lg p-3 flex items-center justify-between select-none ${
                              selectedCustomPermId === perm.id 
                                ? "border-orange-500 bg-orange-50/20 dark:bg-orange-950/10 ring-1 ring-orange-500" 
                                : "border-slate-200 dark:border-zinc-800"
                            }`}
                          >
                            <div>
                              <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{perm.nome}</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {JSON.parse(perm.recursos || "[]").map((rec: string) => (
                                  <Badge key={rec} variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-slate-100 dark:bg-zinc-800">
                                    {rec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {selectedCustomPermId === perm.id && (
                              <Check className="size-4 text-[#f9943b]" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1.5 max-w-md">
                      <Label htmlFor="permName">Nome da Nova Permissão</Label>
                      <Input 
                        id="permName" 
                        value={customPermName} 
                        onChange={(e) => setCustomPermName(e.target.value)} 
                        placeholder="Ex: Operador Restrito, Conferente" 
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Selecione os Módulos Permitidos</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {modules.map((mod) => (
                          <label 
                            key={mod.id}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 select-none ${
                              selectedModules.includes(mod.id)
                                ? "border-orange-500 bg-orange-50/10 dark:bg-orange-950/10"
                                : "border-slate-200 dark:border-zinc-800"
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={selectedModules.includes(mod.id)}
                              onChange={() => toggleModule(mod.id)}
                              className="rounded border-slate-300 dark:border-zinc-700 text-[#f9943b] focus:ring-[#f9943b] size-4 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{mod.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800/50">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#f9943b] hover:bg-[#e07a2c] text-white shadow-md shadow-orange-500/10" disabled={loadingSubmit}>
                {loadingSubmit ? (
                  <><Loader2 className="size-4 animate-spin mr-2" /> Salvando...</>
                ) : (
                  "Salvar Funcionário"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-sm glass-panel">
      <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div>
          <CardTitle className="text-xl">Equipe e Acessos</CardTitle>
          <CardDescription>
            Gerencie os usuários do sistema e seus níveis de permissão.
          </CardDescription>
        </div>
        {isDono && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[#f9943b] hover:bg-[#e07a2c] text-white hover:from-orange-600 hover:to-orange-700 shadow-md shadow-orange-500/15"
          >
            <Plus className="size-4 mr-1.5" />
            Novo Funcionário
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUsers.map((user) => {
              const userRoleValue = user.customPermissionId ? `custom_${user.customPermissionId}` : user.role
              const isSelf = user.id === currentUserId
              const displayRole = user.customPermission ? `${user.customPermission.nome} (Pers.)` : user.role

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{user.name}</span>
                        {isSelf && <Badge variant="outline" className="text-[10px] py-0 px-1 border-orange-200 text-orange-700 bg-orange-50/50">Você</Badge>}
                        {user.role === "DONO" && <Badge variant="outline" className="text-[10px] py-0 px-1 bg-orange-100 text-orange-700 border-orange-200">Dono</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                      {user.cpf && <span className="text-[10px] text-muted-foreground/85">CPF: {user.cpf}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-500">
                      {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isDono ? (
                      <Select
                        defaultValue={userRoleValue}
                        onValueChange={(val) => handleRoleChange(user.id, val)}
                        disabled={isSelf || loadingAction === `role_${user.id}`}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          {loadingAction === `role_${user.id}` ? (
                            <Loader2 className="size-3 animate-spin mr-2" />
                          ) : null}
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DONO">Dono</SelectItem>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                          <SelectItem value="OPERADOR">Operador</SelectItem>
                          <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                          {customPermissions.map((perm) => (
                            <SelectItem key={perm.id} value={`custom_${perm.id}`}>
                              {perm.nome} (Pers.)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md">
                        {displayRole}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "default" : "secondary"} className={user.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-600"}>
                      {user.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant={user.active ? "outline" : "default"}
                        className={user.active ? "h-8 border-red-200 text-red-600 hover:bg-red-50" : "h-8 bg-emerald-600 hover:bg-emerald-700 text-white"}
                        disabled={isSelf || !isDono || loadingAction === `status_${user.id}`}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {loadingAction === `status_${user.id}` ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : user.active ? (
                          <><PowerOff className="size-3.5 mr-1" /> Desativar</>
                        ) : (
                          <><Power className="size-3.5 mr-1" /> Ativar</>
                        )}
                      </Button>

                      {isDono && !isSelf && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                          disabled={loadingAction === `delete_${user.id}`}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          {loadingAction === `delete_${user.id}` ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

