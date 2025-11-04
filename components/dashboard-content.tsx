"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { StatCard } from "./stat-card"
import { AnimatedCounter } from "./animated-counter"
import { useAuth } from "@/providers/auth.privider"

interface Account {
  id: string
  name: string
  type: string
  balance: number
  currency: string
  color: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  date: string
  category_id: string
}

interface Category {
  id: string
  name: string
  type: string
  icon: string
  color: string
}


export function DashboardContent({
  accounts,
  transactions,
  categories,
}: {
  accounts: Account[]
  transactions: Transaction[]
  categories: Category[]
}) {
  const userProfile = useAuth().user?.profiles?.[0]
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)


  const categoryData = categories
    .map((cat) => ({
      name: cat.name,
      value: transactions
        .filter((t) => t.category_id === cat.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((c) => c.value > 0)

  const dailySpendingData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short" })
    const dayTotal = transactions
      .filter((t) => {
        const tDate = new Date(t.date).toLocaleDateString()
        return tDate === date.toLocaleDateString() && t.type === "expense"
      })
      .reduce((sum, t) => sum + t.amount, 0)

    return { date: dateStr, amount: dayTotal }
  })

  const recentTransactions = transactions.slice(0, 6)

  const COLORS = ["#3b82f6", "#0ea5e9", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]


  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <div className="relative overflow-hidden shadow-2xl rounded-2xl bg-linear-to-br from-accent/20 via-accent/10 to-transparent border-[0.6px] border-accent/50 p-6 md:p-8 animate-fade-in">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative">
          <p className="text-sm text-muted-foreground mb-2">Welcome back! Here's your financial overview</p>
          <h1 className="text-lg  font-semibold text-foreground">
            Your Total Balance:{" "}
            <span className="text-accent">
              <AnimatedCounter value={totalBalance} duration={1000} decimals={2} />
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={totalBalance}
          icon={<Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          color="blue"
          delay={0}
        />
        <StatCard
          title="Total Income"
          value={totalIncome}
          icon={<TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />}
          color="green"
          delay={100}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          icon={<TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />}
          color="red"
          delay={200}
        />
        <StatCard
          title="Net Savings"
          value={totalBalance - totalExpenses}
          icon={<ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          color="purple"
          delay={300}
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Your Accounts</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage and track all your financial accounts</p>
          </div>
          <Link href="/dashboard/accounts">
            <Button
              variant="outline"
              size="sm"
              className="group hover:bg-accent/10 hover:text-accent transition-all bg-transparent"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account, idx) => (
            <Card
              key={account.id}
              className="overflow-hidden animate-scale-in shadow-lg border border-accent/50 transition-all duration-300 cursor-pointer group bg-linear-to-br from-card/50 to-card "
              style={{ animationDelay: `${idx * 50 + 200}ms` }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-accent/0 via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className=" relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors duration-300 font-semibold">
                      {account.name}
                    </CardTitle>
                    <CardDescription className="text-xs uppercase tracking-wide">{account.type}</CardDescription>
                  </div>
                  <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
                    <Wallet className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className="text-3xl font-bold group-hover:text-accent transition-colors duration-300 tracking-tight">
                  <AnimatedCounter value={account.balance} duration={600} decimals={2} />
                </div>
                <div className="mt-4 h-1 rounded-full bg-accent/20 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-accent to-accent/50 rounded-full group-hover:w-full transition-all duration-700 origin-left"
                    style={{ width: "65%" }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ animation: "fade-in-up 0.6s ease-out 0.3s both" }}
      >
        {/* Daily Spending Chart */}
        <Card className="shadow-md border-accent/40 transition-all duration-300 overflow-hidden group hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10">
          <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardHeader className="relative pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-accent font-bold">Daily Spending</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Last 7 days overview</CardDescription>
              </div>
              <div className="p-3 rounded-xl bg-accent/15 group-hover:bg-accent/25 transition-all duration-300">
                <TrendingDown className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative">
            {dailySpendingData.some((d) => d.amount > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dailySpendingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "2px solid var(--accent)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    }}
                    formatter={(value) => [`${(+value).toFixed(2)} ${userProfile?.currency || "ETB"}`, "Spending"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="var(--accent)"
                    radius={[12, 12, 0, 0]}
                    isAnimationActive
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground rounded-lg border-2 border-dashed border-accent/20">
                No spending data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown Chart */}
        <Card className="shadow-md border-accent/40 transition-all duration-300 overflow-hidden group hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10">
          <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <CardHeader className="relative pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-accent font-bold">Expense Categories</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Spending breakdown</CardDescription>
              </div>
              <div className="p-3 rounded-xl bg-accent/15 group-hover:bg-accent/25 transition-all duration-300">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${value.toFixed(0)} ${userProfile?.currency || "ETB"}`}
                    outerRadius={90}
                    fill="var(--accent)"
                    dataKey="value"
                    animationDuration={800}
                    style={{
                      fontSize: "10px"
                    }}

                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${(+value).toFixed(2)} ${userProfile?.currency || "ETB"}`}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "2px solid var(--accent)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    }}
                    itemStyle={{
                      color: "var(--text-forground)"
                    }}
                  />
                  <Legend
                    align="left"
                    style={{
                      fontSize: "10px"
                    }}
                    verticalAlign="bottom"
                    height={36}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground rounded-lg border-2 border-dashed border-accent/20">
                No expense data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card
        className="shadow-md border-accent/40 transition-all duration-300 overflow-hidden group hover:border-accent/70 hover:shadow-lg hover:shadow-accent/10"
        style={{ animation: "fade-in-up 0.6s ease-out 0.4s both" }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="relative pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-accent font-bold">Recent Transactions</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Your latest activity</CardDescription>
            </div>
            <Link href="/dashboard/transactions">
              <Button
                variant="outline"
                size="sm"
                className="group border-accent/50 hover:border-accent hover:bg-accent/10 hover:text-accent transition-all duration-300 bg-transparent"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, idx) => {
                const category = categories.find((c) => c.id === transaction.category_id)
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-accent/20 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group/item"
                    style={{ animation: `slide-in-right 0.4s ease-out ${0.45 + idx * 0.05}s both` }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`p-2.5 rounded-lg transition-all duration-300 ${transaction.type === "income"
                          ? "bg-green-500/15 group-hover/item:bg-green-500/25"
                          : "bg-red-500/15 group-hover/item:bg-red-500/25"
                          }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm group-hover/item:text-accent transition-colors truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{category?.name || "Uncategorized"}</p>
                      </div>
                    </div>
                    <div
                      className={`font-bold text-sm whitespace-nowrap ml-2 transition-colors duration-300 ${transaction.type === "income"
                        ? "text-green-500 group-hover/item:text-green-400"
                        : "text-red-500 group-hover/item:text-red-400"
                        }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      <AnimatedCounter value={transaction.amount} duration={500} decimals={2} />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="h-32 flex px-3.5 items-center justify-center text-muted-foreground rounded-xl border-2 border-dashed border-accent/20">
                <p>No transactions yet. Start by adding one!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="md:hidden fixed bottom-10 right-4 animate-slide-in-up">
        <Link href="/dashboard/add">
          <Button className="bg-linear-to-br from-accent to-accent/80 hover:shadow-2xl hover:scale-110 text-white font-semibold py-3 px-6 h-fit rounded-full shadow-lg transition-all duration-300 flex items-center gap-2">
            <Plus className="h-6 w-6" />
            {/* Add */}
          </Button>
        </Link>
      </div>

      {/* Desktop Add Button */}
      <div className="hidden md:block animate-slide-up" style={{ animationDelay: "500ms" }}>
        <Link href="/dashboard/add">
          <Button size={"default"} className="w-full bg-linear-to-r from-accent via-accent/90 to-accent/80 hover:shadow-2xl hover:scale-[102%] text-accent-foreground font-semibold py-4 text-balance transition-all duration-300 group">
            <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
            Add New Transaction
          </Button>
        </Link>
      </div>
    </div >
  )
}
