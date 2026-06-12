"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { requireAdmin, requireRole, requireAuth } from "@/lib/auth-utils"
import { z } from "zod"

const funcionarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  cpf: z.string().min(11, "CPF deve ter pelo menos 11 dígitos."),
  rg: z.string().optional().nullable().or(z.literal("")),
  dataNascimento: z.preprocess((val) => {
    if (!val || val === "") return null;
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? null : d;
  }, z.date().nullable().optional()),
  fotoUrl: z.string().optional().nullable().or(z.literal("")),
  cargo: z.string().optional().nullable().or(z.literal("")),
  dataAdmissao: z.preprocess((val) => {
    if (!val || val === "") return null;
    const d = new Date(val as string);
    return isNaN(d.getTime()) ? null : d;
  }, z.date().nullable().optional()),
  ctps: z.string().optional().nullable().or(z.literal("")),
  salario: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return null;
    const num = parseFloat(val as string);
    return isNaN(num) ? null : num;
  }, z.number().nullable().optional()),
  telefone: z.string().optional().nullable().or(z.literal("")),
  celular: z.string().optional().nullable().or(z.literal("")),
  email: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().email("Formato de e-mail inválido.").nullable().optional().or(z.literal(""))
  ).optional().nullable(),
  cep: z.string().optional().nullable().or(z.literal("")),
  uf: z.string().optional().nullable().or(z.literal("")),
  cidade: z.string().optional().nullable().or(z.literal("")),
  bairro: z.string().optional().nullable().or(z.literal("")),
  endereco: z.string().optional().nullable().or(z.literal("")),
  numero: z.string().optional().nullable().or(z.literal("")),
  complemento: z.string().optional().nullable().or(z.literal("")),
})

export async function getFuncionarios() {
  try {
    await requireAuth()
    const funcionarios = await prisma.funcionario.findMany({
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: funcionarios }
  } catch (error: any) {
    if (error.message !== "Não autenticado." && !error.message?.includes("Acesso negado")) {
      console.error("Erro ao buscar funcionários:", error)
    }
    return { success: false, error: error.message || "Falha ao buscar funcionários." }
  }
}

export async function criarFuncionario(rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = funcionarioSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { cpf } = validated.data
    // Verifica se CPF já está cadastrado
    const existing = await prisma.funcionario.findUnique({
      where: { cpf },
    })
    if (existing) {
      return { success: false, error: "CPF já cadastrado para outro funcionário." }
    }

    const funcionario = await prisma.funcionario.create({
      data: {
        ...validated.data,
        cpf,
      },
    })

    revalidatePath("/funcionarios")
    return { success: true, data: funcionario }
  } catch (error: any) {
    console.error("Erro ao criar funcionário:", error)
    return { success: false, error: error.message || "Falha ao criar funcionário." }
  }
}

export async function editarFuncionario(id: string, rawData: unknown) {
  try {
    await requireRole(["ADMIN", "OPERADOR"])

    const validated = funcionarioSchema.safeParse(rawData)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message }
    }

    const { cpf } = validated.data
    // Verifica se CPF pertence a outro funcionário
    const existing = await prisma.funcionario.findFirst({
      where: {
        cpf,
        NOT: { id },
      },
    })
    if (existing) {
      return { success: false, error: "CPF já cadastrado para outro funcionário." }
    }

    const funcionario = await prisma.funcionario.update({
      where: { id },
      data: validated.data,
    })

    revalidatePath("/funcionarios")
    return { success: true, data: funcionario }
  } catch (error: any) {
    console.error("Erro ao editar funcionário:", error)
    return { success: false, error: error.message || "Falha ao editar funcionário." }
  }
}

export async function excluirFuncionario(id: string) {
  try {
    await requireAdmin()

    await prisma.funcionario.delete({
      where: { id },
    })

    revalidatePath("/funcionarios")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao excluir funcionário:", error)
    return { success: false, error: error.message || "Falha ao excluir funcionário." }
  }
}
