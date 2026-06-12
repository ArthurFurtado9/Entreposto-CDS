"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Scale, Shield, FileText, Check, ChevronRight } from "lucide-react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("1");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const sections = [
    { id: "1", title: "1. Aceite dos Termos" },
    { id: "2", title: "2. Definições da Plataforma" },
    { id: "3", title: "3. Cadastro e Segurança" },
    { id: "4", title: "4. Planos, Add-ons e Upgrade" },
    { id: "5", title: "5. Uso e Condutas Proibidas" },
    { id: "6", title: "6. SLA e Disponibilidade" },
    { id: "7", title: "7. APIs e Integrações" },
    { id: "8", title: "8. Inteligência Artificial" },
    { id: "9", title: "9. Backups e Retenção" },
    { id: "10", title: "10. Inadimplência e Bloqueio" },
    { id: "11", title: "11. Propriedade Intelectual" },
    { id: "12", title: "12. Legislação e Foro" },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#404040] font-sans selection:bg-amber-100 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      
      {/* Container */}
      <div className="max-w-6xl mx-auto space-y-8 print:max-w-full">
        
        {/* Navigation / Header controls */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-6 print:hidden">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#f9943b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#f9943b]" />
            Voltar para o Login
          </Link>
          
          <button 
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#f9943b]" />
            Imprimir / Salvar PDF
          </button>
        </div>

        {/* Top Header Panel */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 print:border-none print:shadow-none print:p-0">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold print:hidden">
              <Scale className="w-3.5 h-3.5 text-[#f9943b]" />
              Instrumento Jurídico
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-dm-sans">
              Termos e Condições de Uso
            </h1>
            <p className="text-sm text-slate-500">
              Plataforma de Gestão ERP para Entreposto de Ovos — Avilógica
            </p>
          </div>
          <div className="text-left md:text-right print:text-left">
            <span className="text-xs text-slate-400 block">Última atualização</span>
            <span className="text-xs font-bold text-slate-700">10 de Junho de 2026</span>
          </div>
        </div>

        {/* Content Layout: Sticky index on left, content on right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Index Sidebar (hidden on print and mobile) */}
          <aside className="lg:col-span-1 sticky top-6 space-y-4 hidden lg:block print:hidden">
            <div className="bg-white border border-slate-200/50 rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#f9943b]" />
                Navegação Rápida
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-between font-medium cursor-pointer ${
                      activeSection === section.id
                        ? "bg-amber-50/70 text-[#f9943b] font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <span>{section.title}</span>
                    {activeSection === section.id && <ChevronRight className="w-3 h-3 text-[#f9943b]" />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Detailed Legal Text Panel */}
          <main className="lg:col-span-3 bg-white border border-slate-200/50 rounded-2xl p-6 md:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
            <div className="space-y-10 text-sm leading-relaxed text-slate-600 print:text-xs print:leading-normal">
              
              <div className="prose max-w-none text-slate-600">
                <p className="font-semibold text-slate-800">
                  Este instrumento regula as condições de contratação e uso da plataforma digital Avilógica. Antes de iniciar o cadastro e a utilização dos serviços, certifique-se de ter compreendido todas as cláusulas dispostas abaixo. Ao marcar a caixa de aceitação no cadastro ou acessar o sistema, você concorda de forma integral, irrestrita e sem reservas com o presente Termo.
                </p>
              </div>

              {/* 1. Aceite dos Termos */}
              <section id="section-1" className="space-y-3 pt-4 border-t border-slate-100 first:border-t-0 first:pt-0">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">1.</span> Aceite dos Termos
                </h2>
                <p>
                  Ao acessar, cadastrar-se ou utilizar a plataforma <strong>Avilógica</strong>, o Usuário expressa sua concordância tácita e plena com as diretrizes deste documento. Se houver discórdia em relação a qualquer disposição descrita, o acesso deve ser descontinuado imediatamente.
                </p>
                <p>
                  A Avilógica reserva-se o direito de atualizar ou alterar as cláusulas destes Termos a qualquer momento. A nova versão entrará em vigor na data de sua publicação no endereço eletrônico da plataforma. O uso continuado após alterações indica concordância automática.
                </p>
              </section>

              {/* 2. Definições da Plataforma */}
              <section id="section-2" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">2.</span> Definições da Plataforma
                </h2>
                <p>Para fins deste instrumento, consideram-se as seguintes definições:</p>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Avilógica:</strong> Solução de software sob a modalidade SaaS (Software as a Service) voltada para gestão integrada (ERP) de entrepostos de ovos e avicultura, operada e de propriedade intelectual exclusiva da empresa desenvolvedora proprietária da marca.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Usuário (ou Cliente):</strong> Pessoa física ou jurídica devidamente cadastrada na plataforma que usufrui da licença temporária de uso do software mediante o pagamento dos respectivos planos.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Perfis de Usuário:</strong> Níveis e acessos configurados pelo administrador principal da conta para delimitar as funções de sua equipe (por exemplo: Dono, Administrador, Operador de Ovoscopia, Conferente de Estoque e Faturamento).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Planos de Assinatura:</strong> Pacotes comerciais que determinam as capacidades operacionais permitidas no ERP, tais como volume de lotes de ovos processados mensalmente, quantidade de cadastros de integrados/granhas parceiras e limites de faturamento fiscal.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Add-on (Recursos Adicionais):</strong> Extensões funcionais opcionais que podem ser contratadas pelo Usuário para somar utilidades específicas ao plano principal (como pacotes extras de armazenamento de relatórios e faturador fiscal robusto).
                    </div>
                  </li>
                </ul>
              </section>

              {/* 3. Cadastro e Segurança */}
              <section id="section-3" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">3.</span> Cadastro e Segurança
                </h2>
                <p>
                  Para a utilização do ERP Avilógica, é obrigatório o fornecimento de dados exatos e atualizados a respeito da pessoa física ou da pessoa jurídica contratante (incluindo CNPJ, razão social, endereço de atividade e e-mail do representante legal).
                </p>
                <p>
                  O Usuário declara-se responsável civil e criminalmente pelas informações inseridas no momento do registro. Caso constatada qualquer inconsistência, falsidade ou dados desatualizados, a Avilógica poderá, a seu exclusivo critério, suspender ou bloquear o acesso da conta preventivamente, sem direito a indenização ou reembolsos.
                </p>
                <p>
                  As credenciais de acesso (nome de usuário e senha) são confidenciais, pessoais e intransferíveis. O Usuário é o único responsável pelo sigilo das chaves de segurança criadas, bem como pelas atividades de seus operadores. O uso compartilhado de contas de operadores fora das dependências operacionais do entreposto ou de forma negligente isenta a Avilógica de qualquer responsabilidade por invasões ou perda de dados.
                </p>
              </section>

              {/* 4. Planos, Add-ons e Upgrade */}
              <section id="section-4" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">4.</span> Planos, Add-ons e Upgrade
                </h2>
                <p>
                  Os Planos de Assinatura contratados vinculam o Usuário às capacidades definidas no portal oficial da plataforma. Qualquer upgrade de plano solicitado pelo Usuário será cobrado de forma proporcional aos dias restantes do ciclo de faturamento mensal.
                </p>
                <p>
                  <strong>Upgrade Automático por Consumo:</strong> Caso o entreposto exceda recorrentemente os limites de processamento de caixas de ovos ou o tráfego máximo da API integrado ao seu plano atual por 2 (dois) meses consecutivos, a Avilógica fará o upgrade automático para a categoria adequada ao volume operacional verificado, faturando o novo valor a partir do ciclo de cobrança subsequente, com prévio aviso via painel ou e-mail cadastrado.
                </p>
              </section>

              {/* 5. Uso e Condutas Proibidas */}
              <section id="section-5" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">5.</span> Uso e Condutas Proibidas
                </h2>
                <p>O Usuário obriga-se a utilizar o sistema Avilógica de boa-fé. Fica expressamente proibido:</p>
                <ul className="space-y-2 pl-2">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <span>Praticar engenharia reversa, decodificação, descompilação ou duplicação do código-fonte e das lógicas de classificação e FIFO estruturadas na plataforma;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <span>Realizar testes de estresse, injeção de scripts (SQL Injection) ou tentar contornar mecanismos de autenticação dos servidores;</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <span>Acessar o sistema através de proxies de ocultação, VPNs que visem falsear a identificação geográfica de IP ou qualquer outra tecnologia maliciosa que prejudique a segurança e a transparência da conexão.</span>
                  </li>
                </ul>
              </section>

              {/* 6. SLA e Disponibilidade */}
              <section id="section-6" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">6.</span> SLA e Nível de Serviço (Disponibilidade)
                </h2>
                <p>
                  A Avilógica envidará seus melhores esforços comerciais e tecnológicos para manter um Acordo de Nível de Serviço (SLA) de <strong>99,5% (noventa e nove vírgula cinco por cento)</strong> de uptime anual para a plataforma.
                </p>
                <p>
                  Não entram no cálculo de indisponibilidade os períodos decorrentes de: (a) manutenções programadas de infraestrutura informadas previamente com antecedência mínima de 24h; (b) falhas de conexão de internet privada do Usuário; (c) falhas críticas em serviços integrados de terceiros, como plataformas governamentais de emissão fiscal (SEFAZ) e consultas de CNPJ/Receita Federal.
                </p>
              </section>

              {/* 7. APIs e Integrações */}
              <section id="section-7" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">7.</span> APIs e Integrações
                </h2>
                <p>
                  A plataforma disponibiliza acesso a APIs para a comunicação com marketplaces, balanças eletrônicas e faturamento automatizado. A Avilógica reserva-se o direito de estipular limites de volume de requisições periódicas (rate limiting) para assegurar a performance global do ERP para todas as empresas usuárias.
                </p>
                <p>
                  Requisições abusivas que excedam o limite estabelecido no plano provocarão a limitação temporária ou a suspensão imediata da chave de acesso à API, com o objetivo de proteger a integridade dos servidores compartilhados.
                </p>
              </section>

              {/* 8. Inteligência Artificial */}
              <section id="section-8" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">8.</span> Automações com Inteligência Artificial
                </h2>
                <p>
                  A Avilógica integra recursos de inteligência computacional para estimar quebras, prever rendimento de classificação física de ovos com base no histórico do lote e sugerir processos operacionais.
                </p>
                <p>
                  <strong>Aviso de Imprecisão (Isenção de Alucinações):</strong> O Usuário declara estar ciente de que as previsões geradas baseiam-se em estatísticas amostrais. A Avilógica não garante a exatidão absoluta dos dados gerados por IA e não se responsabiliza por decisões gerenciais ou logísticas equivocadas (incluindo descarte precoce ou perdas fiscais) decorrentes dessas sugestões. Cabe exclusivamente ao gestor técnico do entreposto revisar e validar todos os outputs analíticos.
                </p>
              </section>

              {/* 9. Backups e Retenção */}
              <section id="section-9" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">9.</span> Backups, Extração de Dados e Retenção
                </h2>
                <p>
                  Os dados inseridos no ERP são de propriedade exclusiva do Cliente. O Usuário poderá realizar a extração e exportação de seus relatórios de estoque e lançamentos financeiros através do painel a qualquer momento.
                </p>
                <p>
                  <strong>SLA de Extração:</strong> Na impossibilidade técnica de auto-extração direta no painel, a solicitação formal de backup à equipe interna de engenharia do Avilógica será atendida em um prazo máximo de <strong>48 (quarenta e oito) horas úteis</strong>.
                </p>
                <p>
                  <strong>Retenção de Dados Pós-Cancelamento:</strong> Em caso de rescisão ou cancelamento da assinatura por qualquer motivo, os dados de inventário, notas e classificação física do Cliente serão mantidos nos servidores do Avilógica pelo período improrrogável de <strong>90 (noventa) dias</strong>. Decorrido este período de tolerância, a Avilógica promoverá a exclusão lógica definitiva, irreversível e completa de toda a base de dados do Cliente nos servidores de produção e backups de redundância, restando preservadas apenas chaves fiscais legalmente exigidas pelas autoridades tributárias.
                </p>
              </section>

              {/* 10. Inadimplência e Bloqueio */}
              <section id="section-10" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">10.</span> Inadimplência e Bloqueio Operacional
                </h2>
                <p>
                  O atraso no pagamento das parcelas de assinatura por período superior a <strong>15 (quinze) dias corridos</strong> autoriza a Avilógica a suspender preventivamente o acesso operacional da equipe do Usuário às funcionalidades de triagem de lotes, classificação, FIFO e faturamento.
                </p>
                <p>
                  Durante o período de bloqueio, os dados permanecerão armazenados e o login do Proprietário principal estará ativo unicamente na tela de faturamento e regularização de débitos. A liberação do ambiente ocorrerá em até 24h após a conciliação bancária do pagamento em aberto.
                </p>
              </section>

              {/* 11. Propriedade Intelectual */}
              <section id="section-11" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">11.</span> Propriedade Intelectual
                </h2>
                <p>
                  Todo o software, interfaces gráficas, marcas, logotipos, banco de dados, códigos-fonte, algoritmos e materiais de suporte da plataforma Avilógica são de titularidade única e exclusiva dos criadores originais do sistema.
                </p>
                <p>
                  A contratação dos planos outorga uma licença temporária de uso, não exclusiva, intransferível e revogável. Nenhum direito de propriedade industrial ou intelectual é transferido ao Usuário em razão deste termo.
                </p>
              </section>

              {/* 12. Legislação e Foro */}
              <section id="section-12" className="space-y-3 pt-6 border-t border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 font-dm-sans flex items-center gap-2">
                  <span className="text-amber-500">12.</span> Legislação e Foro de Eleição
                </h2>
                <p>
                  Estes Termos de Uso são regidos e interpretados integralmente pelas leis vigentes na República Federativa do Brasil, em particular o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                </p>
                <p>
                  Para dirimir qualquer controvérsia judicial decorrente deste instrumento, as partes contratantes elegem a <strong>Comarca de Bento Gonçalves, RS</strong>, com renúncia expressa a qualquer outro foro por mais privilegiado que seja.
                </p>
              </section>

            </div>

            {/* Footer inside Card */}
            <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 print:text-left print:mt-12">
              <p className="font-medium">avilogica.com.br — Todos os direitos reservados.</p>
              <p className="text-[10px] text-slate-400 mt-1">Avilógica LTDA. CNPJ: 02.351.877/0011-24</p>
            </div>
          </main>

        </div>

      </div>
    </div>
  );
}
