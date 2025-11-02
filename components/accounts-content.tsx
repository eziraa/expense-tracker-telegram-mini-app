"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { createAccount, deleteAccount } from "@/app/actions/accounts"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/providers/auth.privider"
import DeleteDialog from "./delete-dialog"

interface Account {
  id: string
  name: string
  type: string
  balance: number
  currency: string
}

export function AccountsContent({ accounts: initialAccounts, userId }: { accounts: Account[]; userId: string }) {
  const userProfile = useAuth().user?.profiles?.[0]
  const [accounts, setAccounts] = useState(initialAccounts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "checking",
    balance: "",
    currency: userProfile?.currency || "ETB",
  })

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const newAccount = await createAccount({
        ...formData,
        balance: Number.parseFloat(formData.balance),
        user_id: userId,
      })
      setAccounts([...accounts, newAccount])
      setFormData({ name: "", type: "checking", balance: "", currency: userProfile?.currency || "ETB" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteAccount(id)
      setAccounts(accounts.filter((a) => a.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account")
    } finally {
      setIsDeleting(null)
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Accounts</h1>
        <p className="text-muted-foreground">Manage your financial accounts</p>
      </div>

      {/* Total Balance */}
      <Card className="bg-linear-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
          <p className="text-4xl font-bold">{totalBalance.toFixed(2)} {userProfile?.currency || "ETB"}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Account Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Checking"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Accounts List */}
        <div className="lg:col-span-2 space-y-4">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold">{account.balance.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{account.currency}</p>
                      </div>
                      <DeleteDialog
                        title="Delete Account"
                        open={isDeleting === account.id}
                        onOpenChange={(value) => {
                          if (!value) {
                            setIsDeleting(null);
                          }
                        }}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsDeleting(account.id)}
                            disabled={isDeleting === account.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        }
                        onConfirm={() => handleDeleteAccount(account.id)}
                        item={'account'}
                        itemName={`account with id ${account.id}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No accounts yet. Create one to get started!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
