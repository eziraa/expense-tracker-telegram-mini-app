"use client"

import { useExpenseData } from "@/hooks/use-expense-data"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { accounts, addAccount, deleteAccount } = useExpenseData()
  const [newAccountName, setNewAccountName] = useState("")
  const [newAccountType, setNewAccountType] = useState<"checking" | "savings">("checking")

  const handleAddAccount = () => {
    if (!newAccountName) return

    const newAccount = {
      id: Date.now().toString(),
      name: newAccountName,
      type: newAccountType,
      currency: "USD" as const,
      balance: 0,
      color: "#3B82F6",
      icon: "🏦",
      createdAt: new Date(),
    }

    addAccount(newAccount)
    setNewAccountName("")
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      <main className="px-4 py-6 md:px-6 md:py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Accounts Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Manage Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Account Form */}
            <div className="space-y-3 pb-4 border-b border-border">
              <div>
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  placeholder="e.g., My Checking Account"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="account-type">Account Type</Label>
                <Select value={newAccountType} onValueChange={(value: any) => setNewAccountType(value)}>
                  <SelectTrigger id="account-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddAccount} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>

            {/* Accounts List */}
            <div className="space-y-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{account.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{account.type}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAccount(account.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Expense Tracker v1.0</p>
            <p className="text-xs text-muted-foreground mt-2">
              A comprehensive expense tracking application to manage your finances.
            </p>
          </CardContent>
        </Card>
      </main>
      <MobileNav />
    </div>
  )
}
