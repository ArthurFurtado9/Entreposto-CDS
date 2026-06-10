"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { login } from "@/actions/auth";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result && !result.success) {
      setError(result.error || "Erro ao realizar login.");
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

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] my-auto">
        <Card className="bg-white border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-6">
            
            {/* Card Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Acesse sua conta</h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-500">
                  E-mail ou usuário
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Insira seu e-mail de acesso" 
                  required 
                  className="h-10 px-3 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#f9943b] focus-visible:border-[#f9943b] rounded-lg transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-semibold text-slate-500">
                    Senha
                  </Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Insira sua senha"
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

              {/* Forgot Password Link */}
              <div className="flex justify-start">
                <Link 
                  href="#" 
                  className="text-xs font-semibold text-[#f9943b] hover:text-[#e07a2c] transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-10 rounded-full bg-[#f9943b] hover:bg-[#e07a2c] text-white font-semibold shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Entrar
                </Button>
              </div>

            </form>

            {/* Social Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Ou acesse via
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* OAuth Actions */}
            <div className="space-y-2.5">
              
              {/* Google OAuth Button */}
              <button 
                type="button" 
                className="w-full h-10 flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              {/* Facebook OAuth Button */}
              <button 
                type="button" 
                className="w-full h-10 flex items-center justify-center rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300"
              >
                <svg className="w-4 h-4 mr-2 text-[#1877F2] fill-[#1877F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>

            </div>

          </CardContent>
        </Card>

        {/* Register Navigation */}
        <div className="text-center mt-6">
          <p className="text-xs font-medium text-slate-500">
            Ainda não tem cadastro?{" "}
            <Link 
              href="/register" 
              className="text-[#f9943b] hover:text-[#e07a2c] font-bold underline transition-colors ml-1"
            >
              Inscreva-se agora
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div className="w-full text-center space-y-2 py-4">
        <div className="flex justify-center gap-4 text-[10px] font-semibold text-slate-400">
          <Link href="#" className="hover:text-slate-600 transition-colors">Fale conosco</Link>
          <span>|</span>
          <Link href="#" className="hover:text-slate-600 transition-colors">Termos de uso</Link>
          <span>|</span>
          <Link href="#" className="hover:text-slate-600 transition-colors">Segurança e privacidade</Link>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          <span className="text-[#f9943b] font-semibold">avilogica.com.br</span> — 2026 — Todos os direitos reservados.
        </p>
      </div>

    </div>
  );
}
