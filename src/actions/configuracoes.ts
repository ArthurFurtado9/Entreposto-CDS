"use server"

import prisma from "@/lib/prisma"
import { requireAdmin, getCurrentUser } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

// ==================== AUDIT LOG HELPER ====================

async function createAuditLog(userId: string, acao: string, recurso: string) {
  await prisma.auditLog.create({
    data: { userId, acao, recurso },
  })
}

// ==================== COMPANY PROFILE ====================

const companyProfileSchema = z.object({
  razaoSocial: z.string().min(2, "Razão Social é obrigatória"),
  cnpj: z
    .string()
    .min(14, "CNPJ inválido")
    .regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, "Formato de CNPJ inválido"),
  inscricaoEstadual: z.string().optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
})

export async function getCompanyProfile() {
  try {
    await requireAdmin()
    const profile = await prisma.companyProfile.findFirst()
    return { success: true, data: profile }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar perfil." }
  }
}

export async function saveCompanyProfile(data: {
  razaoSocial: string
  cnpj: string
  inscricaoEstadual?: string
  endereco?: string
  telefone?: string
  email?: string
  logoUrl?: string
}) {
  try {
    const admin = await requireAdmin()

    const validated = companyProfileSchema.safeParse(data)
    if (!validated.success) {
      return {
        success: false,
        error: "Dados inválidos",
        fieldErrors: validated.error.flatten().fieldErrors,
      }
    }

    const existing = await prisma.companyProfile.findFirst()

    if (existing) {
      await prisma.companyProfile.update({
        where: { id: existing.id },
        data: validated.data,
      })
    } else {
      await prisma.companyProfile.create({
        data: validated.data,
      })
    }

    await createAuditLog(admin.id, "Salvou perfil da empresa", "CompanyProfile")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao salvar perfil." }
  }
}

// ==================== EXPENSE CATEGORIES ====================

export async function getExpenseCategories() {
  try {
    await requireAdmin()
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: categories }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar categorias." }
  }
}

export async function createExpenseCategory(nome: string, valorMensal?: number, descricao?: string) {
  try {
    const admin = await requireAdmin()

    if (!nome || nome.trim().length < 2) {
      return { success: false, error: "Nome da categoria deve ter pelo menos 2 caracteres." }
    }

    await prisma.expenseCategory.create({
      data: { 
        nome: nome.trim(),
        valorMensal: valorMensal || null,
        descricao: descricao || null,
      },
    })

    await createAuditLog(admin.id, `Criou categoria de despesa: ${nome}`, "ExpenseCategory")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Já existe uma categoria com esse nome." }
    }
    return { success: false, error: error.message || "Erro ao criar categoria." }
  }
}

export async function updateExpenseCategory(id: string, nome: string, valorMensal?: number, descricao?: string) {
  try {
    const admin = await requireAdmin()

    if (!nome || nome.trim().length < 2) {
      return { success: false, error: "Nome da categoria deve ter pelo menos 2 caracteres." }
    }

    await prisma.expenseCategory.update({
      where: { id },
      data: {
        nome: nome.trim(),
        valorMensal: valorMensal || null,
        descricao: descricao || null,
      }
    })

    await createAuditLog(admin.id, `Editou categoria de despesa: ${nome}`, "ExpenseCategory")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao editar categoria." }
  }
}

export async function toggleExpenseCategory(id: string) {
  try {
    const admin = await requireAdmin()
    const category = await prisma.expenseCategory.findUnique({ where: { id } })
    if (!category) return { success: false, error: "Categoria não encontrada." }

    await prisma.expenseCategory.update({
      where: { id },
      data: { ativo: !category.ativo },
    })

    await createAuditLog(
      admin.id,
      `${category.ativo ? "Desativou" : "Ativou"} categoria: ${category.nome}`,
      "ExpenseCategory"
    )
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar categoria." }
  }
}

