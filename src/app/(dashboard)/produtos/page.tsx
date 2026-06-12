import { getProdutosList, getComponentesDisponiveis } from "@/actions/produtos"
import { getCurrentUser } from "@/lib/auth-utils"
import { ProdutosClient } from "./produtos-client"

export const dynamic = "force-dynamic"

import { Suspense } from "react"

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
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Carregando catálogo de produtos...</div>}>
      <ProdutosClient 
        initialData={produtos} 
        componentesDisponiveis={componentes} 
        isAdmin={isAdmin} 
      />
    </Suspense>
  )
}

