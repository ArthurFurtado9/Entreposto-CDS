"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente.")
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function login(data: FormData) {
  const email = data.get("email") as string
  const password = data.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Preencha todos os campos." }
  }

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

    // Criar JWT
    const token = await new SignJWT({ userId: user.id, name: user.name, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    // Set cookie (wait for cookies() resolution in Next.js 15)
    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

  } catch (error) {
    console.error("Erro no login:", error)
    return { success: false, error: "Ocorreu um erro ao realizar o login." }
  }
  
  redirect("/dashboard")
}

export async function register(data: FormData) {
  const name = data.get("name") as string
  const email = data.get("email") as string
  const password = data.get("password") as string

  if (!name || !email || !password) {
    return { success: false, error: "Preencha todos os campos." }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { success: false, error: "E-mail já cadastrado." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Erro no registro:", error)
    return { success: false, error: "Ocorreu um erro ao criar a conta." }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
  redirect("/login")
}
