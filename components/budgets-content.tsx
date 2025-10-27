"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { createBudget, deleteBudget } from "@/app/actions/budgets"
import { AlertCircle } from "lucide-react"

interface Budget {
  id: string
  category_id: string
  limit_amount: number
  period: string
  spent: number
}

interface Category {
  id: string
  name: string
  type: string
}

interface Transaction {
  id: string
  category_id: string
  amount: number
  type: string
}

export function BudgetsContent({
  budgets: initialBudgets,
  categories,
  transactions,
  userId,
}: {
  budgets: Budget[]
  categories: Category[]
  transactions: Transaction[]
  userId: string
}) {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category_id: categories[0]?.id || "",
    limit_amount: "",
    period: "monthly",
  })

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const newBudget = await createBudget({
        ...formData,
        limit_amount: Number.parseFloat(formData.limit_amount),
        user_id: userId,
      })
      setBudgets([...budgets, newBudget])
      setFormData({ category_id: categories[0]?.id || "", limit_amount: "", period: "monthly" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create budget")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteBudget(id)
      setBudgets(budgets.filter((b) => b.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete budget")
    } finally {
      setIsDeleting(null)
    }
  }

  const expenseCategories = categories.filter((c) => c.type === "expense")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="text-muted-foreground">Set and track spending limits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Budget Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">Limit Amount</Label>
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.limit_amount}
                  onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Budget"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Budgets List */}
        <div className="lg:col-span-2 space-y-4">
          {budgets.length > 0 ? (
            budgets.map((budget) => {
              const category = categories.find((c) => c.id === budget.category_id)
              const percentage = (budget.spent / budget.limit_amount) * 100
              const isOverBudget = budget.spent > budget.limit_amount

              return (
                <Card key={budget.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{category?.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                          disabled={isDeleting === budget.id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            ${budget.spent.toFixed(2)} / ${budget.limit_amount.toFixed(2)}
                          </span>
                          <span className={`text-sm font-semibold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${isOverBudget ? "bg-red-500" : "bg-green-500"}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No budgets yet. Create one to track your spending!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
