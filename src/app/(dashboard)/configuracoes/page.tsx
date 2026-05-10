import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-utils"
import {
  getCompanyProfile,
  getExpenseCategories,
  getPaymentConditions,
  getUsers,
  getAuditLogs,
} from "@/actions/configuracoes"
import { ConfiguracoesClient } from "./configuracoes-client"

export default async function ConfiguracoesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const [profileRes, categoriesRes, conditionsRes, usersRes, logsRes] =
    await Promise.all([
      getCompanyProfile(),
      getExpenseCategories(),
      getPaymentConditions(),
      getUsers(),
      getAuditLogs(),
    ])

  return (
    <ConfiguracoesClient
      currentUserId={user.id}
      companyProfile={profileRes.success ? profileRes.data : null}
      expenseCategories={
        categoriesRes.success && categoriesRes.data
          ? JSON.parse(JSON.stringify(categoriesRes.data))
          : []
      }
      paymentConditions={
        conditionsRes.success && conditionsRes.data
          ? JSON.parse(JSON.stringify(conditionsRes.data))
          : []
      }
      users={
        usersRes.success && usersRes.data
          ? JSON.parse(JSON.stringify(usersRes.data))
          : []
      }
      auditLogs={
        logsRes.success && logsRes.data
          ? JSON.parse(JSON.stringify(logsRes.data))
          : []
      }
    />
  )
}
