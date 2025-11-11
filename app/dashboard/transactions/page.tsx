import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { TransactionsContent } from "@/components/transactions-content"
import { redirect } from "next/navigation"

export default async function TransactionsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  apiClient.setToken(token)

  try {
    const [transactions, categories, accounts] = await Promise.all([
      apiClient.get("/api/transactions/"),
      apiClient.get("/api/categories/"),
      apiClient.get("/api/accounts/"),
    ])

    // Sort transactions by date descending
    const sortedTransactions = (transactions as any[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return (
      <TransactionsContent
        transactions={sortedTransactions}
        categories={categories as any[]}
        accounts={accounts as any[]}
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
      <TransactionsContent
        transactions={[]}
        categories={[]}
        accounts={[]}
      />
    )
  }
}