export async function deleteExpenseCategory(id: string) {
  try {
    const admin = await requireAdmin()
    const category = await prisma.expenseCategory.findUnique({ where: { id } })
    if (!category) return { success: false, error: "Categoria não encontrada." }

    await prisma.expenseCategory.delete({ where: { id } })

    await createAuditLog(admin.id, `Excluiu categoria: ${category.nome}`, "ExpenseCategory")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir categoria." }
  }
}

// ==================== INCOME CATEGORIES ====================

export async function getIncomeCategories() {
  try {
    await requireAdmin()
    const categories = await prisma.incomeCategory.findMany({
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: categories }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar categorias de entrada." }
  }
}

export async function createIncomeCategory(nome: string, valorMensal?: number, descricao?: string) {
  try {
    const admin = await requireAdmin()

    if (!nome || nome.trim().length < 2) {
      return { success: false, error: "Nome da categoria deve ter pelo menos 2 caracteres." }
    }

    await prisma.incomeCategory.create({
      data: { 
        nome: nome.trim(),
        valorMensal: valorMensal || null,
        descricao: descricao || null,
      },
    })

    await createAuditLog(admin.id, `Criou categoria de entrada: ${nome}`, "IncomeCategory")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Já existe uma categoria de entrada com esse nome." }
    }
    return { success: false, error: error.message || "Erro ao criar categoria de entrada." }
  }
}

export async function updateIncomeCategory(id: string, nome: string, valorMensal?: number, descricao?: string) {
  try {
    const admin = await requireAdmin()

    if (!nome || nome.trim().length < 2) {
      return { success: false, error: "Nome da categoria deve ter pelo menos 2 caracteres." }
    }

    await prisma.incomeCategory.update({
      where: { id },
      data: {
        nome: nome.trim(),
        valorMensal: valorMensal || null,
        descricao: descricao || null,
      }
    })

    await createAuditLog(admin.id, `Editou categoria de entrada: ${nome}`, "IncomeCategory")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao editar categoria de entrada." }
  }
}

export async function toggleIncomeCategory(id: string) {
  try {
    const admin = await requireAdmin()
    const category = await prisma.incomeCategory.findUnique({ where: { id } })
    if (!category) return { success: false, error: "Categoria de entrada não encontrada." }

    await prisma.incomeCategory.update({
      where: { id },
      data: { ativo: !category.ativo },
    })

    await createAuditLog(
      admin.id,
      `${category.ativo ? "Desativou" : "Ativou"} categoria de entrada: ${category.nome}`,
      "IncomeCategory"
    )
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar categoria de entrada." }
  }
}

export async function deleteIncomeCategory(id: string) {
  try {
    const admin = await requireAdmin()
    const category = await prisma.incomeCategory.findUnique({ where: { id } })
    if (!category) return { success: false, error: "Categoria de entrada não encontrada." }

    await prisma.incomeCategory.delete({ where: { id } })

    await createAuditLog(admin.id, `Excluiu categoria de entrada: ${category.nome}`, "IncomeCategory")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir categoria de entrada." }
  }
}

// ==================== PAYMENT CONDITIONS ====================

export async function getPaymentConditions() {
  try {
    await requireAdmin()
    const conditions = await prisma.paymentCondition.findMany({
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: conditions }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar condições." }
  }
}

export async function createPaymentCondition(nome: string, dias: number) {
  try {
    const admin = await requireAdmin()

    if (!nome || nome.trim().length < 2) {
      return { success: false, error: "Nome deve ter pelo menos 2 caracteres." }
    }
    if (dias < 0) {
      return { success: false, error: "Número de dias deve ser positivo." }
    }

    await prisma.paymentCondition.create({
      data: { nome: nome.trim(), dias },
    })

    await createAuditLog(admin.id, `Criou condição de pagamento: ${nome} (${dias} dias)`, "PaymentCondition")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Já existe uma condição com esse nome." }
    }
    return { success: false, error: error.message || "Erro ao criar condição." }
  }
}

