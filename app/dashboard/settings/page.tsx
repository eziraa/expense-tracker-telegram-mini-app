import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { SettingsContent } from "@/components/settings-content"
import { redirect } from "next/navigation"
import { getLoggedInUser } from "@/app/actions/auth"

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  apiClient.setToken(token)

  try {
    const user = await getLoggedInUser()
    const profile = await apiClient.get("/api/profile/")

    return <SettingsContent profile={profile as any} userId={user.id} />
  } catch (error: any) {
    // If it's an authentication error, clear token and redirect
    if (error?.message?.includes("401") || error?.message?.includes("Unauthorized") || error?.message?.includes("Not authenticated")) {
      cookieStore.delete("auth_token")
      redirect("/auth/login")
    }
    // For other errors, show empty state
    return <SettingsContent profile={null} userId="" />
  }
}
