import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { AddTransactionContent } from "@/components/add-transaction-content"
import { redirect } from "next/navigation"
import { getLoggedInUser } from "@/app/actions/auth"

export default async function AddTransactionPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  apiClient.setToken(token)

  try {
    const user = await getLoggedInUser()
    const [accounts, categories] = await Promise.all([
      apiClient.get("/api/accounts/"),
      apiClient.get("/api/categories/"),
    ])

    return (
      <AddTransactionContent 
        accounts={accounts as any[]} 
        categories={categories as any[]} 
        userId={user.id} 
      />
    )
  } catch (error: any) {
    // If it's an authentication error, clear token and redirect
    if (error?.message?.includes("401") || error?.message?.includes("Unauthorized") || error?.message?.includes("Not authenticated")) {
      cookieStore.delete("auth_token")
      redirect("/auth/login")
    }
    // For other errors, redirect to transactions page
    redirect("/dashboard/transactions")
  }
}
