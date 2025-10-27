import { createClient } from "@/lib/server"
import { AnalyticsContent } from "@/components/analytics-content"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const [transactionsData, categoriesData, accountsData] = await Promise.all([
    supabase.from("transactions").select("*").eq("user_id", user.id),
    supabase.from("categories").select("*").eq("user_id", user.id),
    supabase.from("accounts").select("*").eq("user_id", user.id),
  ])

  return (
    <AnalyticsContent
      transactions={transactionsData.data || []}
      categories={categoriesData.data || []}
      accounts={accountsData.data || []}
    />
  )
}
