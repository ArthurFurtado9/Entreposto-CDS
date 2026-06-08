"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, Link as LinkIcon, Upload, Download, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TabImagensProps {
  imagemUrl: string
  onChange: (val: string) => void
}

export function TabImagens({ imagemUrl, onChange }: TabImagensProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar localmente tamanho
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Limite de 2MB.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.url) {
        onChange(data.url)
        toast.success("Imagem enviada com sucesso!")
      } else {
        toast.error(data.error || "Erro ao carregar imagem.")
      }
    } catch (err) {
      toast.error("Erro de conexão ao enviar imagem.")
    } finally {
      setUploading(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!imagemUrl) return
    try {
      const response = await fetch(imagemUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const filename = imagemUrl.split("/").pop() || "imagem-produto.jpg"
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success("Download iniciado!")
    } catch (err) {
      toast.error("Erro ao baixar arquivo de imagem.")
    }
  }

  return (
    <div className="space-y-6 py-4 text-left">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upload e URL */}
        <div className="space-y-4">
          <div className="grid gap-1.5">
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
              Cole a URL de uma imagem hospedada ou faça o upload de um arquivo local.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <input 
              type="file" 
              id="upload-image-file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => document.getElementById("upload-image-file")?.click()}
              className="text-xs h-9"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                  Carregar do Computador
                </>
              )}
            </Button>

            {imagemUrl && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadImage}
                  className="text-xs h-9"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Baixar Imagem Atual
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange("")}
                  className="text-xs h-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Limpar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Pré-visualização */}
        <div className="border rounded-xl p-4 bg-slate-50/50 dark:bg-zinc-900/10 flex flex-col items-center justify-center min-h-[200px] border-dashed border-slate-200 dark:border-zinc-800">
          {imagemUrl && imagemUrl.trim() !== "" ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-36 w-36 rounded-lg border border-slate-100 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-950 shadow-sm flex items-center justify-center">
                <img 
                  src={imagemUrl} 
                  alt="Preview do produto" 
                  className="h-full w-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none"
                  }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Pré-visualização da Capa</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <ImageIcon className="h-10 w-10 stroke-1" />
              <span className="text-xs">Nenhuma imagem carregada</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
