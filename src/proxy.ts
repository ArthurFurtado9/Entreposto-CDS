import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente.")
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const isPublicRoute = pathname.startsWith("/login") || pathname.startsWith("/register")

  if (isPublicRoute) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET)
        // Se já tem um token válido e está tentando acessar login/register, vai para o dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url))
      } catch {
        // Token inválido, deixa acessar a rota pública
      }
    }
    return NextResponse.next()
  }

  // Para qualquer outra rota protegida (dashboard, etc)
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    // Token inválido ou expirado — limpa o cookie corrompido
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth_token")
    return response
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
