"use server"

import { apiClient } from "@/lib/api-client"
import { cookies } from "next/headers"

/** 
 *  
 * Create a new transaction
 * @param data: Transaction values
 * @returns transaction instance
 */
export async function createTransaction(data: {
  user_id: string
  account_id: string
  category_id: string
  type: string
  amount: number
  description: string
  date: string
  receipt_url?: string
  tags?: string[]
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)

  const { user_id, ...transactionData } = data
  return apiClient.post("/api/transactions/", transactionData)
}

/**
 * 
 * Delete an existing transaction
 * @param id: Transaction ID
 */
export async function deleteTransaction(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  await apiClient.delete(`/api/transactions/${id}`)
}

/**
 * 
 * Update an existing transaction
 * @param id: Transaction ID
 * @param data: Transaction values
 * @returns updated transaction instance
 */
export async function updateTransaction(id: string, data: {
  id: string
  user_id: string
  account_id: string
  category_id: string
  type: string
  amount: number
  description: string
  date: string
  receipt_url?: string
  tags?: string[]
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)

  const { id: _, user_id, ...updateData } = data
  return apiClient.patch(`/api/transactions/${id}`, updateData)
}
