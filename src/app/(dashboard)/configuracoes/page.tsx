import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-utils"
import {
  getCompanyProfile,
  getExpenseCategories,
  getIncomeCategories,
  getPaymentConditions,
  getUsers,
  getCustomPermissions,
  getAuditLogs,
} from "@/actions/configuracoes"
import { ConfiguracoesClient } from "./configuracoes-client"

export default async function ConfiguracoesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "ADMIN" && user.role !== "DONO") {
    redirect("/dashboard")
  }

  const [profileRes, categoriesRes, incomeCategoriesRes, conditionsRes, usersRes, customPermissionsRes, logsRes] =
    await Promise.all([
      getCompanyProfile(),
      getExpenseCategories(),
      getIncomeCategories(),
      getPaymentConditions(),
      getUsers(),
      getCustomPermissions(),
      getAuditLogs(),
    ])

  return (
    <ConfiguracoesClient
      currentUserId={user.id}
      currentUserRole={user.role}
      companyProfile={profileRes.success ? profileRes.data : null}
      expenseCategories={
        categoriesRes.success && categoriesRes.data
          ? JSON.parse(JSON.stringify(categoriesRes.data))
          : []
      }
      incomeCategories={
        incomeCategoriesRes.success && incomeCategoriesRes.data
          ? JSON.parse(JSON.stringify(incomeCategoriesRes.data))
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
      customPermissions={
        customPermissionsRes.success && customPermissionsRes.data
          ? JSON.parse(JSON.stringify(customPermissionsRes.data))
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
