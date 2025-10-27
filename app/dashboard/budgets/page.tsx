import { createClient } from "@/lib/server"
import { BudgetsContent } from "@/components/budgets-content"

export default async function BudgetsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const [budgetsData, categoriesData, transactionsData] = await Promise.all([
    supabase.from("budgets").select("*").eq("user_id", user.id),
    supabase.from("categories").select("*").eq("user_id", user.id),
    supabase.from("transactions").select("*").eq("user_id", user.id),
  ])

  return (
    <BudgetsContent
      budgets={budgetsData.data || []}
      categories={categoriesData.data || []}
      transactions={transactionsData.data || []}
      userId={user.id}
    />
  )
}
