"use server"

import { apiClient } from "@/lib/api-client"
import { cookies } from "next/headers"

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
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)

  const { user_id, ...budgetData } = data
  return apiClient.post("/api/budgets/", budgetData)
}

/** 
 * 
 * Delete a budget by ID
 * @param id: Budget ID
 */
export async function deleteBudget(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  await apiClient.delete(`/api/budgets/${id}`)
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
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  return apiClient.patch(`/api/budgets/${id}`, updates)
}

/** 
 * 
 * Get budgets by user ID
 * @param userId: User ID
 * @returns Array of budget instances
 */
export async function getBudgetsByUserId(userId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  return apiClient.get("/api/budgets/")
}