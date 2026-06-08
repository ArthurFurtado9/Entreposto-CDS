"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Image as ImageIcon, Link as LinkIcon } from "lucide-react"

interface TabImagensProps {
  imagemUrl: string
  onChange: (val: string) => void
}

export function TabImagens({ imagemUrl, onChange }: TabImagensProps) {
  return (
    <div className="space-y-6 py-4 text-left">
      <div className="grid gap-2">
        <Label htmlFor="imagemUrl" className="flex items-center gap-2 text-slate-600 font-medium">
          <LinkIcon className="h-4 w-4 text-indigo-500" />
          Endereço URL da Imagem do Produto
        </Label>
        <Input
          id="imagemUrl"
          type="url"
          value={imagemUrl}
          onChange={e => onChange(e.target.value)}
          placeholder="https://exemplo.com/imagem-do-produto.jpg"
          className="h-9 text-xs"
        />
        <p className="text-[10px] text-muted-foreground">
          Cole a URL de uma imagem hospedada para utilizá-la como capa do produto no catálogo.
        </p>
      </div>

      <div className="border rounded-xl p-4 bg-slate-50/50 flex flex-col items-center justify-center min-h-[200px] border-dashed border-slate-200">
        {imagemUrl && imagemUrl.trim() !== "" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-32 w-32 rounded-lg border border-slate-100 overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <img 
                src={imagemUrl} 
                alt="Preview do produto" 
                className="h-full w-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none"
                }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Pré-visualização do Thumbnail</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <ImageIcon className="h-10 w-10 stroke-1" />
            <span className="text-xs">Nenhuma imagem carregada</span>
          </div>
        )}
      </div>
    </div>
  )
}