export async function updatePaymentCondition(id: string, nome: string, dias: number) {
  try {
    const admin = await requireAdmin()

    if (!nome || nome.trim().length < 2) {
      return { success: false, error: "Nome deve ter pelo menos 2 caracteres." }
    }
    if (dias < 0) {
      return { success: false, error: "Número de dias deve ser positivo." }
    }

    await prisma.paymentCondition.update({
      where: { id },
      data: { nome: nome.trim(), dias }
    })

    await createAuditLog(admin.id, `Editou condição de pagamento: ${nome} (${dias} dias)`, "PaymentCondition")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao editar condição." }
  }
}

export async function deletePaymentCondition(id: string) {
  try {
    const admin = await requireAdmin()
    const condition = await prisma.paymentCondition.findUnique({ where: { id } })
    if (!condition) return { success: false, error: "Condição não encontrada." }

    await prisma.paymentCondition.delete({ where: { id } })

    await createAuditLog(admin.id, `Excluiu condição: ${condition.nome}`, "PaymentCondition")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir condição." }
  }
}

// ==================== USERS ====================

export async function getUsers() {
  try {
    await requireAdmin()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cpf: true,
        customPermissionId: true,
        customPermission: {
          select: {
            id: true,
            nome: true,
            recursos: true,
          }
        },
        active: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    })
    return { success: true, data: users }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar usuários." }
  }
}

export async function criarUsuario(data: {
  name: string
  email: string
  cpf?: string | null
  password?: string
  role: "DONO" | "ADMIN" | "OPERADOR" | "FINANCEIRO"
  customPermissionId?: string | null
}) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "DONO") {
      return { success: false, error: "Acesso negado. Apenas o dono do sistema pode cadastrar novos funcionários." }
    }

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return { success: false, error: "Já existe um usuário cadastrado com este e-mail." }
    }

    if (data.cpf) {
      const existingCpf = await prisma.user.findFirst({ where: { cpf: data.cpf } })
      if (existingCpf) {
        return { success: false, error: "Já existe um usuário cadastrado com este CPF." }
      }
    }

    const defaultPassword = data.password || "123456"
    const hashedPassword = await bcrypt.hash(defaultPassword, 10)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        cpf: data.cpf || null,
        password: hashedPassword,
        role: data.role,
        customPermissionId: data.customPermissionId || null,
        active: true,
      }
    })

    await createAuditLog(
      currentUser.id,
      `Cadastrou novo funcionário: ${data.name} (${data.email})`,
      "User"
    )
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao cadastrar funcionário." }
  }
}

export async function updateUserRole(userId: string, role: string, customPermissionId?: string | null) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "DONO") {
      return { success: false, error: "Acesso negado. Apenas o dono do sistema pode alterar as permissões de acesso." }
    }

    if (currentUser.id === userId) {
      return { success: false, error: "Você não pode alterar seu próprio role." }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, error: "Usuário não encontrado." }

    const isCustom = customPermissionId && customPermissionId !== "null"
    const finalRole = isCustom ? "OPERADOR" : (role as any)

    await prisma.user.update({
      where: { id: userId },
      data: { 
        role: finalRole,
        customPermissionId: isCustom ? customPermissionId : null,
      },
    })

    await createAuditLog(
      currentUser.id,
      `Alterou permissões de ${user.name} para ${isCustom ? "Personalizado" : role}`,
      "User"
    )
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar permissões." }
  }
}

export async function toggleUserActive(userId: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "DONO") {
      return { success: false, error: "Acesso negado. Apenas o dono do sistema pode ativar/desativar funcionários." }
    }

    if (currentUser.id === userId) {
      return { success: false, error: "Você não pode desativar sua própria conta." }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, error: "Usuário não encontrado." }

    await prisma.user.update({
      where: { id: userId },
      data: { active: !user.active },
    })

    await createAuditLog(
      currentUser.id,
      `${user.active ? "Desativou" : "Ativou"} conta de ${user.name}`,
      "User"
    )
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar status." }
  }
}

