"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Plus, Trash2, Search, Download } from "lucide-react"
import { deleteTransaction } from "@/app/actions/transactions"
import { exportTransactionsCSV } from "@/app/actions/export"
import DeleteDialog from "./delete-dialog"
import { toast } from "sonner"

interface Account {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  type: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  date: string
  category_id: string
  account_id: string
  tags: string[]
}

export function TransactionsContent({
  transactions: initialTransactions,
  categories,
  accounts,
}: {
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
}) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesType = filterType === "all" || t.type === filterType
    return matchesSearch && matchesType
  })

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteTransaction(id)
      setTransactions(transactions.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Failed to delete transaction:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const csv = await exportTransactionsCSV()
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
    } catch (error) {
      console.error("Failed to export:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteTransaction = async (transaction?: Transaction) => {
    if (!transaction) return
    await handleDelete(transaction.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage all your transactions</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/dashboard/add" className="flex-1 md:flex-none">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </Link>
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>{filteredTransactions.length} transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const category = categories.find((c) => c.id === transaction.category_id)
                const account = accounts.find((a) => a.id === transaction.account_id)
                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {category?.name || "Uncategorized"} • {account?.name} •{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {transaction.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`font-semibold text-sm whitespace-nowrap ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                      </div>
                      <DeleteDialog
                        title="Delete transaction"
                        open={isDeleting === transaction.id}
                        onOpenChange={(value) => {
                          if (!value) {
                            setIsDeleting(null);
                          }
                        }}
                        trigger={
                          <Button
                            onClick={() => setIsDeleting(transaction.id)}
                            variant="ghost"
                            size="sm"
                            disabled={isDeleting === transaction.id}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                        item={transaction}
                        onConfirm={handleDeleteTransaction}
                        itemName={`transaction with id ${transaction.id}`}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No transactions found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
