"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "@/lib/auth-utils"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente.")
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido."),
  password: z.string().min(1, "Preencha todos os campos."),
})

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  inviteCode: z.string().min(1, "Código de convite é obrigatório."),
})

export async function login(data: FormData) {
  const emailInput = data.get("email") as string
  const passwordInput = data.get("password") as string

  const validation = loginSchema.safeParse({ email: emailInput, password: passwordInput })
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { email, password } = validation.data
  let shouldRedirect = false

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: "Credenciais inválidas." }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return { success: false, error: "Credenciais inválidas." }
    }

    if (!user.active) {
      return { success: false, error: "Conta inativa. Entre em contato com o administrador." }
    }

    // Criar JWT
    const token = await new SignJWT({ userId: user.id, name: user.name, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    // Cookie com sameSite "lax" para proteção CSRF
    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24h
      path: "/",
    })

    shouldRedirect = true
  } catch (error) {
    console.error("Erro no login:", error)
    return { success: false, error: "Ocorreu um erro interno no servidor." }
  }

  // redirect() PRECISA ficar FORA do try/catch porque lança um erro NEXT_REDIRECT
  // que seria capturado pelo catch, impedindo o redirecionamento
  if (shouldRedirect) {
    redirect("/dashboard")
  }
}

export async function register(data: FormData) {
  const nameInput = data.get("name") as string
  const emailInput = data.get("email") as string
  const passwordInput = data.get("password") as string
  const inviteCodeInput = data.get("inviteCode") as string

  const validation = registerSchema.safeParse({
    name: nameInput,
    email: emailInput,
    password: passwordInput,
    inviteCode: inviteCodeInput,
  })

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message }
  }

  const { name, email, password, inviteCode } = validation.data

  // Validar código de convite contra a variável de ambiente
  if (inviteCode !== process.env.INVITE_CODE) {
    return { success: false, error: "Código de convite inválido." }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: "E-mail já cadastrado." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Erro no registro:", error)
    return { success: false, error: "Ocorreu um erro interno no servidor." }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
  redirect("/login")
}

export async function dismissOnboarding() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Não autenticado." }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingDismissed: true },
    })

    return { success: true }
  } catch (error: any) {
    console.error("Erro ao dispensar guia de integração:", error)
    return { success: false, error: error.message || "Erro interno." }
  }
}
