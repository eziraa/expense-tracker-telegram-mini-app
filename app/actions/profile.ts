"use server"

import { createClient } from "@/lib/server"

export async function updateProfile(data: {
  id: string
  display_name: string
  currency: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: data.display_name, currency: data.currency })
    .eq("id", data.id)

  if (error) throw new Error(error.message)
}
