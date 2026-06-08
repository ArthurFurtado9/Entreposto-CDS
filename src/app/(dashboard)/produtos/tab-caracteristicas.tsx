"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle } from "lucide-react"

interface TabCaracteristicasProps {
  fields: any
  onChange: (field: string, val: any) => void
}

export function TabCaracteristicas({ fields, onChange }: TabCaracteristicasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 text-left">
      
      {/* Marca */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="marca" className="flex items-center gap-1 text-slate-600 font-medium">
          Marca
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="dataValidade" className="flex items-center gap-1 text-slate-600 font-medium">
          Data de validade
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="pesoLiquido" className="flex items-center gap-1 text-slate-600 font-medium">
          Peso Líquido (kg)
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="pesoBruto" className="flex items-center gap-1 text-slate-600 font-medium">
          Peso Bruto (kg)
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="largura" className="flex items-center gap-1 text-slate-600 font-medium">
          Largura (cm)
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="altura" className="flex items-center gap-1 text-slate-600 font-medium">
          Altura (cm)
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="profundidade" className="flex items-center gap-1 text-slate-600 font-medium">
          Profundidade (cm)
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="volumes" className="flex items-center gap-1 text-slate-600 font-medium">
          Volumes
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="itensCaixa" className="flex items-center gap-1 text-slate-600 font-medium">
          Itens p/ caixa
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
          <SelectContent>
            <SelectItem value="Centimetros">Centímetros</SelectItem>
            <SelectItem value="Metros">Metros</SelectItem>
            <SelectItem value="Milimetros">Milímetros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* GTIN/EAN */}
      <div className="grid gap-1.5 col-span-1">
        <Label htmlFor="gtinEan" className="flex items-center gap-1 text-slate-600 font-medium">
          GTIN/EAN
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="gtinEanTributario" className="flex items-center gap-1 text-slate-600 font-medium">
          GTIN/EAN tributário
          <HelpCircle className="h-3 w-3 text-slate-400" />
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
        <Label htmlFor="departamento" className="flex items-center gap-1 text-slate-600 font-medium">
          Departamento
        </Label>
        <Select 
          value={fields.departamento || "Não informado"} 
          onValueChange={val => onChange("departamento", val)}
        >
          <SelectTrigger id="departamento" className="h-8 text-xs">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
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
