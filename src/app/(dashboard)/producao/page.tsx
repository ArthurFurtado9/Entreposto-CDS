import { getInsumos } from "@/actions/producao"
import { InsumosClient } from "./insumos-client"
import { NovoInsumoModal } from "./novo-insumo-modal"

export default async function ProducaoPage() {
  const result = await getInsumos()
  const insumos = result.success ? (result.data as any[]) : []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Produção e Insumos</h1>
          <p className="text-sm text-muted-foreground">Gerencie o estoque de embalagens e a emissão de lotes internos.</p>
        </div>
        <NovoInsumoModal />
      </div>

      <InsumosClient initialInsumos={insumos} />
    </div>
  )
}

