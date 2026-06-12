"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Shield, Eye, ShieldAlert, CheckCircle, Mail, Ban, Database, Info } from "lucide-react";

export default function PrivacyPage() {
  const [activeTab, setActiveTab] = useState<"privacy" | "cookies" | "antispam">("privacy");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#404040] font-sans selection:bg-amber-100 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      
      {/* Container */}
      <div className="max-w-5xl mx-auto space-y-8 print:max-w-full">
        
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
              <Shield className="w-3.5 h-3.5 text-[#f9943b]" />
              Políticas de Conformidade
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-dm-sans">
              Segurança e Privacidade
            </h1>
            <p className="text-sm text-slate-500">
              Políticas Gerais da Plataforma Avilógica
            </p>
          </div>
          <div className="text-left md:text-right print:text-left">
            <span className="text-xs text-slate-400 block">Última atualização</span>
            <span className="text-xs font-bold text-slate-700">10 de Junho de 2026</span>
          </div>
        </div>

        {/* Dynamic Tabs Navigation (hidden on print) */}
        <div className="flex border-b border-slate-200/60 print:hidden gap-1 md:gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "privacy"
                ? "bg-white border-t border-x border-slate-200/50 text-[#f9943b] shadow-xs"
                : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Eye className="w-4 h-4 text-[#f9943b]" />
            Política de Privacidade
          </button>
          
          <button
            onClick={() => setActiveTab("cookies")}
            className={`px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "cookies"
                ? "bg-white border-t border-x border-slate-200/50 text-[#f9943b] shadow-xs"
                : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Database className="w-4 h-4 text-[#f9943b]" />
            Política de Cookies
          </button>

          <button
            onClick={() => setActiveTab("antispam")}
            className={`px-4 py-2.5 rounded-t-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === "antispam"
                ? "bg-white border-t border-x border-slate-200/50 text-[#f9943b] shadow-xs"
                : "text-slate-500 hover:text-slate-950 hover:bg-slate-50"
            }`}
          >
            <Ban className="w-4 h-4 text-[#f9943b]" />
            Política Antispam
          </button>
        </div>

        {/* Policies Content Card */}
        <div className="bg-white border border-slate-200/50 rounded-2xl p-6 md:p-10 shadow-sm print:border-none print:shadow-none print:p-0">
          
          {/* TAB 1: Política de Privacidade */}
          {activeTab === "privacy" && (
            <div className="space-y-8 text-sm leading-relaxed text-slate-600 print:block">
              
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-950 font-dm-sans">Política de Privacidade</h2>
                <p className="text-xs text-slate-400 mt-1">Conformidade estrita com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">1. Quem somos nós</h3>
                <p>
                  A <strong>Avilógica</strong> oferece um ecossistema integrado de gestão empresarial (ERP) projetado para o mercado avícola e de entrepostos de ovos. Atuamos com licenciamento de software SaaS, automação de processos de triagem/classificação, controle de estoque PEPS (FIFO), faturamento fiscal e financeiro. Os dados coletados são tratados com o máximo rigor técnico, sempre pela pessoa jurídica legalmente detentora da plataforma.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">2. Definições importantes</h3>
                <ul className="space-y-2.5 pl-2">
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Agentes de Tratamento:</strong> Controlador (a quem competem as decisões sobre o tratamento de dados, neste caso, a própria empresa usuária do ERP) e o Operador (que realiza o tratamento em nome do Controlador, neste caso, a Avilógica, agindo sob instruções técnicas).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Dados Pessoais:</strong> Qualquer informação relacionada a uma pessoa física identificada ou identificável (como nome, CPF, e-mail de colaboradores e contatos cadastrados de clientes).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f9943b] mt-1.5 shrink-0" />
                    <div>
                      <strong>Tratamento de Dados:</strong> Toda operação realizada com dados pessoais (como a coleta, processamento, classificação, armazenamento, transmissão e eliminação).
                    </div>
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">3. Dados que coletamos</h3>
                <p>Coletamos e processamos dados nas seguintes modalidades:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase block mb-1">Dados fornecidos diretamente</span>
                    <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
                      <li>Dados cadastrais de faturamento (CNPJ, Razão Social).</li>
                      <li>Nomes, CPFs e e-mails de operadores da plataforma.</li>
                      <li>Credenciais de acesso criptografadas.</li>
                      <li>Dados de contato corporativo e logs de chamados de suporte.</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase block mb-1">Dados coletados automaticamente</span>
                    <ul className="list-disc pl-4 text-xs text-slate-500 space-y-1">
                      <li>Endereço IP e informações do navegador.</li>
                      <li>Logs de atividade (data/hora, alterações em estoque, etc.).</li>
                      <li>Dados de telemetria e performance operacional.</li>
                      <li>Geolocalização aproximada para auditoria de segurança de acessos.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">4. Como utilizamos os dados</h3>
                <p>Os dados tratados destinam-se exclusivamente às seguintes finalidades:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Garantir a execução do contrato de licença de uso do ERP Avilógica;</li>
                  <li>Manter a rastreabilidade alimentar dos lotes de ovos e emissão correta de notas fiscais;</li>
                  <li>Realizar auditorias de segurança interna para evitar acessos simultâneos indevidos ou fraudes financeiras;</li>
                  <li>Fornecer suporte técnico operacional qualificado aos usuários;</li>
                  <li>Cumprir obrigações legais, sanitárias ou regulatórias (como relatórios exigidos pela inspeção agropecuária).</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">5. Compartilhamento de Informações</h3>
                <p>
                  A Avilógica não comercializa nem aluga dados operacionais ou pessoais do Cliente para terceiros. O compartilhamento ocorre apenas com prestadores de serviço tecnológicos essenciais para viabilizar as funcionalidades do software, tais como APIs de consulta de CNPJ/Receita Federal, infraestrutura de nuvem, intermediação bancária e autoridades fiscais/governamentais mediante ordens legais expressas.
                </p>
              </section>

              <section className="space-y-2 bg-slate-50/60 p-4 rounded-xl border border-slate-200/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#f9943b]" />
                  Direitos do Titular (LGPD)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Os colaboradores cadastrados no sistema possuem direitos de confirmação da existência de tratamento, acesso facilitado aos seus dados armazenados, correção de informações incompletas ou incorretas, portabilidade, eliminação e revogação de consentimento. Para exercer estes direitos, entre em contato através do e-mail do Encarregado de Dados.
                </p>
              </section>

              <section className="space-y-2 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#f9943b]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500">Encarregado de Dados (DPO)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Dúvidas sobre o tratamento de seus dados pessoais devem ser encaminhadas para:</p>
                  <a href="mailto:privacidade@avilogica.com.br" className="text-xs font-bold text-[#f9943b] hover:underline">
                    privacidade@avilogica.com.br
                  </a>
                </div>
              </section>

            </div>
          )}

          {/* TAB 2: Política de Cookies */}
          {activeTab === "cookies" && (
            <div className="space-y-8 text-sm leading-relaxed text-slate-600">
              
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-950 font-dm-sans">Política de Cookies</h2>
                <p className="text-xs text-slate-400 mt-1">Gerenciamento de identificadores de navegação e cache do sistema</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">1. O que são cookies?</h3>
                <p>
                  Cookies são pequenos arquivos de texto transferidos para o computador, smartphone ou tablet do Usuário no momento em que este navega ou faz login na plataforma. Eles servem para otimizar, acelerar e personalizar a experiência de navegação, guardando informações de sessão e preferências temporárias.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">2. Como os cookies são usados no Avilógica</h3>
                <p>Classificamos nossos cookies utilizados de acordo com as finalidades abaixo:</p>
                
                <div className="space-y-4 pt-2">
                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Cookies Essenciais e de Sessão (Obrigatórios)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Necessários para a autenticação dos usuários, controle de login seguro, balanceamento de carga do servidor e manutenção do estado operacional do ERP. A desativação impossibilita o uso do software.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Cookies de Segurança</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Armazenam marcadores criptográficos para prevenir ataques de força bruta, sequestro de sessão (Session Hijacking) e falsificação de requisições cross-site (CSRF).</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Cookies Analíticos (Telemetria)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Coletam dados agregados de uso de forma anônima para nos ajudar a identificar bugs visuais, lentidões de banco de dados e áreas da plataforma que necessitam de otimização de performance.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">3. Gerenciamento e Exclusão</h3>
                <p>
                  O Usuário pode configurar as preferências de cookies diretamente através do painel de controle do seu navegador web (bloqueando cookies de terceiros ou limpando o cache acumulado). No entanto, ressaltamos que a recusa integral de cookies de login impedirá a validação e o funcionamento do ERP Avilógica.
                </p>
              </section>

            </div>
          )}

          {/* TAB 3: Política Antispam */}
          {activeTab === "antispam" && (
            <div className="space-y-8 text-sm leading-relaxed text-slate-600">
              
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-950 font-dm-sans">Política Antispam</h2>
                <p className="text-xs text-slate-400 mt-1">Diretrizes de comunicação por e-mail e mensageria da plataforma</p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">1. Compromisso Antispam da Avilógica</h3>
                <p>
                  A Avilógica assume o compromisso de combater de forma irrestrita a prática de mensagens não solicitadas (SPAM). Esse compromisso reflete-se tanto na forma como enviamos nossas comunicações aos clientes quanto no controle das ferramentas de faturamento de relatórios integradas no ERP.
                </p>
                <p>
                  Os e-mails transacionais enviados pelo ERP (tais como envios automáticos de relatórios de lote, faturas financeiras e alertas de validade) só podem ser encaminhados a destinatários que possuam consentimento explícito e prévio da empresa usuária da plataforma.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 font-dm-sans">2. Erros de Entrega (Limites de Bounces)</h3>
                <p>
                  Para garantir a reputação dos servidores de disparo do Avilógica, monitoramos continuamente o percentual de e-mails transacionais não entregues (chamados de <em>bounced emails</em> por endereços inválidos ou inexistentes).
                </p>
                <p>
                  Fica estabelecido o limite máximo de <strong>10% (dez por cento) de bounces</strong> sobre os envios realizados pela empresa no ciclo mensal de faturamento. Caso uma conta ultrapasse esse patamar, presume-se a inclusão de listas frias ou importações indevidas, acarretando a suspensão preventiva do serviço de disparo de e-mails transacionais do ERP até a higienização da base.
                </p>
              </section>

              <section className="space-y-2 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#f9943b]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500">Denúncia de Comunicações Abusivas</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Se você recebeu uma mensagem transacional indevida originada de nossos servidores, notifique-nos:</p>
                  <a href="mailto:abuse@avilogica.com.br" className="text-xs font-bold text-[#f9943b] hover:underline">
                    abuse@avilogica.com.br
                  </a>
                </div>
              </section>

            </div>
          )}

        </div>

        {/* Footer info (only shown on print) */}
        <div className="hidden print:block text-center text-xs text-slate-400 mt-12 border-t border-slate-200 pt-6">
          <p>avilogica.com.br — Políticas Gerais de Segurança e Privacidade.</p>
          <p>Bento Gonçalves, RS, Brasil.</p>
        </div>

      </div>
    </div>
  );
}
