"use server"

import { createClient } from "@/lib/server"

export async function createBudget(data: {
  user_id: string
  category_id: string
  limit_amount: number
  period: string
}) {
  const supabase = await createClient()

  const { data: budget, error } = await supabase.from("budgets").insert([data]).select().single()

  if (error) throw new Error(error.message)
  return budget
}

export async function deleteBudget(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("budgets").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
