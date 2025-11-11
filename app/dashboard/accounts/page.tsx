import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { AccountsContent } from "@/components/accounts-content"
import { redirect } from "next/navigation"
import { getLoggedInUser } from "@/app/actions/auth"

export default async function AccountsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  apiClient.setToken(token)

  try {
    const user = await getLoggedInUser()
    const accounts = await apiClient.get("/api/accounts/")

    return <AccountsContent accounts={accounts as any[]} userId={user.id} />
  } catch (error: any) {
    // If it's an authentication error, clear token and redirect
    if (error?.message?.includes("401") || error?.message?.includes("Unauthorized") || error?.message?.includes("Not authenticated")) {
      cookieStore.delete("auth_token")
      redirect("/auth/login")
    }
    // For other errors, show empty state
    return <AccountsContent accounts={[]} userId="" />
  }
}
