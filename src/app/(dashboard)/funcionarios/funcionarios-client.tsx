"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Users, 
  Plus, 
  Loader2, 
  Pencil, 
  Trash2, 
  HelpCircle, 
  ArrowLeft, 
  Camera, 
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign
} from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { criarFuncionario, editarFuncionario, excluirFuncionario } from "@/actions/funcionarios"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { formatPhone, formatCell, stripNonDigits, validateImageDimensions } from "@/lib/utils"

// Helper functions for inputs formatting
function formatCpf(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function formatCep(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

// Tooltip helper component
function Help({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={
          <span className="cursor-help inline-flex items-center ml-1">
            <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
          </span>
        } />
        <TooltipContent className="bg-slate-900 text-white p-2 rounded shadow-md text-xs max-w-[220px] leading-relaxed">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface Funcionario {
  id: string
  nome: string
  cpf: string
  rg: string | null
  dataNascimento: string | null | Date
  fotoUrl: string | null
  cargo: string | null
  dataAdmissao: string | null | Date
  ctps: string | null
  salario: number | null | any
  telefone: string | null
  celular: string | null
  email: string | null
  cep: string | null
  uf: string | null
  cidade: string | null
  bairro: string | null
  endereco: string | null
  numero: string | null
  complemento: string | null
}

interface FuncionariosClientProps {
  funcionarios: Funcionario[]
  isAdminOrDono: boolean
}

export function FuncionariosClient({ funcionarios, isAdminOrDono }: FuncionariosClientProps) {
  const router = useRouter()
  const [view, setView] = useState<"list" | "create" | "edit">("list")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null)
  
  // Controlled fields
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [rg, setRg] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [fotoUrl, setFotoUrl] = useState("")
  const [cargo, setCargo] = useState("")
  const [dataAdmissao, setDataAdmissao] = useState("")
  const [ctps, setCtps] = useState("")
  const [salario, setSalario] = useState("")
  const [telefone, setTelefone] = useState("")
  const [celular, setCelular] = useState("")
  const [email, setEmail] = useState("")
  const [cep, setCep] = useState("")
  const [uf, setUf] = useState("")
  const [cidade, setCidade] = useState("")
  const [bairro, setBairro] = useState("")
  const [endereco, setEndereco] = useState("")
  const [numero, setNumero] = useState("")
  const [complemento, setComplemento] = useState("")

  const startCreate = () => {
    setSelectedFuncionario(null)
    setNome("")
    setCpf("")
    setRg("")
    setDataNascimento("")
    setFotoUrl("")
    setCargo("")
    setDataAdmissao("")
    setCtps("")
    setSalario("")
    setTelefone("")
    setCelular("")
    setEmail("")
    setCep("")
    setUf("")
    setCidade("")
    setBairro("")
    setEndereco("")
    setNumero("")
    setComplemento("")
    setView("create")
  }

  const startEdit = (f: Funcionario) => {
    setSelectedFuncionario(f)
    setNome(f.nome)
    setCpf(formatCpf(f.cpf))
    setRg(f.rg || "")
    setDataNascimento(f.dataNascimento ? new Date(f.dataNascimento).toISOString().split("T")[0] : "")
    setFotoUrl(f.fotoUrl || "")
    setCargo(f.cargo || "")
    setDataAdmissao(f.dataAdmissao ? new Date(f.dataAdmissao).toISOString().split("T")[0] : "")
    setCtps(f.ctps || "")
    setSalario(f.salario ? String(f.salario) : "")
    setTelefone(f.telefone ? formatPhone(f.telefone) : "")
    setCelular(f.celular ? formatCell(f.celular) : "")
    setEmail(f.email || "")
    setCep(f.cep ? formatCep(f.cep) : "")
    setUf(f.uf || "")
    setCidade(f.cidade || "")
    setBairro(f.bairro || "")
    setEndereco(f.endereco || "")
    setNumero(f.numero || "")
    setComplemento(f.complemento || "")
    setView("edit")
  }

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const rawCep = stripNonDigits(e.target.value)
    if (rawCep.length !== 8) return

    setLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
      const data = await res.json()
      if (data.erro) {
        toast.error("CEP não encontrado.")
      } else {
        setEndereco(data.logradouro || "")
        setBairro(data.bairro || "")
        setCidade(data.localidade || "")
        setUf(data.uf || "")
        toast.success("Endereço preenchido dinamicamente via CEP!")
      }
    } catch {
      toast.error("Erro ao buscar CEP.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Limite de 2MB.")
      return
    }

    const isValidDimensions = await validateImageDimensions(file)
    if (!isValidDimensions) {
      toast.error("As dimensões da imagem superam o limite máximo de 1920x1920px.")
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setFotoUrl(data.url)
        toast.success("Foto carregada com sucesso!")
      } else {
        toast.error(data.error || "Erro no upload da foto.")
      }
    } catch {
      toast.error("Erro inesperado no upload.")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome.trim()) {
      toast.error("O campo Nome Completo é obrigatório.")
      return
    }
    const cleanCpf = stripNonDigits(cpf)
    if (cleanCpf.length !== 11) {
      toast.error("CPF inválido. Certifique-se que contém 11 dígitos.")
      return
    }

    setLoading(true)
    const data = {
      nome,
      cpf: cleanCpf,
      rg: rg || null,
      dataNascimento: dataNascimento || null,
      fotoUrl: fotoUrl || null,
      cargo: cargo || null,
      dataAdmissao: dataAdmissao || null,
      ctps: ctps || null,
      salario: salario ? parseFloat(salario) : null,
      telefone: stripNonDigits(telefone) || null,
      celular: stripNonDigits(celular) || null,
      email: email || null,
      cep: stripNonDigits(cep) || null,
      uf: uf || null,
      cidade: cidade || null,
      bairro: bairro || null,
      endereco: endereco || null,
      numero: numero || null,
      complemento: complemento || null,
    }

    try {
      let result
      if (view === "create") {
        result = await criarFuncionario(data)
      } else {
        result = await editarFuncionario(selectedFuncionario!.id, data)
      }

      if (result.success) {
        toast.success(view === "create" ? "Funcionário cadastrado!" : "Dados atualizados!")
        setView("list")
        router.refresh()
      } else {
        toast.error(result.error || "Erro ao salvar informações.")
      }
    } catch {
      toast.error("Erro no processamento.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este funcionário de forma permanente?")) return

    setLoading(true)
    try {
      const result = await excluirFuncionario(id)
      if (result.success) {
        toast.success("Funcionário removido com sucesso.")
        router.refresh()
      } else {
        toast.error(result.error || "Falha ao excluir.")
      }
    } catch {
      toast.error("Erro inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen bg-[#fdfbf8] text-[#404040]">
      
      {/* 1. LIST VIEW */}
      {view === "list" && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Cadastro de Funcionários</h1>
              <p className="text-sm text-muted-foreground">Gerencie o registro de colaboradores, cargos, salários e endereços.</p>
            </div>
            {funcionarios.length > 0 && (
              <Button onClick={startCreate} className="bg-[#f9943b] hover:bg-[#e07a2c] text-white rounded-full font-bold px-6 shadow-sm">
                <Plus className="mr-1.5 h-4 w-4" />
                Cadastrar Colaborador
              </Button>
            )}
          </div>

          {funcionarios.length === 0 ? (
            <Card className="border-none shadow-xs bg-white py-16 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-orange-50 text-[#f9943b] flex items-center justify-center mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nenhum funcionário cadastrado</h3>
              <p className="text-sm text-slate-500 max-w-sm mt-1.5 mb-6">
                Registre os dados dos colaboradores para gerenciar cargos, folhas e cadastros fiscais de equipe.
              </p>
              <Button onClick={startCreate} className="bg-[#f9943b] hover:bg-[#e07a2c] text-white rounded-full font-bold px-6 py-5">
                <Plus className="mr-1.5 h-4 w-4" />
                Cadastrar Primeiro Funcionário
              </Button>
            </Card>
          ) : (
            <Card className="border-none shadow-xs bg-white rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-900 text-lg">Colaboradores Ativos</CardTitle>
                <CardDescription>Visualização rápida e controle de funcionários.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                      <TableRow>
                        <TableHead className="font-bold text-xs uppercase tracking-wider pl-6 text-slate-500">Funcionário</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Cargo</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">CPF</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Contatos</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Admissão</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Salário</TableHead>
                        <TableHead className="w-[100px] font-bold text-xs uppercase tracking-wider pr-6 text-slate-500 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {funcionarios.map((f) => (
                        <TableRow key={f.id} className="hover:bg-slate-50/40 border-b border-slate-100/60">
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              {f.fotoUrl ? (
                                <img 
                                  src={f.fotoUrl} 
                                  alt={f.nome} 
                                  className="h-9 w-9 rounded-full object-cover border border-slate-100" 
                                />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400">
                                  <Users className="h-4 w-4" />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="font-bold text-sm text-slate-900 whitespace-nowrap">{f.nome}</span>
                                {f.email && <span className="text-xs text-slate-400 font-normal">{f.email}</span>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle">
                            <div className="flex items-center gap-1.5 text-sm text-slate-700 whitespace-nowrap">
                              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                              {f.cargo || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle font-mono text-xs text-slate-600 whitespace-nowrap">
                            {formatCpf(f.cpf)}
                          </TableCell>
                          <TableCell className="align-middle">
                            <div className="flex flex-col gap-0.5 text-xs text-slate-600 whitespace-nowrap">
                              {f.celular && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  {formatCell(f.celular)}
                                </span>
                              )}
                              {f.telefone && !f.celular && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  {formatPhone(f.telefone)}
                                </span>
                              )}
                              {!f.celular && !f.telefone && <span className="text-slate-400">Sem telefone</span>}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle text-slate-600 text-xs whitespace-nowrap">
                            {f.dataAdmissao ? (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                {format(new Date(f.dataAdmissao), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="align-middle font-bold text-sm text-slate-800 whitespace-nowrap">
                            {f.salario ? (
                              <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-500">
                                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                                {parseFloat(f.salario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell className="pr-6 text-right align-middle">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => startEdit(f)}
                                className="h-8 w-8 text-slate-500 hover:text-[#f9943b] hover:bg-slate-100 rounded-lg"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              {isAdminOrDono && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDelete(f.id)}
                                  className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* 2. CREATE / EDIT VIEW */}
      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => setView("list")}
                className="h-9 w-9 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {view === "create" ? "Cadastrar Novo Colaborador" : "Editar Dados do Colaborador"}
                </h1>
                <p className="text-xs text-muted-foreground">Preencha as informações cadastrais obrigatórias (*) e complementares.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setView("list")}
                disabled={loading}
                className="rounded-full px-5 text-slate-500 font-semibold"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || uploading}
                className="bg-[#f9943b] hover:bg-[#e07a2c] text-white rounded-full font-bold px-6 shadow-sm"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                {view === "create" ? "Salvar Funcionário" : "Salvar Alterações"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Side: Form Sections */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* SECTION A: DADOS CADASTRAIS */}
              <Card className="border-none shadow-xs bg-white rounded-2xl">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-[#404040] text-sm font-bold uppercase tracking-wider">Dados Cadastrais</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                  {/* Grid 1: Nome, CPF, RG, Nascimento */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="grid gap-2 md:col-span-6">
                      <Label htmlFor="nome" className="flex items-center text-slate-700 whitespace-nowrap">
                        Nome Completo <span className="text-[#f9943b] ml-0.5">*</span>
                        <Help text="Nome completo do colaborador conforme seu documento de identidade." />
                      </Label>
                      <Input 
                        id="nome" 
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Arthur Furtado"
                        required
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>
                    
                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="cpf" className="flex items-center text-slate-700 whitespace-nowrap">
                        CPF <span className="text-[#f9943b] ml-0.5">*</span>
                        <Help text="Cadastro de Pessoa Física - obrigatório para contratos e guias fiscais." />
                      </Label>
                      <Input 
                        id="cpf" 
                        value={cpf}
                        onChange={(e) => setCpf(formatCpf(e.target.value))}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm font-mono"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="rg" className="flex items-center text-slate-700 whitespace-nowrap">
                        RG
                        <Help text="Número da Cédula de Identidade Civil." />
                      </Label>
                      <Input 
                        id="rg" 
                        value={rg}
                        onChange={(e) => setRg(e.target.value)}
                        placeholder="Ex: 12.345.678-9"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm font-mono"
                      />
                    </div>
                  </div>

                  {/* Grid 2: Nascimento, Cargo, Admissão, CTPS, Salário */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="dataNascimento" className="flex items-center text-slate-700 whitespace-nowrap">
                        Data de Nascimento
                        <Help text="Data de nascimento do funcionário para fins de cadastro de folha." />
                      </Label>
                      <Input 
                        id="dataNascimento" 
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="cargo" className="flex items-center text-slate-700 whitespace-nowrap">
                        Cargo / Função
                        <Help text="Cargo oficial desempenhado pelo funcionário." />
                      </Label>
                      <Input 
                        id="cargo" 
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        placeholder="Ex: Operador de Triagem"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="dataAdmissao" className="flex items-center text-slate-700 whitespace-nowrap">
                        Data de Admissão
                        <Help text="Data de início do colaborador na empresa." />
                      </Label>
                      <Input 
                        id="dataAdmissao" 
                        type="date"
                        value={dataAdmissao}
                        onChange={(e) => setDataAdmissao(e.target.value)}
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="ctps" className="flex items-center text-slate-700 whitespace-nowrap">
                        Número CTPS
                        <Help text="Carteira de Trabalho e Previdência Social física ou digital." />
                      </Label>
                      <Input 
                        id="ctps" 
                        value={ctps}
                        onChange={(e) => setCtps(e.target.value)}
                        placeholder="Ex: 1234567 / 001-SP"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="salario" className="flex items-center text-slate-700 whitespace-nowrap">
                        Salário Base (R$)
                        <Help text="Salário base mensal contratual do colaborador." />
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">R$</span>
                        <Input 
                          id="salario" 
                          type="number"
                          step="0.01"
                          value={salario}
                          onChange={(e) => setSalario(e.target.value)}
                          placeholder="Ex: 2500.00"
                          className="rounded-lg h-10 pl-8 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION B: CONTATO */}
              <Card className="border-none shadow-xs bg-white rounded-2xl">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-[#404040] text-sm font-bold uppercase tracking-wider">Contato</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="telefone" className="flex items-center text-slate-700 whitespace-nowrap">
                      Fone (Fixo)
                      <Help text="Telefone fixo residencial ou de contato secundário." />
                    </Label>
                    <Input 
                      id="telefone" 
                      value={telefone}
                      onChange={(e) => setTelefone(formatPhone(e.target.value))}
                      placeholder="(00) 0000-0000"
                      maxLength={14}
                      className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm font-mono"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="celular" className="flex items-center text-slate-700 whitespace-nowrap">
                      Celular
                      <Help text="Telefone móvel celular principal." />
                    </Label>
                    <Input 
                      id="celular" 
                      value={celular}
                      onChange={(e) => setCelular(formatCell(e.target.value))}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm font-mono"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center text-slate-700 whitespace-nowrap">
                      E-mail
                      <Help text="Endereço de e-mail corporativo ou pessoal." />
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="colaborador@empresa.com"
                      className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SECTION C: ENDEREÇO */}
              <Card className="border-none shadow-xs bg-white rounded-2xl">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-[#404040] text-sm font-bold uppercase tracking-wider">Endereço Residencial</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                  {/* Grid 1: CEP, UF, Cidade, Bairro */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="cep" className="flex items-center text-slate-700 whitespace-nowrap">
                        CEP
                        <Help text="Código de Endereçamento Postal. Preenchimento automático ao sair do campo." />
                      </Label>
                      <Input 
                        id="cep" 
                        value={cep}
                        onChange={(e) => setCep(formatCep(e.target.value))}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        maxLength={9}
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm font-mono"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor="uf" className="flex items-center text-slate-700 whitespace-nowrap">
                        UF
                        <Help text="Estado/Unidade da Federação." />
                      </Label>
                      <Input 
                        id="uf" 
                        value={uf}
                        onChange={(e) => setUf(e.target.value)}
                        placeholder="SP"
                        maxLength={2}
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm uppercase font-mono"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-4">
                      <Label htmlFor="cidade" className="flex items-center text-slate-700 whitespace-nowrap">
                        Cidade
                        <Help text="Município de residência do colaborador." />
                      </Label>
                      <Input 
                        id="cidade" 
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="Ex: Serra Negra"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor="bairro" className="flex items-center text-slate-700 whitespace-nowrap">
                        Bairro
                        <Help text="Bairro da residência." />
                      </Label>
                      <Input 
                        id="bairro" 
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        placeholder="Ex: Centro"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>
                  </div>

                  {/* Grid 2: Rua, Número, Complemento */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="grid gap-2 md:col-span-6">
                      <Label htmlFor="endereco" className="flex items-center text-slate-700 whitespace-nowrap">
                        Endereço / Logradouro
                        <Help text="Rua, Avenida, Praça, etc." />
                      </Label>
                      <Input 
                        id="endereco" 
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        placeholder="Ex: Avenida das Palmeiras"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor="numero" className="flex items-center text-slate-700 whitespace-nowrap">
                        Número
                        <Help text="Número residencial." />
                      </Label>
                      <Input 
                        id="numero" 
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        placeholder="Ex: 123"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm font-mono"
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-4">
                      <Label htmlFor="complemento" className="flex items-center text-slate-700 whitespace-nowrap">
                        Complemento
                        <Help text="Apartamento, Bloco, Casa nos fundos, Ponto de referência, etc." />
                      </Label>
                      <Input 
                        id="complemento" 
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        placeholder="Ex: Apto 42"
                        className="rounded-lg h-10 border-slate-200 focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Side: Photo Upload Area */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="border-none shadow-xs bg-white rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <CardTitle className="text-[#404040] text-sm font-bold uppercase tracking-wider">Foto do Perfil</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="relative group h-32 w-32 rounded-full overflow-hidden border border-slate-200/80 bg-slate-50 flex items-center justify-center text-slate-400 mb-4 transition-all">
                    {fotoUrl ? (
                      <>
                        <img 
                          src={fotoUrl} 
                          alt="Foto do Funcionário" 
                          className="h-full w-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => setFotoUrl("")}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        {uploading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-[#f9943b]" />
                        ) : (
                          <Users className="h-10 w-10 text-slate-300" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {!fotoUrl && (
                    <div className="w-full text-center">
                      <Label 
                        htmlFor="foto-upload" 
                        className={`inline-flex items-center gap-1.5 justify-center w-full py-2 px-3 border border-slate-200 border-dashed rounded-xl text-xs font-bold text-slate-500 hover:text-[#f9943b] hover:border-[#f9943b] hover:bg-orange-50/10 cursor-pointer transition-all ${
                          uploading ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        <Camera className="h-3.5 w-3.5" />
                        {uploading ? "Carregando..." : "Carregar Foto"}
                      </Label>
                      <input 
                        id="foto-upload" 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp" 
                        onChange={handleImageUpload}
                        className="hidden" 
                        disabled={uploading}
                      />
                      <p className="text-[10px] text-slate-400 mt-2">Máx: 2MB (JPG, PNG, WebP) | Dimensões máx: 1920x1920px</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>

        </form>
      )}

    </div>
  )
}
