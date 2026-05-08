"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Truck, Loader2 } from "lucide-react"
import { iniciarCarregamento } from "@/actions/logistica"
import { toast } from "sonner"

export function BotaoCarregamento() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const result = await iniciarCarregamento()
      if (result.success) {
        toast.success(`Carregamento iniciado! ${result.count} pedido(s) enviado(s).`)
      } else {
        toast.error(result.error || "Erro ao iniciar carregamento.")
      }
    } catch (error) {
      toast.error("Erro inesperado ao iniciar carregamento.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} className="bg-slate-900">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Truck className="mr-2 h-4 w-4" />
      )}
      Iniciar Carregamento
    </Button>
  )
}
