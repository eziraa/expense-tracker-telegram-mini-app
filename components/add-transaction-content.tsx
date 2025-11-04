"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTransaction } from "@/app/actions/transactions"
import { AlertCircle, Loader2Icon, Plus, Upload } from "lucide-react"
import AddCategoryDialog from "./add-category"
import { uploadFileToSupabase } from "@/app/actions/files"

interface Account {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  type: string
}

export function AddTransactionContent({
  accounts,
  categories,
  userId,
}: {
  accounts: Account[]
  categories: Category[]
  userId: string
}) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    account_id: accounts[0]?.id || "",
    category_id: categories[0]?.id || "",
    tags: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setReceiptFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    setError(null)

    try {
      let receiptUrl = null

      if (receiptFile) {
        receiptUrl = await uploadFileToSupabase(receiptFile, {
          makePublic: true,
        })
      }

      await createTransaction({
        ...formData,
        amount: Number.parseFloat(formData.amount),
        user_id: userId,
        receipt_url: receiptUrl as unknown as string,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })
      router.push("/dashboard/transactions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction")
    } finally {
      setIsAdding(false)
    }
  }


  const expenseCategories = categories.filter((c) => c.type === "expense")
  const incomeCategories = categories.filter((c) => c.type === "income")
  const relevantCategories = formData.type === "income" ? incomeCategories : expenseCategories

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Add Transaction</h1>
        <p className="text-muted-foreground">Record a new income or expense</p>
      </div>

      <Card className="shadow-lg border border-accent/50">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                disabled={isAdding}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Grocery shopping"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isAdding}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isAdding}
              />
            </div>

            {/* Account */}
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Select
                value={formData.account_id}
                onValueChange={(value) => setFormData({ ...formData, account_id: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
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
                  {relevantCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="gap-2" onClick={(e) => { e.preventDefault(); setOpen(true); }}><Plus className="w-4 h-4" /> Add Category</Button>

            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., groceries, weekly, important"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                disabled={isAdding}
              />
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  disabled={isAdding}
                  className="hidden"
                />
                <label htmlFor="receipt" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">{receiptFile ? receiptFile.name : "Click to upload receipt"}</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or PDF</p>
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full flex items-center space-x-0.5 text-white" disabled={isAdding}>
              {
                isAdding ? (
                  <>
                    <Loader2Icon className="animate-spin text-white" /> Adding... transaction
                  </>
                ) : (
                  'Add Transaction'
                )
              }
            </Button>
          </form>
        </CardContent>
      </Card>
      <AddCategoryDialog
        userId={userId}
        open={open}
        setOpen={setOpen}
      />
    </div>
  )
}
