"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, MessageSquare, Loader2, Phone, Mail, HelpCircle, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("suporte");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message to support email (e.g. 1.5 seconds latency)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSubmitted(true);
    toast.success("Mensagem enviada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#404040] font-sans selection:bg-amber-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl space-y-6">
        
        {/* Navigation back link */}
        <div className="flex justify-start">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#f9943b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#f9943b]" />
            Voltar para o Login
          </Link>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Contact Form */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <Card className="bg-white border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden h-full flex flex-col justify-center">
              <CardContent className="p-6 md:p-8 space-y-6">
                
                {/* Header */}
                <div className="space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-[#f9943b] shadow-xs">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 font-dm-sans">
                    Enviar um Ticket
                  </h1>
                  <p className="text-xs text-slate-400">
                    Preencha os campos abaixo para abrir um ticket oficial na nossa central de atendimento.
                  </p>
                </div>

                {submitted ? (
                  // Success Pane
                  <div className="space-y-6 text-center py-8 animate-fadeIn">
                    <div className="flex justify-center text-emerald-500">
                      <CheckCircle2 className="w-16 h-16 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 font-dm-sans">Mensagem Enviada!</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Seu ticket de atendimento foi registrado com sucesso. Nossa equipe entrará em contato pelo e-mail <span className="font-semibold text-slate-800">{email}</span> em um prazo máximo de 24 horas úteis.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setName("");
                          setEmail("");
                          setSubject("suporte");
                          setMessage("");
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
                      >
                        Enviar outra mensagem
                      </button>
                    </div>
                  </div>
                ) : (
                  // Contact Form
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold text-slate-500">
                          Nome Completo
                        </Label>
                        <Input 
                          id="name" 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome completo" 
                          required 
                          className="h-10 px-3 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-500">
                          E-mail Corporativo
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="exemplo@empresa.com" 
                          required 
                          className="h-10 px-3 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all"
                        />
                      </div>
                    </div>

                    {/* Subject Dropdown */}
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-semibold text-slate-500">
                        Departamento de Destino
                      </Label>
                      <select
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-10 px-3 border border-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all bg-white text-xs font-medium text-slate-600"
                      >
                        <option value="suporte">Suporte Técnico (Erros, Dúvidas de Sistema)</option>
                        <option value="comercial">Comercial (Planos, Reajustes, Customizações)</option>
                        <option value="financeiro">Financeiro (Faturas, Pagamentos, Notas Fiscais)</option>
                        <option value="sugestao">Sugestões e Melhorias na Plataforma</option>
                      </select>
                    </div>

                    {/* Message Textarea */}
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-semibold text-slate-500">
                        Descrição da Solicitação
                      </Label>
                      <textarea
                        id="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Descreva aqui de forma detalhada o seu problema ou dúvida técnico. Inclua o nome do lote ou o CNPJ se aplicável..."
                        required
                        className="w-full p-3 border border-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg text-xs font-medium text-slate-600 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full h-10 rounded-full bg-[#f9943b] hover:bg-[#e07a2c] text-white font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando Ticket...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-3.5 w-3.5" />
                            Enviar Solicitação
                          </>
                        )}
                      </Button>
                    </div>

                  </form>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Right Side: Support Info and Direct Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Direct Support Card */}
            <Card className="bg-white border border-slate-200/50 rounded-2xl shadow-xs overflow-hidden flex-1">
              <CardContent className="p-6 md:p-8 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#f9943b]" />
                    Canais Diretos
                  </h3>
                  
                  {/* Whatsapp */}
                  <div className="flex gap-3 items-start group">
                    <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">WhatsApp Suporte</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Atendimento operacional ágil de plantão</p>
                      <a href="https://wa.me/5554999999999" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#f9943b] hover:underline block mt-0.5">
                        +55 (54) 99999-9999
                      </a>
                    </div>
                  </div>

                  {/* Sectors */}
                  <div className="flex gap-3 items-start">
                    <div className="h-9 w-9 bg-amber-50 rounded-lg flex items-center justify-center text-[#f9943b] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800">Contatos Setoriais</h4>
                      <div className="space-y-1">
                        <div className="text-xs">
                          <span className="text-slate-400 font-medium">Comercial: </span>
                          <a href="mailto:comercial@avilogica.com.br" className="font-bold text-slate-700 hover:text-[#f9943b]">comercial@avilogica.com.br</a>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400 font-medium">Financeiro: </span>
                          <a href="mailto:financeiro@avilogica.com.br" className="font-bold text-slate-700 hover:text-[#f9943b]">financeiro@avilogica.com.br</a>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400 font-medium">Dúvidas LGPD: </span>
                          <a href="mailto:privacidade@avilogica.com.br" className="font-bold text-slate-700 hover:text-[#f9943b]">privacidade@avilogica.com.br</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Knowledge Base */}
                  <div className="flex gap-3 items-start">
                    <div className="h-9 w-9 bg-amber-50 rounded-lg flex items-center justify-center text-[#f9943b] shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Central de Ajuda</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Acesse tutoriais passo a passo sobre classificação e FIFO</p>
                      <a href="https://ajuda.avilogica.com.br" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#f9943b] hover:underline block mt-0.5">
                        ajuda.avilogica.com.br
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operating hours info */}
                <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mt-6">
                  <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Horário de Funcionamento</h5>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Segunda a Sexta, das 08:00 às 18:00 (Fuso Horário de Brasília)</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-slate-400 font-medium">
          avilogica.com.br — Todos os direitos reservados.
        </p>

      </div>
    </div>
  );
}
