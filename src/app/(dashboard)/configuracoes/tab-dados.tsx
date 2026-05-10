"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, FileSpreadsheet } from "lucide-react"
import { exportMonthlyCsv } from "@/actions/configuracoes"

export function TabDados() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await exportMonthlyCsv()
      if (res.success && res.data) {
        // Criar o download do CSV no navegador
        const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        
        const dataStr = new Date().toISOString().slice(0, 7) // Formato YYYY-MM
        link.setAttribute("download", `movimentacoes_${dataStr}.csv`)
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success("Relatório gerado com sucesso!")
      } else {
        toast.error(res.error || "Erro ao gerar relatório.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-none shadow-sm glass-panel h-fit">
        <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <FileSpreadsheet className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Exportar Movimentações</CardTitle>
              <CardDescription>
                Consolide as entradas e contas do mês atual.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-6">
            Gera um arquivo CSV contendo todos os lotes recebidos e as movimentações financeiras criadas no mês corrente. Útil para contabilidade ou análise em planilhas externas.
          </p>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório Mensal (CSV)
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      
      {/* Aqui podem entrar outras opções de exportação/backup no futuro */}
    </div>
  )
}
