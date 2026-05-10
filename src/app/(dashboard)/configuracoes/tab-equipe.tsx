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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Power, PowerOff } from "lucide-react"
import { updateUserRole, toggleUserActive } from "@/actions/configuracoes"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TabEquipe({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingAction(`role_${userId}`)
    const res = await updateUserRole(userId, newRole as any)
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

  return (
    <Card className="border-none shadow-sm glass-panel">
      <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50">
        <CardTitle className="text-xl">Equipe e Acessos</CardTitle>
        <CardDescription>
          Gerencie os usuários do sistema e seus níveis de permissão.
        </CardDescription>
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
            {initialUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name} {user.id === currentUserId && "(Você)"}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-slate-500">
                    {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(val) => handleRoleChange(user.id, val)}
                    disabled={user.id === currentUserId || loadingAction === `role_${user.id}`}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      {loadingAction === `role_${user.id}` ? (
                        <Loader2 className="size-3 animate-spin mr-2" />
                      ) : null}
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                      <SelectItem value="OPERADOR">Operador</SelectItem>
                      <SelectItem value="FINANCEIRO">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant={user.active ? "default" : "secondary"} className={user.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-600"}>
                    {user.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={user.active ? "outline" : "default"}
                    className={user.active ? "h-8 border-red-200 text-red-600 hover:bg-red-50" : "h-8 bg-emerald-600 hover:bg-emerald-700 text-white"}
                    disabled={user.id === currentUserId || loadingAction === `status_${user.id}`}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
