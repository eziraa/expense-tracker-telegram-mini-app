"use server"

import { createClient } from "@/lib/server"

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

export async function deleteAccount(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("accounts").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
