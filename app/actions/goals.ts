"use server"

import { createClient } from "@/lib/server"

export async function createGoal(data: {
  user_id: string
  name: string
  target_amount: number
  deadline: string
  category: string
}) {
  const supabase = await createClient()

  const { data: goal, error } = await supabase.from("goals").insert([data]).select().single()

  if (error) throw new Error(error.message)
  return goal
}

export async function deleteGoal(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("goals").delete().eq("id", id)

  if (error) throw new Error(error.message)
}

export async function updateGoal(id: string, data: { current_amount?: number }) {
  const supabase = await createClient()

  const { error } = await supabase.from("goals").update(data).eq("id", id)

  if (error) throw new Error(error.message)
}
