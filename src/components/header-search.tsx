"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, Command, FileText, Settings, Users, PlusCircle } from "lucide-react";

interface SearchItem {
  title: string;
  category: string;
  url: string;
  keywords: string[];
  description: string;
}

const searchIndex: SearchItem[] = [
  {
    title: "Visão Geral (Dashboard)",
    category: "Menu Principal",
    url: "/dashboard",
    keywords: ["inicio", "principal", "dashboard", "visao geral", "home", "resumo", "estatisticas", "visao"],
    description: "Painel principal com indicadores de produção, triagem e quebras."
  },
  {
    title: "Recebimento de Lotes",
    category: "Operações",
    url: "/recebimento",
    keywords: ["novo recebimento", "recebimento", "cadastrar lote", "entrada", "lote", "novo lote", "lote de ovos", "registrar entrada"],
    description: "Registrar entrada de lotes de ovos e rastreabilidade da granja."
  },
  {
    title: "Novo Lote / Entrada",
    category: "Atalhos de Criação",
    url: "/recebimento",
    keywords: ["novo lote", "novo recebimento", "cadastrar lote", "entrada de lote", "criar lote", "registrar lote"],
    description: "Formulário direto para receber lote de ovos no estoque."
  },
  {
    title: "Ovoscopia (Triagem)",
    category: "Operações",
    url: "/ovoscopia",
    keywords: ["ovoscopia", "triagem", "analise de ovos", "qualidade", "quebrados", "trincados", "sujos", "refugo"],
    description: "Registrar resultados de triagem física e perdas de ovos por lote."
  },
  {
    title: "Logística (Picking e Expedição)",
    category: "Operações",
    url: "/logistica",
    keywords: ["logistica", "picking", "expedicao", "entrega", "romaneio", "pedidos", "despacho", "enviar"],
    description: "Separação de pedidos de clientes, montagem de caixas e expedição FIFO."
  },
  {
    title: "Financeiro (Controle de Caixa)",
    category: "Financeiro",
    url: "/financeiro",
    keywords: ["financeiro", "caixa", "contas a pagar", "contas a receber", "faturamento", "lancamentos", "receitas", "despesas", "fluxo de caixa"],
    description: "Gestão de fluxo de caixa, despesas, faturamento e contas."
  },
  {
    title: "Produtos (Catálogo)",
    category: "Cadastros",
    url: "/produtos",
    keywords: ["produtos", "catalogo", "lista de produtos", "itens", "kits", "ovos brancos", "ovos vermelhos"],
    description: "Visualizar e gerenciar o catálogo de produtos e configurações de kits."
  },
  {
    title: "Novo Produto",
    category: "Atalhos de Criação",
    url: "/produtos?novo=true",
    keywords: ["novo produto", "cadastrar produto", "adicionar produto", "criar produto", "registrar produto"],
    description: "Cadastrar um novo produto no catálogo do entreposto."
  },
  {
    title: "Produção e Insumos",
    category: "Operações",
    url: "/producao",
    keywords: ["producao", "insumos", "embalagens", "caixas", "cartelas", "conversao", "estoque de insumos"],
    description: "Controle de estoque de insumos e processos de embalagem."
  },
  {
    title: "Clientes B2B",
    category: "Cadastros",
    url: "/clientes",
    keywords: ["clientes", "novos clientes", "distribuidores", "compradores", "gestao de clientes"],
    description: "Lista completa de distribuidores e compradores parceiros."
  },
  {
    title: "Novo Cliente B2B",
    category: "Atalhos de Criação",
    url: "/clientes",
    keywords: ["novo cliente", "cadastrar cliente", "adicionar cliente", "criar cliente", "registrar cliente"],
    description: "Formulário de cadastro de novo cliente/comprador B2B."
  },
  {
    title: "Fornecedores (Granjas)",
    category: "Cadastros",
    url: "/fornecedores",
    keywords: ["fornecedores", "granjas", "parceiros", "granjas parceiras"],
    description: "Gestão das granjas parceiras fornecedoras de ovos."
  },
  {
    title: "Novo Fornecedor",
    category: "Atalhos de Criação",
    url: "/fornecedores?novo=true",
    keywords: ["novo fornecedor", "cadastrar fornecedor", "adicionar fornecedor", "criar fornecedor", "registrar fornecedor", "granja"],
    description: "Cadastrar uma nova granja parceira fornecedora."
  },
  {
    title: "Relatórios e BI",
    category: "Menu Principal",
    url: "/bi",
    keywords: ["relatorios", "bi", "estatisticas", "graficos", "dashboards", "indicadores", "analytics", "analise"],
    description: "Business Intelligence com relatórios avançados de perdas, quebras e rendimento."
  },
  {
    title: "Configurações do Sistema",
    category: "Configurações",
    url: "/configuracoes",
    keywords: ["configuracoes", "ajustes", "empresa", "equipe", "funcionarios", "papeis", "permissoes", "financeiro"],
    description: "Ajustes gerais do ERP, dados da empresa, permissões e equipe."
  },
  {
    title: "Gestão de Equipe",
    category: "Configurações",
    url: "/configuracoes?tab=equipe",
    keywords: ["equipe", "funcionarios", "usuarios", "novo funcionario", "papeis", "permissoes", "gerenciar equipe"],
    description: "Gerenciar funcionários, criar permissões customizadas e perfis de acesso."
  },
  {
    title: "Configurações da Empresa",
    category: "Configurações",
    url: "/configuracoes?tab=empresa",
    keywords: ["empresa", "cnpj", "razao social", "endereco", "dados fiscais"],
    description: "Configurar dados de faturamento e endereço da empresa."
  },
  {
    title: "Fale Conosco (Suporte)",
    category: "Ajuda",
    url: "/contato",
    keywords: ["contato", "suporte", "ajuda", "ticket", "telefone", "whatsapp", "falar com suporte"],
    description: "Abrir um ticket ou obter canais diretos de suporte da Avilógica."
  },
  {
    title: "Termos de Uso",
    category: "Ajuda",
    url: "/termos",
    keywords: ["termos", "termos de uso", "condicoes", "contrato", "regulamento"],
    description: "Visualizar os Termos e Condições Jurídicas de uso da plataforma."
  },
  {
    title: "Segurança e Privacidade",
    category: "Ajuda",
    url: "/privacidade",
    keywords: ["privacidade", "seguranca", "politicas", "cookies", "antispam", "lgpd"],
    description: "Visualizar as diretrizes de privacidade de dados, cookies e combate ao spam."
  }
];

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on query
  const filteredItems = React.useMemo(() => {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return [];
    return searchIndex.filter(item => {
      return (
        item.title.toLowerCase().includes(cleanQuery) ||
        item.category.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery) ||
        item.keywords.some(keyword => keyword.includes(cleanQuery))
      );
    });
  }, [query]);

  // Handle keyboard shortcuts (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && inputRef.current !== e.target) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    router.push(item.url);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <div className="relative w-full md:w-80 lg:max-w-[600px] lg:min-w-[280px] lg:flex-1 hidden md:block">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Pesquisar recursos... (ex: novo produto)"
          className="w-full h-9 pl-9 pr-4 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#f9943b] focus:border-[#f9943b] text-xs font-medium text-slate-700 placeholder-slate-400 transition-all shadow-2xs"
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Floating Dropdown Results */}
      {isOpen && query.trim() !== "" && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/80 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50 p-2 animate-fadeIn"
        >
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Resultados Encontrados ({filteredItems.length})
              </div>
              
              {filteredItems.map((item, index) => {
                const isSelected = selectedIndex === index;
                const isShortcut = item.category === "Atalhos de Criação";
                
                return (
                  <button
                    key={item.title + "-" + item.url}
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between gap-4 cursor-pointer ${
                      isSelected 
                        ? "bg-amber-50/80 text-slate-950 font-medium" 
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${
                        isShortcut 
                          ? "bg-amber-100 text-[#f9943b]" 
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {isShortcut ? (
                          <PlusCircle className="w-4 h-4" />
                        ) : item.category === "Configurações" ? (
                          <Settings className="w-4 h-4" />
                        ) : item.category === "Cadastros" ? (
                          <Users className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate text-slate-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isShortcut 
                          ? "bg-amber-50 text-[#f9943b] border border-amber-200/50" 
                          : "bg-slate-50 text-slate-400 border border-slate-200/50"
                      }`}>
                        {item.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400 font-medium space-y-1">
              <p>Nenhum recurso encontrado para &ldquo;{query}&rdquo;</p>
              <p className="text-[10px] text-slate-400">Verifique a ortografia ou tente palavras-chave diferentes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
