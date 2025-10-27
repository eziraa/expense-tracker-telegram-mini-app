import { createClient } from "@/lib/server"
import { AccountsContent } from "@/components/accounts-content"

export default async function AccountsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const accountsData = await supabase.from("accounts").select("*").eq("user_id", user.id)

  return <AccountsContent accounts={accountsData.data || []} userId={user.id} />
}
