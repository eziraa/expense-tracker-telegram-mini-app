"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth.privider"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, TrendingDown, Wallet, PieChartIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface Transaction {
  id: string
  type: string
  amount: number
  date: string
  category_id: string
}

interface Category {
  id: string
  name: string
  type: string
}

interface Account {
  id: string
  name: string
  balance: number
}

export function AnalyticsContent({
  transactions,
  categories,
  accounts,
}: {
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
}) {
  const userProfile = useAuth().user?.profiles?.[0]
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Category breakdown
  const categoryData = categories
    .map((cat) => ({
      name: cat.name,
      value: transactions
        .filter((t) => t.category_id === cat.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((c) => c.value > 0)

  // Daily spending
  const dailyData: { [key: string]: number } = {}
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const date = new Date(t.date).toDateString()
      dailyData[date] = (dailyData[date] || 0) + t.amount
    })

  const dailyChartData = Object.entries(dailyData)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)

  // Account balances
  const accountData = accounts.map((acc) => ({
    name: acc.name,
    balance: acc.balance,
  }))

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netSavings = totalIncome - totalExpenses
  const avgDailyExpense = dailyChartData.length > 0 ? totalExpenses / dailyChartData.length : 0
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0

  const colors = ["#06b6d4", "#0ea5e9", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444"]

  return (
    <div className="min-h-screen bg-background p-1 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div
          className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1 className="text-xl md:text-3xl font-bold bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Expense Analytics
          </h1>
          <p className="text-muted-foreground text-md mt-2">Track your spending patterns and financial insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Income",
              value: totalIncome.toFixed(2),
              icon: TrendingUp,
              color: "from-emerald-500/20 to-teal-500/20",
              textColor: "text-emerald-600 dark:text-emerald-400",
              borderColor: "border-emerald-500/20",
              delay: "delay-100",
            },
            {
              title: "Total Expenses",
              value: totalExpenses.toFixed(2),
              icon: TrendingDown,
              color: "from-red-500/20 to-orange-500/20",
              textColor: "text-red-600 dark:text-red-400",
              borderColor: "border-red-500/20",
              delay: "delay-200",
            },
            {
              title: "Net Savings",
              value: netSavings.toFixed(2),
              icon: Wallet,
              color: `from-cyan-500/20 to-blue-500/20`,
              textColor: netSavings >= 0 ? "text-cyan-600 dark:text-cyan-400" : "text-red-600 dark:text-red-400",
              borderColor: "border-cyan-500/20",
              delay: "delay-300",
            },
            {
              title: "Savings Rate",
              value: `${savingsRate}%`,
              icon: PieChartIcon,
              color: "from-purple-500/20 to-pink-500/20",
              textColor: "text-purple-600 dark:text-purple-400",
              borderColor: "border-purple-500/20",
              delay: "delay-400",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className={`transform transition-all duration-1000 ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"} ${stat.delay}`}
              >
                <Card
                  className={`backdrop-blur-xl bg-linear-to-br ${stat.color} border ${stat.borderColor} hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer group`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <div className="p-2 rounded-lg bg-background/50 group-hover:bg-background/80 transition-all">
                        <Icon className={`w-4 h-4 ${stat.textColor}`} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.textColor} tracking-tight`}>
                      {stat.value}{" "}
                      <span className="text-sm text-muted-foreground">{userProfile?.currency ?? "ETB"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses by Category */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <Card className="backdrop-blur-xl bg-linear-to-br from-card/50 to-card/30 border border-cyan-500/10 hover:border-cyan-500/20 transition-all duration-300 overflow-hidden h-full">
              <CardHeader className="border-b border-cyan-500/10">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500"></div>
                  Expenses by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 px-2 ">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300} className={' flex justify-end'}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => ` ${(value as number).toFixed(0)} ${userProfile?.currency ?? "ETB"}`}
                        outerRadius={90}
                        fill="#06b6d4"
                        dataKey="value"
                        style={{
                          fontSize: "10px"
                        }}
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"

                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => `${(value as number).toFixed(2)} ${userProfile?.currency ?? "ETB"}`}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid rgba(6, 182, 212, 0.3)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{
                          color: "var(--foreground)",
                        }}
                      />
                      <Legend align="left" verticalAlign="bottom" style={{ fontSize: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No expense data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Balances */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
            style={{ transitionDelay: "400ms" }}
          >
            <Card className="backdrop-blur-xl bg-linear-to-br from-card/50 to-card/30 border border-blue-500/10 hover:border-blue-500/20 transition-all duration-300 overflow-hidden h-full">
              <CardHeader className="border-b border-blue-500/10">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-linear-to-r from-blue-500 to-purple-500"></div>
                  Account Balances
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 px-2">
                {accountData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={accountData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis style={{ fontSize: "10px" }} dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        formatter={(value) => `${(value as number).toFixed(2)} ${userProfile?.currency ?? "ETB"}`}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid rgba(6, 182, 212, 0.3)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{
                          color: 'var(--foreground)'
                        }}
                      />
                      <Bar
                        dataKey="balance"
                        fill="url(#colorBalance)"
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"
                        radius={[8, 8, 0, 0]}

                      />
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3772ef" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#598af5" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">No accounts</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Daily Spending Trend */}
          <div
            className={`transition-all duration-1000 lg:col-span-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "600ms" }}
          >
            <Card className="backdrop-blur-xl bg-linear-to-br from-card/50 to-card/30 border border-amber-500/10 hover:border-amber-500/20 transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b border-amber-500/10">
                <div className="flex items-center flex-col justify-start">
                  <CardTitle className="flex text-sm font-normal items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-linear-to-r from-amber-500 to-red-500"></div>
                    Daily Spending Trend (Last 30 Days)
                  </CardTitle>
                  <span className="text-xs w-full font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                    Avg: {avgDailyExpense.toFixed(2)} {userProfile?.currency ?? "ETB"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 px-0 pr-1">
                {dailyChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={dailyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--muted-foreground)" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        formatter={(value) => `${(value as number).toFixed(2)} ${userProfile?.currency ?? "ETB"}`}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid rgba(6, 182, 212, 0.3)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{
                          color: 'var(--foreground)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="url(#colorGradient)"
                        strokeWidth={3}
                        dot={false}
                        animationBegin={0}
                        animationDuration={1000}
                        animationEasing="ease-out"
                        isAnimationActive={true}
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="100%" y2="0">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#eab308" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                    No spending data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
