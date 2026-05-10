"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { excluirFornecedor } from "@/actions/fornecedores"

export function BotaoExcluirFornecedor({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleExcluir = async () => {
    if (!confirm("Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita e pode falhar se houver lotes atrelados a ele.")) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await excluirFornecedor(id)
      if (result.success) {
        toast.success("Fornecedor excluído com sucesso!")
      } else {
        toast.error(result.error || "Erro ao excluir fornecedor.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleExcluir} 
      disabled={isDeleting}
      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
      title="Excluir Fornecedor"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
