"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Account } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface BalanceCardProps {
  account: Account
}

export function BalanceCard({ account }: BalanceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{account.name}</CardTitle>
          <span className="text-2xl">{account.icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{formatCurrency(account.balance, account.currency)}</div>
        <p className="text-xs text-muted-foreground mt-1">{account.type}</p>
      </CardContent>
    </Card>
  )
}
