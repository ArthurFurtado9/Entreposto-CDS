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

    let user = await prisma.user.findUnique({
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

    // Auto-promoção para DONO caso seja o e-mail do Arthur
    if (user && user.email === "arthurbr002006@gmail.com" && user.role !== "DONO") {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: "DONO" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true, 
          active: true,
          onboardingDismissed: true,
        },
      })
    }

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

  if (user.role !== "ADMIN" && user.role !== "DONO") {
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

export async function requireRole(allowedRoles: ("DONO" | "ADMIN" | "OPERADOR" | "FINANCEIRO")[]) {
  const user = await requireAuth()

  if (user.role === "DONO") {
    return user
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Acesso negado. Você não possui privilégios suficientes para acessar esta funcionalidade.")
  }

  return user
}
