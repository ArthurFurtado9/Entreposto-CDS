import { getLotesAguardandoTriagem, getLotesTriados } from "@/actions/ovoscopia"
import { OvoscopiaClient } from "./ovoscopia-client"
import { getCurrentUser } from "@/lib/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MenuLotesTriados } from "./menu-lotes-triados"

export default async function OvoscopiaPage() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  const result = await getLotesAguardandoTriagem()
  const lotes = result.success ? (result.data as any[]) : []

  const triadosResult = await getLotesTriados()
  const lotesTriados = triadosResult.success ? (triadosResult.data as any[]) : []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Triagem (Ovoscopia)</h1>
        <p className="text-sm text-muted-foreground">Selecione um lote pendente e informe o resultado da triagem manual.</p>
      </div>

      <OvoscopiaClient lotes={lotes} />

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Lotes Já Triados</CardTitle>
          <CardDescription>Histórico de lotes que já passaram pela ovoscopia.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Recebimento</TableHead>
                  <TableHead>Aproveitamento</TableHead>
                  <TableHead>Rendimento</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lotesTriados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum lote triado encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  lotesTriados.map((lote: any) => (
                    <TableRow key={lote.id}>
                      <TableCell className="font-mono font-medium text-xs">
                        {lote.id.slice(-8)}
                      </TableCell>
                      <TableCell>{lote.fornecedor?.nome || "N/A"}</TableCell>
                      <TableCell>
                        {format(new Date(lote.dataRecebimento), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {lote.quantidadeAproveitada}
                        </span>{" "}
                        <span className="text-muted-foreground text-xs">/ {lote.quantidadeOriginal}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={lote.rendimentoPorcentagem >= 95 ? "default" : "destructive"}>
                          {lote.rendimentoPorcentagem.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <MenuLotesTriados lote={lote} isAdmin={isAdmin} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
