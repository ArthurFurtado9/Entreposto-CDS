"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, PackagePlus } from "lucide-react"
import { cadastrarInsumosPreEstabelecidos } from "@/actions/fornecedores"
import { toast } from "sonner"

export function CadastrarInsumosButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const result = await cadastrarInsumosPreEstabelecidos()
      if (result.success) {
        toast.success("Insumos base cadastrados com sucesso!")
      } else {
        toast.error(result.error || "Erro ao cadastrar insumos.")
      }
    } catch (error) {
      toast.error("Erro inesperado ao cadastrar insumos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleClick} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <PackagePlus className="mr-2 h-4 w-4" />
      )}
      Cadastrar Insumos Base
    </Button>
  )
}
