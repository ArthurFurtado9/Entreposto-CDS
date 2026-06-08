"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Info, HelpCircle } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface TabTributacaoProps {
  fields: any
  onChange: (field: string, val: any) => void
}

function Help({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={
          <span className="cursor-help inline-flex items-center">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
          </span>
        } />
        <TooltipContent className="bg-slate-900 dark:bg-zinc-800 text-white dark:text-zinc-100 p-2 rounded shadow-md text-xs max-w-[220px] leading-relaxed">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
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
          <Label htmlFor="origem" className="flex items-center gap-1.5 text-slate-600 font-medium">
            Origem
            <Help text="Origem da mercadoria (Nacional/Estrangeira) para fins de apuração de ICMS." />
          </Label>
          <Select 
            value={fields.origem || "0"} 
            onValueChange={val => onChange("origem", val)}
          >
            <SelectTrigger id="origem" className="h-8 text-xs w-full md:min-w-[240px]">
              <SelectValue placeholder="Selecione a origem..." />
            </SelectTrigger>
            <SelectContent className="min-w-[380px] max-w-[500px]">
              <SelectItem value="0">0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8</SelectItem>
              <SelectItem value="1">1 - Estrangeira - Importação direta, exceto a indicada no código 6</SelectItem>
              <SelectItem value="2">2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NCM */}
        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="ncm" className="flex items-center gap-1.5 text-slate-600 font-medium">
            NCM
            <Help text="Nomenclatura Comum do Mercosul. Código de 8 dígitos para classificação fiscal." />
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
          <Label htmlFor="cest" className="flex items-center gap-1.5 text-slate-600 font-medium">
            CEST
            <Help text="Código Especificador da Substituição Tributária (7 dígitos)." />
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
          <Label htmlFor="tipoItem" className="flex items-center gap-1.5 text-slate-600 font-medium">
            Tipo do item
            <Help text="Tipo do item conforme tabela do Bloco K (matéria-prima, produto acabado, embalagem, etc.)." />
          </Label>
          <Select 
            value={fields.tipoItem || "PRODUTO_ACABADO"} 
            onValueChange={val => onChange("tipoItem", val)}
          >
            <SelectTrigger id="tipoItem" className="h-8 text-xs w-full md:min-w-[180px]">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent className="min-w-[180px]">
              <SelectItem value="PRODUTO_ACABADO">Produto Acabado</SelectItem>
              <SelectItem value="MATERIA_PRIMA">Matéria Prima</SelectItem>
              <SelectItem value="EMBALAGEM">Embalagem</SelectItem>
              <SelectItem value="SERVICO">Serviço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* % Tributos */}
        <div className="grid gap-1.5 col-span-1">
          <Label htmlFor="percentualTributos" className="flex items-center gap-1.5 text-slate-600 font-medium">
            % Tributos
            <Help text="Percentual aproximado de carga tributária incidente (Lei da Transparência)." />
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
            <Label htmlFor="icmsBaseStRetencao" className="flex items-center gap-1.5 text-slate-600 text-xs">
              Valor base ICMS ST - retenção
              <Help text="Valor da base de cálculo do ICMS ST retido na operação anterior." />
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
            <Label htmlFor="icmsStRetencao" className="flex items-center gap-1.5 text-slate-600 text-xs">
              Valor ICMS ST para retenção
              <Help text="Valor do imposto ICMS Substituição Tributária retido." />
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
            <Label htmlFor="icmsProprioSubstituto" className="flex items-center gap-1.5 text-slate-600 text-xs">
              Valor ICMS próprio do substituto
              <Help text="Valor do ICMS próprio correspondente à operação própria do substituto." />
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
            <Label htmlFor="ipiCodigoExcecaoTipi" className="flex items-center gap-1.5 text-slate-600 text-xs">
              Código exceção da TIPI
              <Help text="Código correspondente à exceção de alíquota da tabela do IPI." />
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
            <Label htmlFor="pisFixo" className="flex items-center gap-1.5 text-slate-600 text-xs">
              Valor PIS fixo
              <Help text="Alíquota fixa (em valor) aplicável para cálculo do PIS." />
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
            <Label htmlFor="cofinsFixo" className="flex items-center gap-1.5 text-slate-600 text-xs">
              Valor COFINS fixo
              <Help text="Alíquota fixa (em valor) aplicável para cálculo do COFINS." />
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
          <Label htmlFor="informacoesAdicionais" className="flex items-center gap-1.5 text-slate-600 text-xs">
            Informações Adicionais
            <Help text="Observações fiscais impressas na nota fiscal eletrônica." />
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
