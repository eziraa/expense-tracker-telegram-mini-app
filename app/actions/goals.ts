"use server"

import { apiClient } from "@/lib/api-client"
import { cookies } from "next/headers"

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
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)

  const { user_id, ...goalData } = data
  return apiClient.post("/api/goals/", goalData)
}

/** 
 * 
 * Delete a goal by ID
 * @param id: Goal ID
 */

export async function deleteGoal(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  await apiClient.delete(`/api/goals/${id}`)
}

/**
 * 
 * Update a goal by ID
 * @param id: Goal ID
 * @param data: Fields to update
 */
export async function updateGoal(id: string, data: {
  current_amount?: number
  target_amount?: number
  deadline?: string
  name?: string
  category?: string
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  return apiClient.patch(`/api/goals/${id}`, data)
}

/**
 * 
 * Get goals by user ID
 * @param userId: User ID
 * @returns Array of goal instances
 */
export async function getGoalsByUserId(userId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  return apiClient.get("/api/goals/")
}
