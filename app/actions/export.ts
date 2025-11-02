"use server"

import { createClient } from "@/lib/server"


/** *  
 * Export transactions as CSV
 * @returns CSV string of transactions
 */
export async function exportTransactionsCSV(): Promise<string> {
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
  const rows = transactions.map((t: { date: string, description: string, type: string, amount: number, category_id: string, account_id: string, tags?: string[] }) => [
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