export async function excluirUser(userId: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "DONO") {
      return { success: false, error: "Acesso negado. Apenas o dono do sistema pode excluir funcionários." }
    }

    if (currentUser.id === userId) {
      return { success: false, error: "Você não pode excluir sua própria conta." }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return { success: false, error: "Usuário não encontrado." }

    await prisma.user.delete({ where: { id: userId } })

    await createAuditLog(
      currentUser.id,
      `Excluiu usuário permanentemente: ${user.name} (${user.email})`,
      "User"
    )
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir usuário." }
  }
}

// ==================== CUSTOM PERMISSIONS ====================

export async function getCustomPermissions() {
  try {
    await requireAdmin()
    const perms = await prisma.customPermission.findMany({
      orderBy: { nome: "asc" }
    })
    return { success: true, data: perms }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar permissões customizadas." }
  }
}

export async function createCustomPermission(nome: string, recursos: string[]) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "DONO") {
      return { success: false, error: "Acesso negado. Apenas o dono pode criar novas permissões." }
    }

    if (!nome || nome.trim().length < 2) {
      return { success: false, error: "Nome da permissão deve ter pelo menos 2 caracteres." }
    }

    const perm = await prisma.customPermission.create({
      data: {
        nome: nome.trim(),
        recursos: JSON.stringify(recursos),
      }
    })

    await createAuditLog(currentUser.id, `Criou permissão customizada: ${nome}`, "CustomPermission")
    revalidatePath("/configuracoes")
    return { success: true, data: perm }
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Já existe uma permissão com esse nome." }
    }
    return { success: false, error: error.message || "Erro ao criar permissão." }
  }
}

export async function deleteCustomPermission(id: string) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "DONO") {
      return { success: false, error: "Acesso negado. Apenas o dono pode excluir permissões." }
    }

    const perm = await prisma.customPermission.delete({
      where: { id }
    })

    await createAuditLog(currentUser.id, `Excluiu permissão customizada: ${perm.nome}`, "CustomPermission")
    revalidatePath("/configuracoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir permissão." }
  }
}

// ==================== AUDIT LOGS ====================

export async function getAuditLogs() {
  try {
    await requireAdmin()
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    return { success: true, data: logs }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao buscar logs." }
  }
}

// ==================== EXPORT CSV ====================

export async function exportMonthlyCsv() {
  try {
    await requireAdmin()

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const financeiros = await prisma.financeiro.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        loteEntrada: {
          include: { fornecedor: true },
        },
        pedido: {
          include: { cliente: true },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    const lotes = await prisma.loteEntrada.findMany({
      where: {
        dataRecebimento: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: { fornecedor: true },
      orderBy: { dataRecebimento: "asc" },
    })

    const lines: string[] = []
    lines.push("RELATÓRIO MENSAL DE MOVIMENTAÇÕES")
    lines.push(`Período: ${startOfMonth.toLocaleDateString("pt-BR")} a ${endOfMonth.toLocaleDateString("pt-BR")}`)
    lines.push("")
    lines.push("=== MOVIMENTAÇÕES FINANCEIRAS ===")
    lines.push("Tipo;Valor;Status;Vencimento;Referência")

    for (const f of financeiros) {
      const ref = f.tipo === "PAGAR"
        ? f.loteEntrada?.fornecedor?.nome || "N/A"
        : f.pedido?.cliente?.nome || "N/A"
      lines.push(
        `${f.tipo};R$ ${Number(f.valor).toFixed(2)};${f.status};${new Date(f.dataVencimento).toLocaleDateString("pt-BR")};${ref}`
      )
    }

    lines.push("")
    lines.push("=== LOTES RECEBIDOS ===")
    lines.push("Fornecedor;Qtd Original;Aproveitada;Rendimento;Data Recebimento")

    for (const l of lotes) {
      lines.push(
        `${l.fornecedor.nome};${l.quantidadeOriginal};${l.quantidadeAproveitada};${l.rendimentoPorcentagem.toFixed(1)}%;${new Date(l.dataRecebimento).toLocaleDateString("pt-BR")}`
      )
    }

    const csvContent = lines.join("\n")

    return { success: true, data: csvContent }
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao gerar relatório." }
  }
}
