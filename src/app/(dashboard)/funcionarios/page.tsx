import { getFuncionarios } from "@/actions/funcionarios"
import { getCurrentUser } from "@/lib/auth-utils"
import { FuncionariosClient } from "./funcionarios-client"

export const dynamic = "force-dynamic"

export default async function FuncionariosPage() {
  const user = await getCurrentUser()
  const result = await getFuncionarios()
  
  const funcionarios = (result.success && result.data) ? result.data : []
  const isAdminOrDono = user?.role === "ADMIN" || user?.role === "DONO"

  return (
    <FuncionariosClient 
      funcionarios={funcionarios as any} 
      isAdminOrDono={isAdminOrDono} 
    />
  )
}
