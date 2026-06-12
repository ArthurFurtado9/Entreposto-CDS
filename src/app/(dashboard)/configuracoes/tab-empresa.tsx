"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, UploadCloud, Building2 } from "lucide-react"
import { saveCompanyProfile } from "@/actions/configuracoes"
import { formatPhoneOrCell, validateImageDimensions, formatCnpj } from "@/lib/utils"

const companyProfileSchema = z.object({
  razaoSocial: z.string().min(2, "Razão Social é obrigatória"),
  cnpj: z
    .string()
    .min(14, "CNPJ inválido")
    .regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, "Formato de CNPJ inválido"),
  inscricaoEstadual: z.string().optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
})

type CompanyProfileForm = z.infer<typeof companyProfileSchema>

export function TabEmpresa({ initialData }: { initialData: any }) {
  const [isUploading, setIsUploading] = useState(false)
  const [fetchingCnpj, setFetchingCnpj] = useState(false)
  
  const form = useForm<CompanyProfileForm>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      razaoSocial: initialData?.razaoSocial || "",
      cnpj: initialData?.cnpj || "",
      inscricaoEstadual: initialData?.inscricaoEstadual || "",
      endereco: initialData?.endereco || "",
      telefone: initialData?.telefone ? formatPhoneOrCell(initialData.telefone) : "",
      email: initialData?.email || "",
      logoUrl: initialData?.logoUrl || "",
    },
  })

  const { isSubmitting } = form.formState

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("O arquivo excede o tamanho máximo de 2MB.")
      return
    }

    const isValidDimensions = await validateImageDimensions(file)
    if (!isValidDimensions) {
      toast.error("As dimensões da imagem superam o limite máximo de 1920x1920px.")
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        form.setValue("logoUrl", data.url)
        toast.success("Logo enviada com sucesso!")
      } else {
        toast.error(data.error || "Erro no upload.")
      }
    } catch (error) {
      toast.error("Erro inesperado no upload.")
    } finally {
      setIsUploading(false)
    }
  }

  const fetchCnpjData = async (rawCnpj: string) => {
    setFetchingCnpj(true)
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${rawCnpj}`)
      const data = await res.json()
      if (res.ok && data) {
        form.setValue("razaoSocial", data.razao_social || data.nome_fantasia || "")
        
        let addressParts = []
        if (data.logradouro) addressParts.push(data.logradouro)
        if (data.numero) addressParts.push(data.numero)
        if (data.bairro) addressParts.push(data.bairro)
        if (data.municipio) addressParts.push(data.municipio)
        if (data.uf) addressParts.push(data.uf)
        
        const fullAddress = addressParts.join(", ")
        form.setValue("endereco", fullAddress)

        if (data.ddd_telefone_1) {
          form.setValue("telefone", formatPhoneOrCell(`(${data.ddd_telefone_1.substring(0, 2)}) ${data.ddd_telefone_1.substring(2)}`))
        } else if (data.telefone) {
          form.setValue("telefone", formatPhoneOrCell(data.telefone))
        }
        
        if (data.email) {
          form.setValue("email", data.email)
        }

        toast.success("Dados cadastrais preenchidos via CNPJ!")
      } else {
        toast.error("CNPJ não encontrado ou erro na busca.")
      }
    } catch (err) {
      toast.error("Erro ao buscar CNPJ.")
    } finally {
      setFetchingCnpj(false)
    }
  }

  const handleCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const rawCnpj = e.target.value.replace(/\D/g, "")
    if (rawCnpj.length !== 14) return
    await fetchCnpjData(rawCnpj)
  }

  const onSubmit = async (data: CompanyProfileForm) => {
    try {
      const result = await saveCompanyProfile(data)
      if (result.success) {
        toast.success("Perfil da empresa atualizado com sucesso!")
      } else {
        toast.error(result.error || "Erro ao salvar perfil.")
      }
    } catch (error) {
      toast.error("Erro inesperado.")
    }
  }

  return (
    <Card className="border-none shadow-sm glass-panel">
      <CardHeader className="border-b border-slate-50 dark:border-zinc-800/50">
        <CardTitle className="text-xl">Dados da Empresa</CardTitle>
        <CardDescription>
          Informações principais do entreposto para faturamento e relatórios.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col gap-2 items-center md:items-start shrink-0">
              <Label>Logotipo da Empresa</Label>
              <div className="relative group w-32 h-32 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-900/50 overflow-hidden transition-all hover:border-[#f9943b] hover:bg-amber-50/20 dark:hover:bg-amber-950/20">
                {form.watch("logoUrl") ? (
                  <div className="relative w-full h-full p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.watch("logoUrl")}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <Building2 className="size-8 text-slate-400 group-hover:text-[#f9943b] transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud className="size-6 text-white mb-1" />
                  <span className="text-xs text-white font-medium">Trocar</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleUpload}
                  disabled={isUploading}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] text-center md:text-left leading-normal">
                Máx: 2MB (JPG, PNG, WebP) | Dimensões máx: 1920x1920px
              </p>
              {isUploading && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" /> Enviando...
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="razaoSocial">Razão Social *</Label>
                <Input
                  id="razaoSocial"
                  placeholder="Nome Comercial ou Razão Social"
                  {...form.register("razaoSocial")}
                />
                {form.formState.errors.razaoSocial && (
                  <span className="text-xs text-red-500">{form.formState.errors.razaoSocial.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <div className="relative">
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className="pr-10"
                    {...form.register("cnpj", {
                      onChange: (e) => {
                        e.target.value = formatCnpj(e.target.value)
                        const raw = e.target.value.replace(/\D/g, "")
                        if (raw.length === 14) {
                          fetchCnpjData(raw)
                        }
                      }
                    })}
                  />
                  {fetchingCnpj && (
                    <div className="absolute right-3 top-2.5">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {form.formState.errors.cnpj && (
                  <span className="text-xs text-red-500">{form.formState.errors.cnpj.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  placeholder="Opcional"
                  {...form.register("inscricaoEstadual")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  {...form.register("telefone", {
                    onChange: (e) => {
                      e.target.value = formatPhoneOrCell(e.target.value)
                    }
                  })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">E-mail de Contato</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@empresa.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <span className="text-xs text-red-500">{form.formState.errors.email.message}</span>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  placeholder="Rua, Número, Bairro, Cidade - Estado"
                  {...form.register("endereco")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-[#f9943b] hover:bg-[#e07a2c] text-white shadow-md shadow-orange-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
