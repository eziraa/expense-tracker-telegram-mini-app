"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"

interface QuickStatsProps {
  transactions: Transaction[]
}

export function QuickStats({ transactions }: QuickStatsProps) {
  const thisMonth = new Date()
  thisMonth.setDate(1)

  const monthTransactions = transactions.filter((t) => new Date(t.date) >= thisMonth)

  const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-lg font-bold text-green-600">+{formatCurrency(income, "USD")}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-lg font-bold text-red-600">-{formatCurrency(expenses, "USD")}</p>
            </div>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
