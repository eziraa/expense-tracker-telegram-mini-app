import { createClient } from "@/lib/server"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const [accountsData, transactionsData, categoriesData] = await Promise.all([
    supabase.from("accounts").select("*").eq("user_id", user.id),
    supabase.from("transactions").select("*").eq("user_id", user.id).order("date", { ascending: false }).limit(10),
    supabase.from("categories").select("*").eq("user_id", user.id),
  ])

  return (
    <DashboardContent
      accounts={accountsData.data || []}
      transactions={transactionsData.data || []}
      categories={categoriesData.data || []}
    />
  )
}
