import { createClient } from "@/lib/server"
import { SettingsContent } from "@/components/settings-content"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const profileData = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return <SettingsContent profile={profileData.data} userId={user.id} />
}
