"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Plus, Trash2, HelpCircle } from "lucide-react"

interface ComponenteItem {
  id?: string
  tipo: 'PRODUTO' | 'INSUMO'
  itemId: string
  quantidade: number
  precoCusto: number
  precoVenda: number
}

interface TabEstruturaProps {
  tipoEstoque: string
  onTipoEstoqueChange: (val: string) => void
  componentes: ComponenteItem[]
  onComponentesChange: (newComps: ComponenteItem[]) => void
  componentesDisponiveis: any[] // Lista de Insumos e Produtos para selecionar
  onApplyVendaPrice: (val: number) => void
}

export function TabEstrutura({
  tipoEstoque,
  onTipoEstoqueChange,
  componentes,
  onComponentesChange,
  componentesDisponiveis,
  onApplyVendaPrice
}: TabEstruturaProps) {

  // Adicionar linha
  const handleAddRow = () => {
    onComponentesChange([
      ...componentes,
      {
        tipo: 'INSUMO',
        itemId: '',
        quantidade: 1,
        precoCusto: 0,
        precoVenda: 0
      }
    ])
  }

  // Deletar linha
  const handleRemoveRow = (index: number) => {
    onComponentesChange(componentes.filter((_, i) => i !== index))
  }

  // Atualizar campo da linha
  const handleUpdateRow = (index: number, key: keyof ComponenteItem, val: any) => {
    const updated = componentes.map((c, i) => {
      if (i !== index) return c
      
      const newComp = { ...c, [key]: val }

      // Se mudar o itemId, preencher automaticamente SKU, estoque, custo, venda
      if (key === 'itemId') {
        const itemInfo = componentesDisponiveis.find(item => item.id === val)
        if (itemInfo) {
          newComp.tipo = itemInfo.tipo
          newComp.precoCusto = itemInfo.precoCusto || 0
          newComp.precoVenda = itemInfo.precoVenda || 0
        }
      }

      return newComp
    })
    onComponentesChange(updated)
  }

  // Cálculos dinâmicos
  const calculados = componentes.map(c => {
    const itemInfo = componentesDisponiveis.find(item => item.id === c.itemId)
    const sku = itemInfo ? itemInfo.codigo : ""
    const estoque = itemInfo ? itemInfo.estoque : 0
    const custoTotal = c.quantidade * c.precoCusto
    const vendaTotal = c.quantidade * c.precoVenda

    return {
      sku,
      estoque,
      custoTotal,
      vendaTotal
    }
  })

  const precoTotalCusto = calculados.reduce((acc, c) => acc + c.custoTotal, 0)
  const precoTotalVenda = calculados.reduce((acc, c) => acc + c.vendaTotal, 0)

  return (
    <div className="space-y-6 py-4 text-left">
      
      {/* Tipo de estoque */}
      <div className="grid gap-1.5 max-w-xs">
        <Label htmlFor="tipoEstoque" className="flex items-center gap-1 text-slate-600 font-medium">
          Tipo de estoque
          <HelpCircle className="h-3 w-3 text-slate-400" />
        </Label>
        <Select 
          value={tipoEstoque} 
          onValueChange={(val) => onTipoEstoqueChange(val || "")}
        >
          <SelectTrigger id="tipoEstoque" className="h-8 text-xs">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VIRTUAL">Virtual</SelectItem>
            <SelectItem value="FISICO">Físico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Componentes */}
      <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="text-xs">Componente</TableHead>
              <TableHead className="w-[100px] text-xs">Código (SKU)</TableHead>
              <TableHead className="w-[80px] text-xs">Qtde</TableHead>
              <TableHead className="w-[80px] text-xs">Estoque</TableHead>
              <TableHead className="w-[100px] text-xs">Preço custo</TableHead>
              <TableHead className="w-[100px] text-xs">Custo total</TableHead>
              <TableHead className="w-[100px] text-xs">Preço venda</TableHead>
              <TableHead className="w-[100px] text-xs">Venda total</TableHead>
              <TableHead className="w-[50px] text-right text-xs"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {componentes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-xs">
                  Nenhum componente adicionado a esta estrutura. Clique em "+ Adicionar outro item" para iniciar.
                </TableCell>
              </TableRow>
            ) : (
              componentes.map((comp, index) => {
                const calc = calculados[index] || { sku: "", estoque: 0, custoTotal: 0, vendaTotal: 0 }
                return (
                  <TableRow key={index} className="hover:bg-slate-50/20">
                    
                    {/* Componente dropdown */}
                    <TableCell className="py-2">
                      <Select 
                        value={comp.itemId} 
                        onValueChange={(val) => handleUpdateRow(index, 'itemId', val || "")}
                      >
                        <SelectTrigger className="h-7 text-xs py-0">
                          <SelectValue placeholder="Selecione o componente..." />
                        </SelectTrigger>
                        <SelectContent className="max-w-[400px]">
                          {componentesDisponiveis.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.nome} ({item.tipo === 'INSUMO' ? 'Insumo' : 'Produto'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* SKU */}
                    <TableCell className="py-2 font-mono text-xs text-slate-500">
                      {calc.sku || "N/A"}
                    </TableCell>

                    {/* Qtde */}
                    <TableCell className="py-2">
                      <Input 
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={comp.quantidade}
                        onChange={e => handleUpdateRow(index, 'quantidade', parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs py-0 text-center"
                      />
                    </TableCell>

                    {/* Estoque */}
                    <TableCell className="py-2 text-xs text-slate-500">
                      {calc.estoque.toLocaleString("pt-BR")}
                    </TableCell>

                    {/* Preço custo */}
                    <TableCell className="py-2">
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        value={comp.precoCusto}
                        onChange={e => handleUpdateRow(index, 'precoCusto', parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs py-0 text-right"
                      />
                    </TableCell>

                    {/* Custo total */}
                    <TableCell className="py-2 text-xs font-semibold text-slate-700 text-right">
                      R$ {calc.custoTotal.toFixed(2)}
                    </TableCell>

                    {/* Preço venda */}
                    <TableCell className="py-2">
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        value={comp.precoVenda}
                        onChange={e => handleUpdateRow(index, 'precoVenda', parseFloat(e.target.value) || 0)}
                        className="h-7 text-xs py-0 text-right"
                      />
                    </TableCell>

                    {/* Venda total */}
                    <TableCell className="py-2 text-xs font-semibold text-slate-700 text-right">
                      R$ {calc.vendaTotal.toFixed(2)}
                    </TableCell>

                    {/* Ações (Trash) */}
                    <TableCell className="py-2 text-right">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveRow(index)}
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>

                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-between items-center">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleAddRow}
          className="h-8 border-orange-200 text-[#f9943b] hover:bg-orange-50"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Adicionar outro item
        </Button>

        {precoTotalVenda > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onApplyVendaPrice(precoTotalVenda)}
            className="h-8 text-[#f9943b] hover:bg-orange-50 font-semibold"
          >
            Aplicar Preço Venda da Estrutura
          </Button>
        )}
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 border rounded-xl">
        <div className="grid gap-1">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Preço Total de Custo</span>
          <span className="text-lg font-bold text-slate-800">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoTotalCusto)}
          </span>
        </div>
        <div className="grid gap-1 md:text-right">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Preço Total de Venda (Sugerido)</span>
          <span className="text-lg font-bold text-[#f9943b]">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoTotalVenda)}
          </span>
        </div>
      </div>

    </div>
  )
}
