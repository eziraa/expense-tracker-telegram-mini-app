"use client"

import { useMemo } from "react"
import { useExpenseData } from "@/hooks/use-expense-data"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function AnalyticsPage() {
  const { transactions, categories, accounts } = useExpenseData()

  const thisMonth = new Date()
  thisMonth.setDate(1)

  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => new Date(t.date) >= thisMonth)
  }, [transactions])

  // Category breakdown
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {}
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = categories.find((c) => c.id === t.category)
        if (cat) {
          data[cat.name] = (data[cat.name] || 0) + t.amount
        }
      })
    return Object.entries(data).map(([name, value]) => ({ name, value }))
  }, [monthTransactions, categories])

  // Account breakdown
  const accountData = useMemo(() => {
    return accounts.map((acc) => ({
      name: acc.name,
      balance: acc.balance,
    }))
  }, [accounts])

  // Daily spending
  const dailyData = useMemo(() => {
    const data: Record<string, number> = {}
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const date = new Date(t.date).toLocaleDateString()
        data[date] = (data[date] || 0) + t.amount
      })
    return Object.entries(data)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [monthTransactions])

  const totalExpenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181", "#AA96DA"]

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Header />
      <main className="px-4 py-6 md:px-6 md:py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome, "USD")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses, "USD")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Net</p>
              <p
                className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(totalIncome - totalExpenses, "USD")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Pie Chart */}
          {categoryData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Account Balance Chart */}
          {accountData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Balances</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={accountData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="balance" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Daily Spending Chart */}
        {dailyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="amount" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </main>
      <MobileNav />
    </div>
  )
}
