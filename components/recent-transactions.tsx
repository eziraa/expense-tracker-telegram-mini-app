"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction, Category } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: Category[]
}

export function RecentTransactions({ transactions, categories }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            recent.map((transaction) => {
              const category = categories.find((c) => c.id === transaction.category)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category?.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      transaction.type === "expense" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                </div>
              )
            })
          )}
        </div>
        {transactions.length > 5 && (
          <Link href="/transactions" className="mt-4 inline-block text-sm text-primary hover:underline">
            View all transactions →
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
