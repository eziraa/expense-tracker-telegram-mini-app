import { createClient } from "@/lib/server"
import { AddTransactionContent } from "@/components/add-transaction-content"

export default async function AddTransactionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const [accountsData, categoriesData] = await Promise.all([
    supabase.from("accounts").select("*").eq("user_id", user.id),
    supabase.from("categories").select("*").eq("user_id", user.id),
  ])

  return (
    <AddTransactionContent accounts={accountsData.data || []} categories={categoriesData.data || []} userId={user.id} />
  )
}
