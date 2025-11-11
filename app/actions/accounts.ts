"use server"

import { apiClient } from "@/lib/api-client"
import { cookies } from "next/headers"

/**
 *  
 * Create a new account
 * @param data: Account values
 * @returns account instance
 */

export async function createAccount(data: {
  user_id: string
  name: string
  type: string
  balance: number
  currency: string
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)

  const { user_id, ...accountData } = data
  return apiClient.post("/api/accounts/", accountData)
}

/** 
 *  
 * Delete an account by ID
 * @param id: Account ID
 */
export async function deleteAccount(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  await apiClient.delete(`/api/accounts/${id}`)
}

/**
 *  
 * Update an account by ID
 * @param id: Account ID
 * @param updates: Fields to update
 */
export async function updateAccount(id: string, updates: Partial<{
  name: string
  type: string
  balance: number
  currency: string
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  return apiClient.patch(`/api/accounts/${id}`, updates)
}

/**
 *  
 * Get user accounts by user ID
 * @param userId: User ID
 * @returns Array of account instances
 */
export async function getAccountsByUserId(userId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  return apiClient.get("/api/accounts/")
}
