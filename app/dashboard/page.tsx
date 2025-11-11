import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { DashboardContent } from "@/components/dashboard-content"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    console.log("No auth token found, redirecting to login")
    redirect("/auth/login")
  }

  apiClient.setToken(token)

  try {
    const [accounts, transactions, categories] = await Promise.all([
      apiClient.get("/api/accounts/"),
      apiClient.get("/api/transactions/?limit=10"),
      apiClient.get("/api/categories/"),
    ])

    // Sort transactions by date descending
    const sortedTransactions = (transactions as any[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return (
      <DashboardContent
        accounts={accounts as any[]}
        transactions={sortedTransactions}
        categories={categories as any[]}
      />
    )
  } catch (error: any) {
    console.log("Error__________________")
    // If it's an authentication error (401), clear the token and redirect
    if (error?.message?.includes("401") || error?.message?.includes("Unauthorized") || error?.message?.includes("Not authenticated")) {
      cookieStore.delete("auth_token")
      redirect("/auth/login")
    }
    // For network errors or backend down, show empty state with error message
    // Don't redirect to prevent infinite loops
    console.error("Dashboard API error:", error.message)
    return (
      <DashboardContent
        accounts={[]}
        transactions={[]}
        categories={[]}
      />
    )
  }
}
