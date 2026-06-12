"use client"

import { useState, useEffect, useTransition } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Sparkles, ArrowLeft } from "lucide-react"
import { TabCaracteristicas } from "./tab-caracteristicas"
import { TabImagens } from "./tab-imagens"
import { TabTributacao } from "./tab-tributacao"
import { TabEstrutura } from "./tab-estrutura"
import { getProdutoDetalhes, criarProduto, editarProduto, getProdutosList } from "@/actions/produtos"
import { toast } from "sonner"

interface ProdutoFormProps {
  produtoId?: string // Se fornecido, modo EDIÇÃO
  componentesDisponiveis: any[]
  onSuccess: (updatedList: any[]) => void
  onCancel: () => void
}

export function ProdutoForm({
  produtoId,
  componentesDisponiveis,
  onSuccess,
  onCancel
}: ProdutoFormProps) {
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  // Header State
  const [nome, setNome] = useState("")
  const [codigo, setCodigo] = useState("")
  const [formato, setFormato] = useState<'SIMPLES' | 'COMPOSICAO' | 'VARIACOES'>("SIMPLES")
  const [tipo, setTipo] = useState("PRODUTO")
  const [situacao, setSituacao] = useState(true)
  const [precoVenda, setPrecoVenda] = useState("")
  const [condicao, setCondicao] = useState<'NOVO' | 'RECONDICIONADO'>("NOVO")
  
  // Tab: Características State
  const [caracteristicas, setCaracteristicas] = useState({
    marca: "Caipira da Serra",
    producao: "PROPRIA",
    dataValidade: "",
    freteGratis: "NAO",
    pesoLiquido: 0,
    pesoBruto: 0,
    largura: 0,
    altura: 0,
    profundidade: 0,
    volumes: 1,
    itensCaixa: 1,
    unidadeMedida: "Centimetros",
    gtinEan: "",
    gtinEanTributario: "",
    departamento: "Não informado"
  })

  // Tab: Imagens State
  const [imagemUrl, setImagemUrl] = useState("")

  // Tab: Tributação State
  const [tributacao, setTributacao] = useState({
    origem: "0",
    ncm: "0407.21.00",
    cest: "",
    tipoItem: "PRODUTO_ACABADO",
    percentualTributos: 0,
    grupoProdutos: "",
    icmsBaseStRetencao: 0,
    icmsStRetencao: 0,
    icmsProprioSubstituto: 0,
    ipiCodigoExcecaoTipi: "0",
    pisFixo: 0,
    cofinsFixo: 0,
    informacoesAdicionais: ""
  })

  // Tab: Estrutura State
  const [tipoEstoque, setTipoEstoque] = useState("VIRTUAL")
  const [componentes, setComponentes] = useState<any[]>([])

  // Carregar detalhes se for modo Edição ou resetar se for Criação
  useEffect(() => {
    if (produtoId) {
      setLoading(true)
      getProdutoDetalhes(produtoId).then(res => {
        if (res.success && res.data) {
          const p = res.data
          setNome(p.nome)
          setCodigo(p.codigo)
          setFormato(p.formato as any)
          setTipo(p.tipo)
          setSituacao(p.situacao)
          setPrecoVenda(p.precoVenda.toFixed(2))
          setCondicao(p.condicao as any)
          setImagemUrl(p.imagemUrl || "")

          setCaracteristicas({
            marca: p.marca || "",
            producao: p.producao || "PROPRIA",
            dataValidade: p.dataValidade || "",
            freteGratis: p.freteGratis || "NAO",
            pesoLiquido: p.pesoLiquido || 0,
            pesoBruto: p.pesoBruto || 0,
            largura: p.largura || 0,
            altura: p.altura || 0,
            profundidade: p.profundidade || 0,
            volumes: p.volumes || 1,
            itensCaixa: p.itensCaixa || 1,
            unidadeMedida: p.unidadeMedida || "Centimetros",
            gtinEan: p.gtinEan || "",
            gtinEanTributario: p.gtinEanTributario || "",
            departamento: p.departamento || "Não informado"
          })

          setTributacao({
            origem: p.origem || "0",
            ncm: p.ncm || "0407.21.00",
            cest: p.cest || "",
            tipoItem: p.tipoItem || "PRODUTO_ACABADO",
            percentualTributos: p.percentualTributos || 0,
            grupoProdutos: p.grupoProdutos || "",
            icmsBaseStRetencao: p.icmsBaseStRetencao || 0,
            icmsStRetencao: p.icmsStRetencao || 0,
            icmsProprioSubstituto: p.icmsProprioSubstituto || 0,
            ipiCodigoExcecaoTipi: p.ipiCodigoExcecaoTipi || "0",
            pisFixo: p.pisFixo || 0,
            cofinsFixo: p.cofinsFixo || 0,
            informacoesAdicionais: p.informacoesAdicionais || ""
          })

          setTipoEstoque(p.tipoEstoque || "VIRTUAL")
          setComponentes(p.componentes || [])
        } else {
          toast.error(res.error || "Erro ao carregar dados do produto.")
          onCancel()
        }
        setLoading(false)
      })
    } else {
      setNome("")
      setCodigo("")
      setFormato("SIMPLES")
      setTipo("PRODUTO")
      setSituacao(true)
      setPrecoVenda("")
      setCondicao("NOVO")
      setImagemUrl("")
      setCaracteristicas({
        marca: "Caipira da Serra",
        producao: "PROPRIA",
        dataValidade: "",
        freteGratis: "NAO",
        pesoLiquido: 0,
        pesoBruto: 0,
        largura: 0,
        altura: 0,
        profundidade: 0,
        volumes: 1,
        itensCaixa: 1,
        unidadeMedida: "Centimetros",
        gtinEan: "",
        gtinEanTributario: "",
        departamento: "Não informado"
      })
      setTributacao({
        origem: "0",
        ncm: "0407.21.00",
        cest: "",
        tipoItem: "PRODUTO_ACABADO",
        percentualTributos: 0,
        grupoProdutos: "",
        icmsBaseStRetencao: 0,
        icmsStRetencao: 0,
        icmsProprioSubstituto: 0,
        ipiCodigoExcecaoTipi: "0",
        pisFixo: 0,
        cofinsFixo: 0,
        informacoesAdicionais: ""
      })
      setTipoEstoque("VIRTUAL")
      setComponentes([])
    }
  }, [produtoId])

  // Helper para atualizar características
  const handleCharChange = (field: string, val: any) => {
    setCaracteristicas(prev => ({ ...prev, [field]: val }))
  }

  // Helper para atualizar tributação
  const handleTribChange = (field: string, val: any) => {
    setTributacao(prev => ({ ...prev, [field]: val }))
  }

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      toast.error("O nome do produto é obrigatório.")
      return
    }

    if (formato === "COMPOSICAO" && componentes.length === 0) {
      toast.error("Para produtos com formato Composição, insira pelo menos um item de estrutura.")
      return
    }

    // Se for edição, confirmar
    if (produtoId) {
      const confirmSave = confirm("Tem certeza que deseja salvar as alterações deste produto?")
      if (!confirmSave) return
    }

    startTransition(async () => {
      try {
        const payload = {
          nome,
          codigo: codigo || null,
          formato,
          tipo,
          situacao,
          precoVenda: parseFloat(precoVenda) || 0,
          condicao,
          imagemUrl,
          ...caracteristicas,
          ...tributacao,
          tipoEstoque,
          componentes: componentes.map(c => ({
            tipo: c.tipo,
            itemId: c.itemId,
            quantidade: c.quantidade,
            precoCusto: c.precoCusto,
            precoVenda: c.precoVenda,
          }))
        }

        const res = produtoId 
          ? await editarProduto(produtoId, payload)
          : await criarProduto(payload)

        if (res.success) {
          toast.success(produtoId ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!")
          
          // Re-fetch list
          const listRes = await getProdutosList()
          if (listRes.success && listRes.data) {
            onSuccess(listRes.data)
          }
        } else {
          toast.error(res.error || "Erro ao salvar produto.")
        }
      } catch (err) {
        toast.error("Erro inesperado ao salvar produto.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-12 animate-fade-in">
      {/* Top Navigation */}
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="w-fit text-slate-500 hover:text-slate-900 -ml-3 gap-2 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o catálogo
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-orange-400 to-[#f9943b] shadow-lg shadow-orange-500/25">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {produtoId ? `Editar Produto: ${nome}` : "Cadastrar Novo Produto"}
              </h1>
              <p className="text-sm text-muted-foreground">
                Defina as características principais, fiscais e estrutura de composição do produto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Card className="border-none shadow-sm bg-white py-24 flex flex-col items-center justify-center gap-3 text-slate-500 rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-[#f9943b]" />
          <span className="text-sm font-semibold">Carregando dados do produto...</span>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-none shadow-sm bg-white p-6 md:p-8 rounded-2xl">
            <CardContent className="p-0 space-y-8">
              
              {/* Header / Fields Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left border-b pb-6 border-slate-100">
                
                {/* Nome */}
                <div className="grid gap-1.5 md:col-span-2">
                  <Label htmlFor="nome" className="text-slate-600 font-semibold text-xs">
                    Nome (Descrição) *
                  </Label>
                  <Input 
                    id="nome" 
                    value={nome} 
                    onChange={e => setNome(e.target.value)} 
                    placeholder="Ex: BANDEJA C/ 30 OVOS DE GALINHA CAIPIRA"
                    required
                    className="h-9 text-xs font-semibold"
                  />
                </div>

                {/* Código SKU */}
                <div className="grid gap-1.5 col-span-1">
                  <Label htmlFor="codigo" className="text-slate-600 font-medium text-xs flex justify-between">
                    <span>Código (SKU)</span>
                    <span className="text-[9px] text-slate-400 font-normal">Opcional</span>
                  </Label>
                  <Input 
                    id="codigo" 
                    value={codigo} 
                    onChange={e => setCodigo(e.target.value)} 
                    placeholder="Ex: CAIPIRA30"
                    className="h-9 text-xs font-mono"
                  />
                </div>

                {/* Preço de venda */}
                <div className="grid gap-1.5 col-span-1">
                  <Label htmlFor="precoVenda" className="text-slate-600 font-semibold text-xs">
                    Preço de venda (R$) *
                  </Label>
                  <Input 
                    id="precoVenda" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={precoVenda} 
                    onChange={e => setPrecoVenda(e.target.value)} 
                    placeholder="0.00"
                    required
                    className="h-9 text-xs font-bold text-[#f9943b]"
                    onBlur={e => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) setPrecoVenda(val.toFixed(2))
                    }}
                  />
                </div>

                {/* Formato */}
                <div className="grid gap-1.5 col-span-1">
                  <Label htmlFor="formato" className="text-slate-600 font-medium text-xs">Formato</Label>
                  <Select value={formato} onValueChange={(val: any) => setFormato(val)}>
                    <SelectTrigger id="formato" className="h-9 text-xs w-full md:min-w-[200px]">
                      <SelectValue placeholder="Formato..." />
                    </SelectTrigger>
                    <SelectContent className="min-w-[240px]">
                      <SelectItem value="SIMPLES">Simples (item único)</SelectItem>
                      <SelectItem value="COMPOSICAO">Com composição (Kit/União)</SelectItem>
                      <SelectItem value="VARIACOES">Com variações (Grades)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tipo */}
                <div className="grid gap-1.5 col-span-1">
                  <Label htmlFor="tipo" className="text-slate-600 font-medium text-xs">Tipo</Label>
                  <Select value={tipo} onValueChange={(val) => setTipo(val || "")}>
                    <SelectTrigger id="tipo" className="h-9 text-xs">
                      <SelectValue placeholder="Tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUTO">Produto</SelectItem>
                      <SelectItem value="SERVICO">Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condição */}
                <div className="grid gap-1.5 col-span-1">
                  <Label htmlFor="condicao" className="text-slate-600 font-medium text-xs">Condição</Label>
                  <Select value={condicao} onValueChange={(val: any) => setCondicao(val)}>
                    <SelectTrigger id="condicao" className="h-9 text-xs">
                      <SelectValue placeholder="Condição..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOVO">Novo</SelectItem>
                      <SelectItem value="RECONDICIONADO">Recondicionado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Situação Toggle */}
                <div className="flex items-center gap-3 col-span-1 pt-4 pl-1">
                  <Switch
                    id="situacao"
                    checked={situacao}
                    onCheckedChange={setSituacao}
                  />
                  <Label htmlFor="situacao" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    {situacao ? "Ativado" : "Desativado"}
                  </Label>
                </div>

              </div>

              {/* Tabs content */}
              <Tabs defaultValue="caracteristicas" className="w-full">
                <TabsList className="grid grid-cols-4 bg-slate-100/70 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 w-full max-w-2xl rounded-xl h-10 p-1 gap-1 mb-6">
                  <TabsTrigger value="caracteristicas" className="text-sm">Características</TabsTrigger>
                  <TabsTrigger value="imagens" className="text-sm">Imagens</TabsTrigger>
                  <TabsTrigger value="tributacao" className="text-sm">Tributação</TabsTrigger>
                  <TabsTrigger value="estrutura" className="text-sm">
                    Estrutura
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="caracteristicas" className="border-none p-0 outline-none">
                  <TabCaracteristicas fields={caracteristicas} onChange={handleCharChange} />
                </TabsContent>

                <TabsContent value="imagens" className="border-none p-0 outline-none">
                  <TabImagens imagemUrl={imagemUrl} onChange={setImagemUrl} />
                </TabsContent>

                <TabsContent value="tributacao" className="border-none p-0 outline-none">
                  <TabTributacao fields={tributacao} onChange={handleTribChange} />
                </TabsContent>

                <TabsContent value="estrutura" className="border-none p-0 outline-none">
                  <TabEstrutura
                    tipoEstoque={tipoEstoque}
                    onTipoEstoqueChange={setTipoEstoque}
                    componentes={componentes}
                    onComponentesChange={(newComps) => {
                      setComponentes(newComps)
                      if (newComps.length > 0) {
                        setFormato("COMPOSICAO")
                      }
                    }}
                    componentesDisponiveis={componentesDisponiveis}
                    onApplyVendaPrice={(val) => setPrecoVenda(val.toFixed(2))}
                  />
                </TabsContent>
              </Tabs>

            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
              className="px-6 h-10 text-xs font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#f9943b] hover:bg-[#e07a2c] text-white px-8 h-10 text-xs font-bold shadow-md shadow-orange-500/15"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                produtoId ? "Salvar Alterações" : "Cadastrar Produto"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
