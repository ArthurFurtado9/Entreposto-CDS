import { getProdutosList, getComponentesDisponiveis } from "@/actions/produtos"
import { getCurrentUser } from "@/lib/auth-utils"
import { ProdutosClient } from "./produtos-client"

export const dynamic = "force-dynamic"

export default async function ProdutosPage() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  const [produtosRes, componentesRes] = await Promise.all([
    getProdutosList(),
    getComponentesDisponiveis()
  ])

  const produtos = produtosRes.success && produtosRes.data ? produtosRes.data : []
  const componentes = componentesRes.success && componentesRes.data ? componentesRes.data : []

  return (
    <ProdutosClient 
      initialData={produtos} 
      componentesDisponiveis={componentes} 
      isAdmin={isAdmin} 
    />
  )
}
