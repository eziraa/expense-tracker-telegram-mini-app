"use server"

import { createClient } from "@/lib/server"

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
  const supabase = await createClient()

  const { data: transaction, error } = await supabase.from("transactions").insert([data]).select().single()

  if (error) throw new Error(error.message)
  return transaction
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("transactions").delete().eq("id", id)

  if (error) throw new Error(error.message)
}
