"use client"

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
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function TabSeguranca({ initialLogs }: { initialLogs: any[] }) {
  return (
    <Card className="border-none shadow-sm glass-panel">
      <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50">
        <CardTitle className="text-xl">Logs de Auditoria</CardTitle>
        <CardDescription>
          Histórico das últimas 100 ações administrativas no sistema. Apenas Administradores podem visualizar.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data / Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Recurso</TableHead>
              <TableHead>Ação Realizada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  Nenhum log encontrado.
                </TableCell>
              </TableRow>
            ) : (
              initialLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs font-mono text-slate-500">
                    {format(new Date(log.createdAt), "dd/MM/yy HH:mm:ss", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{log.user?.name || "Desconhecido"}</span>
                      <span className="text-[10px] text-muted-foreground">{log.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 bg-slate-50">
                      {log.recurso}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.acao}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
