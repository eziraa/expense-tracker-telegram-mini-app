import { createClient } from "@/lib/server"
import { GoalsContent } from "@/components/goals-content"

export default async function GoalsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const goalsData = await supabase.from("goals").select("*").eq("user_id", user.id)

  return <GoalsContent goals={goalsData.data || []} userId={user.id} />
}
