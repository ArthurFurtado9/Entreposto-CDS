import { getFornecedores } from "@/actions/fornecedores"
import { RecebimentoForm } from "./recebimento-form"

export default async function RecebimentoPage() {
  const result = await getFornecedores()
  const fornecedores = (result.success && result.data) ? result.data : []

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recebimento de Lotes</h1>
        <p className="text-muted-foreground">Registre a entrada física de ovos no entreposto.</p>
      </div>

      <div className="flex justify-center md:justify-start">
        <RecebimentoForm fornecedores={fornecedores} />
      </div>
    </div>
  )
}
