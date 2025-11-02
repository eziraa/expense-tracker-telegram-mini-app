"use server"

import { createClient } from "@/lib/server"

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
  const supabase = await createClient()

  const { data: account, error } = await supabase.from("accounts").insert([data]).select().single()

  if (error) throw new Error(error.message)
  return account
}

/** 
 *  
 * Delete an account by ID
 * @param id: Account ID
 */
export async function deleteAccount(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("accounts").delete().eq("id", id)

  if (error) throw new Error(error.message)
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
  const supabase = await createClient()

  const { data: account, error } = await supabase.from("accounts").update(updates).eq("id", id).select().single()

  if (error) throw new Error(error.message)
  return account
}

/**
 *  
 * Get user accounts by user ID
 * @param userId: User ID
 * @returns Array of account instances
 */
export async function getAccountsByUserId(userId: string) {
  const supabase = await createClient()

  const { data: accounts, error } = await supabase.from("accounts").select().eq("user_id", userId)

  if (error) throw new Error(error.message)
  return accounts
}
