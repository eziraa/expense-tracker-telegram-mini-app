export type TransactionType = "expense" | "income" | "transfer"
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly"
export type Currency = "USD" | "EUR" | "GBP" | "INR" | "JPY" | "AUD" | "CAD" | "ETB"

export interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit" | "cash" | "investment"
  currency: Currency
  balance: number
  color: string
  icon: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  type: "expense" | "income"
  icon: string
  color: string
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: Currency
  description: string
  category: string
  tags: string[]
  accountId: string
  toAccountId?: string
  date: Date
  receipt?: string
  notes?: string
  recurring?: RecurrenceType
  createdAt: Date
}

export interface Budget {
  id: string
  name: string
  category: string
  limit: number
  spent: number
  currency: Currency
  period: "monthly" | "yearly"
  startDate: Date
  alertThreshold: number
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  currency: Currency
  deadline: Date
  category: string
  priority: "low" | "medium" | "high"
}

export interface User {
  id: string
  email: string
  name: string
  theme: "light" | "dark" | "system"
  currency: Currency
  createdAt: Date
}
