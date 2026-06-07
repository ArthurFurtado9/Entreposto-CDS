"use server"

import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import prisma from "@/lib/prisma"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    if (!userId) return null

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true, 
        active: true,
        onboardingDismissed: true,
      },
    })

    return user
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Não autenticado.")
  }

  if (user.role !== "ADMIN") {
    throw new Error("Acesso negado. Apenas administradores podem acessar esta funcionalidade.")
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Não autenticado.")
  }

  if (!user.active) {
    throw new Error("Usuário inativo. Entre em contato com o administrador.")
  }

  return user
}

export async function requireRole(allowedRoles: ("ADMIN" | "OPERADOR" | "FINANCEIRO")[]) {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Acesso negado. Você não possui privilégios suficientes para acessar esta funcionalidade.")
  }

  return user
}
