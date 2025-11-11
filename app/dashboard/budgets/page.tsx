import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { BudgetsContent } from "@/components/budgets-content"
import { redirect } from "next/navigation"
import { getLoggedInUser } from "@/app/actions/auth"

export default async function BudgetsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  apiClient.setToken(token)

  try {
    const user = await getLoggedInUser()
    const [budgets, categories, transactions] = await Promise.all([
      apiClient.get("/api/budgets/"),
      apiClient.get("/api/categories/"),
      apiClient.get("/api/transactions/"),
    ])

    return (
      <BudgetsContent
        budgets={budgets as any[]}
        categories={categories as any[]}
        transactions={transactions as any[]}
        userId={user.id}
      />
    )
  } catch (error: any) {
    // If it's an authentication error, clear token and redirect
    if (error?.message?.includes("401") || error?.message?.includes("Unauthorized") || error?.message?.includes("Not authenticated")) {
      cookieStore.delete("auth_token")
      redirect("/auth/login")
    }
    // For other errors, show empty state
    return (
      <BudgetsContent
        budgets={[]}
        categories={[]}
        transactions={[]}
        userId=""
      />
    )
  }
}
