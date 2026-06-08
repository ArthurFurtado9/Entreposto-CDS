"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Info, HelpCircle } from "lucide-react"

interface TabTributacaoProps {
  fields: any
  onChange: (field: string, val: any) => void
}

export function TabTributacao({ fields, onChange }: TabTributacaoProps) {
  return (
    <div className="space-y-6 py-4 text-left">
      
      {/* Alert Banner */}
      <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 text-xs">
        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Dados da nota fiscal: </span>
          <span className="text-blue-800/95">Preencha somente se for emitir nota fiscal para este produto.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Origem */}
        <div className="grid gap-1.5 md:col-span-1">
          <Label htmlFor="origem" className="flex items-center gap-1 text-slate-600 font-medium">
            Origem
            <HelpCircle className="h-3 w-3 text-slate-400" />
          </Label>
          <Select 
            value={fields.origem || "0"} 
            onValueChange={val => onChange("origem", val)}
          >
            <SelectTrigger id="origem" className="h-8 text-xs">
              <SelectValue placeholder="Selecione a origem..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8</SelectItem>
              <SelectItem value="1">1 - Estrangeira - Importação direta, exceto a indicada no código 6</SelectItem>
              <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NCM */}
        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="ncm" className="flex items-center gap-1 text-slate-600 font-medium">
            NCM
            <HelpCircle className="h-3 w-3 text-slate-400" />
          </Label>
          <Input 
            id="ncm" 
            value={fields.ncm || ""} 
            onChange={e => onChange("ncm", e.target.value)} 
            placeholder="Ex: 0407.21.00"
            className="h-8 text-xs"
          />
        </div>

        {/* CEST */}
        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="cest" className="flex items-center gap-1 text-slate-600 font-medium">
            CEST
            <HelpCircle className="h-3 w-3 text-slate-400" />
          </Label>
          <Input 
            id="cest" 
            value={fields.cest || ""} 
            onChange={e => onChange("cest", e.target.value)} 
            placeholder="Ex: 17.001.00"
            className="h-8 text-xs"
          />
        </div>

        {/* Tipo do item */}
        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="tipoItem" className="flex items-center gap-1 text-slate-600 font-medium">
            Tipo do item
            <HelpCircle className="h-3 w-3 text-slate-400" />
          </Label>
          <Select 
            value={fields.tipoItem || "PRODUTO_ACABADO"} 
            onValueChange={val => onChange("tipoItem", val)}
          >
            <SelectTrigger id="tipoItem" className="h-8 text-xs">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRODUTO_ACABADO">Produto Acabado</SelectItem>
              <SelectItem value="MATERIA_PRIMA">Matéria Prima</SelectItem>
              <SelectItem value="EMBALAGEM">Embalagem</SelectItem>
              <SelectItem value="SERVICO">Serviço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* % Tributos */}
        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="percentualTributos" className="flex items-center gap-1 text-slate-600 font-medium">
            % Tributos
            <HelpCircle className="h-3 w-3 text-slate-400" />
          </Label>
          <Input 
            id="percentualTributos" 
            type="number"
            step="0.01"
            min="0"
            value={fields.percentualTributos ?? 0} 
            onChange={e => onChange("percentualTributos", parseFloat(e.target.value) || 0)} 
            className="h-8 text-xs"
          />
        </div>

        {/* Grupo de Produtos */}
        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="grupoProdutos" className="text-slate-600 font-medium">
            Grupo de Produtos
          </Label>
          <Input 
            id="grupoProdutos" 
            value={fields.grupoProdutos || ""} 
            onChange={e => onChange("grupoProdutos", e.target.value)} 
            placeholder="Ex: Ovos Caipiras"
            className="h-8 text-xs"
          />
        </div>

      </div>

      {/* ICMS Section */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
          <span>ICMS</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-1.5 col-span-1">
            <Label htmlFor="icmsBaseStRetencao" className="flex items-center gap-1 text-slate-600 text-xs">
              Valor base ICMS ST - retenção
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <Input 
              id="icmsBaseStRetencao" 
              type="number"
              step="0.0001"
              min="0"
              value={fields.icmsBaseStRetencao ?? 0} 
              onChange={e => onChange("icmsBaseStRetencao", parseFloat(e.target.value) || 0)} 
              className="h-8 text-xs"
            />
          </div>
          <div className="grid gap-1.5 col-span-1">
            <Label htmlFor="icmsStRetencao" className="flex items-center gap-1 text-slate-600 text-xs">
              Valor ICMS ST para retenção
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <Input 
              id="icmsStRetencao" 
              type="number"
              step="0.0001"
              min="0"
              value={fields.icmsStRetencao ?? 0} 
              onChange={e => onChange("icmsStRetencao", parseFloat(e.target.value) || 0)} 
              className="h-8 text-xs"
            />
          </div>
          <div className="grid gap-1.5 col-span-1">
            <Label htmlFor="icmsProprioSubstituto" className="flex items-center gap-1 text-slate-600 text-xs">
              Valor ICMS próprio do substituto
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <Input 
              id="icmsProprioSubstituto" 
              type="number"
              step="0.0001"
              min="0"
              value={fields.icmsProprioSubstituto ?? 0} 
              onChange={e => onChange("icmsProprioSubstituto", parseFloat(e.target.value) || 0)} 
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* IPI Section */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
          <span>IPI</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-1.5 col-span-1">
            <Label htmlFor="ipiCodigoExcecaoTipi" className="flex items-center gap-1 text-slate-600 text-xs">
              Código exceção da TIPI
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <Input 
              id="ipiCodigoExcecaoTipi" 
              value={fields.ipiCodigoExcecaoTipi || "0"} 
              onChange={e => onChange("ipiCodigoExcecaoTipi", e.target.value)} 
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* PIS / COFINS Section */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
          <span>PIS / COFINS</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-1.5 col-span-1">
            <Label htmlFor="pisFixo" className="flex items-center gap-1 text-slate-600 text-xs">
              Valor PIS fixo
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <Input 
              id="pisFixo" 
              type="number"
              step="0.0001"
              min="0"
              value={fields.pisFixo ?? 0} 
              onChange={e => onChange("pisFixo", parseFloat(e.target.value) || 0)} 
              className="h-8 text-xs"
            />
          </div>
          <div className="grid gap-1.5 col-span-1">
            <Label htmlFor="cofinsFixo" className="flex items-center gap-1 text-slate-600 text-xs">
              Valor COFINS fixo
              <HelpCircle className="h-3 w-3 text-slate-400" />
            </Label>
            <Input 
              id="cofinsFixo" 
              type="number"
              step="0.0001"
              min="0"
              value={fields.cofinsFixo ?? 0} 
              onChange={e => onChange("cofinsFixo", parseFloat(e.target.value) || 0)} 
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Dados Adicionais Section */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Dados adicionais</h4>
        <div className="grid gap-1.5">
          <Label htmlFor="informacoesAdicionais" className="flex items-center gap-1 text-slate-600 text-xs">
            Informações Adicionais
            <HelpCircle className="h-3 w-3 text-slate-400" />
          </Label>
          <Textarea 
            id="informacoesAdicionais" 
            value={fields.informacoesAdicionais || ""} 
            onChange={e => onChange("informacoesAdicionais", e.target.value)} 
            placeholder="Escreva observações fiscais ou comerciais adicionais para o produto..."
            className="min-h-[80px] text-xs"
          />
        </div>
      </div>

    </div>
  )
}
