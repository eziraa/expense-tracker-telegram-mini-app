"use server"

import { createClient } from "@/lib/server"

/** 
 * 
 * Create a new budget
 * @param data: Budget values
 * @returns budget instance
 */
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

/** 
 * 
 * Delete a budget by ID
 * @param id: Budget ID
 */
export async function deleteBudget(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("budgets").delete().eq("id", id)

  if (error) throw new Error(error.message)
}


/** 
 * Update a budget by ID
 * @param id: Budget ID
 * @param updates: Fields to update
 */
export async function updateBudget(id: string, updates: Partial<{
  category_id: string
  limit_amount: number
  period: string
}>) {
  const supabase = await createClient()

  const { data: budget, error } = await supabase.from("budgets").update(updates).eq("id", id).select().single()

  if (error) throw new Error(error.message)
  return budget
}

/** 
 * 
 * Get budgets by user ID
 * @param userId: User ID
 * @returns Array of budget instances
 */
export async function getBudgetsByUserId(userId: string) {
  const supabase = await createClient()

  const { data: budgets, error } = await supabase.from("budgets").select().eq("user_id", userId)

  if (error) throw new Error(error.message)
  return budgets
}