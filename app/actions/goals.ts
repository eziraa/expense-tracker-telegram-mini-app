"use server"

import { createClient } from "@/lib/server"

/**
 * 
 * Create a new goal
 * @param data: Goal values
 * @returns  goal instance
 */
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
/** 
 * 
 * Delete a goal by ID
 * @param id: Goal ID
 */

export async function deleteGoal(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("goals").delete().eq("id", id)

  if (error) throw new Error(error.message)
}

/**
 * 
 * Update a goal by ID
 * @param id: Goal ID
 * @param data: Fields to update
 */
export async function updateGoal(id: string, data: { current_amount?: number }) {
  const supabase = await createClient()

  const { error } = await supabase.from("goals").update(data).eq("id", id)

  if (error) throw new Error(error.message)
}

/**
 * 
 * Get goals by user ID
 * @param userId: User ID
 * @returns Array of goal instances
 */
export async function getGoalsByUserId(userId: string) {
  const supabase = await createClient()
  const { data: goals, error } = await supabase.from("goals").select().eq("user_id", userId)

  if (error) throw new Error(error.message)
  return goals
}
