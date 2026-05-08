import { getLotesAguardandoTriagem } from "@/actions/ovoscopia"
import { OvoscopiaClient } from "./ovoscopia-client"

export default async function OvoscopiaPage() {
  const result = await getLotesAguardandoTriagem()
  const lotes = result.success ? (result.data as any[]) : []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Triagem (Ovoscopia)</h1>
        <p className="text-muted-foreground">Selecione um lote pendente e informe o resultado da triagem manual.</p>
      </div>

      <OvoscopiaClient lotes={lotes} />
    </div>
  )
}
