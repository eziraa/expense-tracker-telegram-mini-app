"use server"

import { createClient } from "@/lib/server"

export async function exportTransactionsCSV() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (error) throw new Error(error.message)

  // Convert to CSV
  const headers = ["Date", "Description", "Type", "Amount", "Category", "Account", "Tags"]
  const rows = transactions.map((t: any) => [
    t.date,
    t.description,
    t.type,
    t.amount,
    t.category_id || "Uncategorized",
    t.account_id,
    t.tags?.join(";") || "",
  ])

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csv
}
