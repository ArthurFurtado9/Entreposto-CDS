"use client"

import { useState, useTransition, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Trash2, 
  Pencil, 
  Loader2, 
  Package, 
  Info, 
  X,
  Sparkles,
  ShoppingBag
} from "lucide-react"
import { ProdutoForm } from "./produto-form"
import { excluirProduto } from "@/actions/produtos"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Produto {
  id: string
  nome: string
  codigo: string
  formato: string
  tipo: string
  situacao: boolean
  precoVenda: number
  condicao: string
  imagemUrl: string | null
  unidadeMedida: string | null
}

interface ProdutosClientProps {
  initialData: any[]
  componentesDisponiveis: any[]
  isAdmin: boolean
}

export function ProdutosClient({ initialData, componentesDisponiveis, isAdmin }: ProdutosClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [data, setData] = useState<Produto[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAlertVisible, setIsAlertVisible] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams?.get("novo") === "true")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams?.get("novo") === "true") {
      setIsCreateOpen(true)
      // Clean query parameter from URL to prevent reopen on reload
      const params = new URLSearchParams(window.location.search)
      params.delete("novo")
      const newRelativePathQuery = window.location.pathname + (params.toString() ? `?${params.toString()}` : "")
      router.replace(newRelativePathQuery)
    }
  }, [searchParams, router])


  // Client-side quick search filtering
  const filteredProdutos = data.filter(p => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true
    return (
      p.nome.toLowerCase().includes(term) ||
      p.codigo.toLowerCase().includes(term)
    )
  })

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir permanentemente este produto?")) {
      return
    }

    setDeletingId(id)
    try {
      const res = await excluirProduto(id)
      if (res.success) {
        toast.success("Produto excluído com sucesso!")
        setData(prev => prev.filter(item => item.id !== id))
        router.refresh()
      } else {
        toast.error(res.error || "Erro ao excluir produto.")
      }
    } catch (e) {
      toast.error("Erro inesperado.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleRefresh = (newData: any[]) => {
    setData(newData)
  }

  if (isCreateOpen || editingId) {
    return (
      <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
        <ProdutoForm
          produtoId={editingId || undefined}
          componentesDisponiveis={componentesDisponiveis}
          onSuccess={(updatedList) => {
            handleRefresh(updatedList)
            setIsCreateOpen(false)
            setEditingId(null)
          }}
          onCancel={() => {
            setIsCreateOpen(false)
            setEditingId(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen bg-slate-50/50 -m-4 p-4 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-[#f9943b]" />
            Produtos Cadastrados
          </h1>
          <p className="text-sm text-muted-foreground">Gerencie o portfólio de produtos, composições e regras fiscais.</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#f9943b] hover:bg-[#e07a2c] text-white shadow-md shadow-orange-500/15"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Info Alert (similar to print) */}
      {isAlertVisible && (
        <div className="relative flex items-start gap-3 p-4 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-xl text-sky-900 shadow-sm animate-fade-in">
          <Info className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="flex-1 pr-6">
            <p className="font-semibold text-sm">Atualize seus produtos com rapidez!</p>
            <p className="text-xs text-sky-800/80 mt-0.5">
              Sabia que você pode cadastrar ou atualizar todos os dados de uma só vez? Utilize a importação por planilha para ganhar tempo e evitar erros manuais.
            </p>
          </div>
          <button 
            onClick={() => setIsAlertVisible(false)}
            className="absolute top-3 right-3 text-sky-400 hover:text-sky-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search and Table Area */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Catálogo de Produtos</CardTitle>
              <CardDescription>Produtos disponíveis para venda ou embalagem.</CardDescription>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Pesquisar por código, descrição ou GTIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 h-9 bg-slate-50 border-slate-200 focus-visible:bg-white text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-medium"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Imagem</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[140px]">Código (SKU)</TableHead>
                  <TableHead className="w-[100px]">Unidade</TableHead>
                  <TableHead className="w-[140px]">Preço</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-10 w-10 text-slate-300" />
                        <p className="text-sm font-medium">Nenhum produto cadastrado ou encontrado.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProdutos.map((p) => (
                    <TableRow 
                      key={p.id} 
                      className="hover:bg-slate-50/50 cursor-pointer"
                      onClick={() => setEditingId(p.id)}
                    >
                      <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="h-12 w-12 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center relative shadow-sm">
                          {p.imagemUrl ? (
                            <img src={p.imagemUrl} alt={p.nome} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 py-3">
                        <div className="flex flex-col">
                          <span>{p.nome}</span>
                          <span className="text-[10px] text-slate-400 font-normal uppercase mt-0.5 flex items-center gap-1">
                            <Badge variant="outline" className="text-[9px] py-0 px-1 border-slate-200 text-slate-500 font-medium">
                              {p.formato}
                            </Badge>
                            {p.condicao === "RECONDICIONADO" && (
                              <Badge variant="secondary" className="text-[9px] py-0 px-1 bg-amber-50 text-amber-700 border-amber-200/40">
                                Recondicionado
                              </Badge>
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm py-3 text-slate-600">
                        {p.codigo}
                      </TableCell>
                      <TableCell className="py-3 text-slate-600 font-medium">
                        {p.unidadeMedida === "Centimetros" ? "UN" : "UN"} 
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 py-3">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.precoVenda)}
                      </TableCell>
                      <TableCell className="text-right py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-800"
                            onClick={() => setEditingId(p.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              onClick={() => handleExcluir(p.id)}
                              disabled={deletingId === p.id}
                            >
                              {deletingId === p.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
