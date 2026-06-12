"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { register } from "@/actions/auth";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await register(formData);

    if (result.success) {
      toast.success("Conta criada com sucesso! Faça login.");
      router.push("/login");
    } else {
      setError(result.error || "Erro ao criar conta.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-[#fdfbf8] px-4 py-8 md:py-12 select-none">
      
      {/* Top Logo Header */}
      <div className="w-full flex justify-center py-4">
        <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-[1.03]">
          <span className="font-dm-sans text-3xl font-semibold tracking-tight">
            <span className="text-[#404040]">Avil</span>
            <span className="text-[#f9943b]">ó</span>
            <span className="text-[#404040]">gica</span>
          </span>
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-[420px] my-auto">
        <Card className="bg-white border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-5">
            
            {/* Card Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Criar Conta</h2>
              <p className="text-xs text-slate-400 mt-1">
                Registre-se para acessar o sistema ERP.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Invite Code Input */}
              <div className="space-y-1.5">
                <Label htmlFor="inviteCode" className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#f9943b]" />
                  Código de Convite
                </Label>
                <div className="relative">
                  <Input 
                    id="inviteCode" 
                    name="inviteCode" 
                    type={showInviteCode ? "text" : "password"} 
                    placeholder="Digite o código fornecido pelo administrador" 
                    required 
                    className="h-10 pl-3 pr-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInviteCode(!showInviteCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showInviteCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Necessário para criar uma conta. Solicite ao proprietário.
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-500">
                  Nome Completo
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  placeholder="Seu nome completo" 
                  required 
                  className="h-10 px-3 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-500">
                  E-mail de Acesso
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  required 
                  className="h-10 px-3 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-500">
                  Senha
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Crie sua senha de acesso"
                    required 
                    className="h-10 pl-3 pr-10 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-10 rounded-full bg-[#f9943b] hover:bg-[#e07a2c] text-white font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Conta
                </Button>
              </div>

            </form>

          </CardContent>
        </Card>

        {/* Login Navigation */}
        <div className="text-center mt-6">
          <p className="text-xs font-medium text-slate-500">
            Já tem uma conta?{" "}
            <Link 
              href="/login" 
              className="text-[#f9943b] hover:text-[#e07a2c] font-bold underline transition-colors ml-1"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div className="w-full text-center space-y-2 py-4">
        <div className="flex justify-center gap-4 text-[10px] font-semibold text-slate-400">
          <Link href="/contato" className="hover:text-slate-600 transition-colors">Fale conosco</Link>
          <span>|</span>
          <Link href="/termos" className="hover:text-slate-600 transition-colors">Termos de uso</Link>
          <span>|</span>
          <Link href="/privacidade" className="hover:text-slate-600 transition-colors">Segurança e privacidade</Link>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          <a 
            href={process.env.NEXT_PUBLIC_SITE_URL || "#"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#f9943b] font-semibold hover:underline"
          >
            avilogica.com.br
          </a> — 2026 — Todos os direitos reservados.
        </p>
      </div>

    </div>
  );
}
