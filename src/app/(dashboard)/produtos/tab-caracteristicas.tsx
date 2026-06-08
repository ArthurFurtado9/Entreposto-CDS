"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface TabCaracteristicasProps {
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

export function TabCaracteristicas({ fields, onChange }: TabCaracteristicasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 text-left">
      
      {/* Marca */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="marca" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Marca
          <Help text="A marca comercial do produto. Ex: Caipira da Serra." />
        </Label>
        <Input 
          id="marca" 
          value={fields.marca || ""} 
          onChange={e => onChange("marca", e.target.value)} 
          placeholder="Ex: Caipira da Serra"
          className="h-8 text-xs"
        />
      </div>

      {/* Produção */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="producao" className="flex items-center gap-1 text-slate-600 font-medium">
          Produção
        </Label>
        <Select 
          value={fields.producao || "PROPRIA"} 
          onValueChange={val => onChange("producao", val)}
        >
          <SelectTrigger id="producao" className="h-8 text-xs">
            <SelectValue placeholder="Produção..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PROPRIA">Própria</SelectItem>
            <SelectItem value="TERCEIROS">Terceiros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data de validade */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="dataValidade" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Data de validade
          <Help text="Opcional. Data limite sugerida para o consumo seguro do produto." />
        </Label>
        <Input 
          id="dataValidade" 
          type="date"
          value={fields.dataValidade || ""} 
          onChange={e => onChange("dataValidade", e.target.value)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Frete Grátis */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="freteGratis" className="flex items-center gap-1 text-slate-600 font-medium">
          Frete Grátis
        </Label>
        <Select 
          value={fields.freteGratis || "NAO"} 
          onValueChange={val => onChange("freteGratis", val)}
        >
          <SelectTrigger id="freteGratis" className="h-8 text-xs">
            <SelectValue placeholder="Frete Grátis..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SIM">Sim</SelectItem>
            <SelectItem value="NAO">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Peso Líquido */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="pesoLiquido" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Peso Líquido (kg)
          <Help text="Peso do produto líquido de embalagem, em quilogramas (kg)." />
        </Label>
        <Input 
          id="pesoLiquido" 
          type="number"
          step="0.001"
          min="0"
          value={fields.pesoLiquido ?? 0} 
          onChange={e => onChange("pesoLiquido", parseFloat(e.target.value) || 0)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Peso Bruto */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="pesoBruto" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Peso Bruto (kg)
          <Help text="Peso total do produto incluindo a embalagem, em quilogramas (kg)." />
        </Label>
        <Input 
          id="pesoBruto" 
          type="number"
          step="0.001"
          min="0"
          value={fields.pesoBruto ?? 0} 
          onChange={e => onChange("pesoBruto", parseFloat(e.target.value) || 0)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Largura */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="largura" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Largura (cm)
          <Help text="Largura física da embalagem/unidade, em centímetros (cm)." />
        </Label>
        <Input 
          id="largura" 
          type="number"
          step="0.01"
          min="0"
          value={fields.largura ?? 0} 
          onChange={e => onChange("largura", parseFloat(e.target.value) || 0)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Altura */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="altura" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Altura (cm)
          <Help text="Altura física da embalagem/unidade, em centímetros (cm)." />
        </Label>
        <Input 
          id="altura" 
          type="number"
          step="0.01"
          min="0"
          value={fields.altura ?? 0} 
          onChange={e => onChange("altura", parseFloat(e.target.value) || 0)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Profundidade */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="profundidade" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Profundidade (cm)
          <Help text="Profundidade física da embalagem/unidade, em centímetros (cm)." />
        </Label>
        <Input 
          id="profundidade" 
          type="number"
          step="0.01"
          min="0"
          value={fields.profundidade ?? 0} 
          onChange={e => onChange("profundidade", parseFloat(e.target.value) || 0)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Volumes */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="volumes" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Volumes
          <Help text="Quantidade de pacotes ou volumes que compõem uma única unidade deste produto." />
        </Label>
        <Input 
          id="volumes" 
          type="number"
          min="1"
          value={fields.volumes ?? 1} 
          onChange={e => onChange("volumes", parseInt(e.target.value) || 1)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Itens por caixa */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="itensCaixa" className="flex items-center gap-1.5 text-slate-600 font-medium">
          Itens p/ caixa
          <Help text="Quantidade de unidades de produto contidas em uma caixa fechada." />
        </Label>
        <Input 
          id="itensCaixa" 
          type="number"
          min="1"
          value={fields.itensCaixa ?? 1} 
          onChange={e => onChange("itensCaixa", parseInt(e.target.value) || 1)} 
          className="h-8 text-xs"
        />
      </div>

      {/* Unidade de medida */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="unidadeMedida" className="flex items-center gap-1 text-slate-600 font-medium">
          Unidade de medida
        </Label>
        <Select 
          value={fields.unidadeMedida || "Centimetros"} 
          onValueChange={val => onChange("unidadeMedida", val)}
        >
          <SelectTrigger id="unidadeMedida" className="h-8 text-xs">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent className="min-w-[180px]">
            <SelectItem value="Centimetros">Centímetros</SelectItem>
            <SelectItem value="Metros">Metros</SelectItem>
            <SelectItem value="Milimetros">Milímetros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* GTIN/EAN */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="gtinEan" className="flex items-center gap-1.5 text-slate-600 font-medium">
          GTIN/EAN
          <Help text="Código de barras comercial de identificação do produto." />
        </Label>
        <Input 
          id="gtinEan" 
          value={fields.gtinEan || ""} 
          onChange={e => onChange("gtinEan", e.target.value)} 
          placeholder="SEM GTIN"
          className="h-8 text-xs"
        />
      </div>

      {/* GTIN/EAN Tributário */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="gtinEanTributario" className="flex items-center gap-1.5 text-slate-600 font-medium">
          GTIN/EAN tributário
          <Help text="Código de barras comercial do produto faturado no documento fiscal." />
        </Label>
        <Input 
          id="gtinEanTributario" 
          value={fields.gtinEanTributario || ""} 
          onChange={e => onChange("gtinEanTributario", e.target.value)} 
          placeholder="SEM GTIN"
          className="h-8 text-xs"
        />
      </div>

      {/* Departamento */}
      <div className="grid gap-1.5 col-span-2">
        <Label htmlFor="departamento" className="flex items-center gap-1 text-slate-600 font-semibold text-xs">
          Departamento *
        </Label>
        <Select 
          value={fields.departamento || "Não informado"} 
          onValueChange={val => onChange("departamento", val)}
        >
          <SelectTrigger id="departamento" className="h-9 text-xs w-full md:min-w-[280px]">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent className="min-w-[280px]">
            <SelectItem value="Não informado">Não informado</SelectItem>
            <SelectItem value="Alimentos">Alimentos / Ovos</SelectItem>
            <SelectItem value="Embalagens">Embalagens</SelectItem>
            <SelectItem value="Insumos">Insumos Diversos</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}
