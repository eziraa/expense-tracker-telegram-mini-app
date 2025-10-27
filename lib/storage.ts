import type { Account, Transaction, Budget, Goal, Category, Tag, User } from "./types"

const STORAGE_KEYS = {
  ACCOUNTS: "expense_tracker_accounts",
  TRANSACTIONS: "expense_tracker_transactions",
  BUDGETS: "expense_tracker_budgets",
  GOALS: "expense_tracker_goals",
  CATEGORIES: "expense_tracker_categories",
  TAGS: "expense_tracker_tags",
  USER: "expense_tracker_user",
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Food & Dining", type: "expense", icon: "🍔", color: "#FF6B6B" },
  { id: "2", name: "Transportation", type: "expense", icon: "🚗", color: "#4ECDC4" },
  { id: "3", name: "Shopping", type: "expense", icon: "🛍️", color: "#FFE66D" },
  { id: "4", name: "Entertainment", type: "expense", icon: "🎬", color: "#95E1D3" },
  { id: "5", name: "Utilities", type: "expense", icon: "💡", color: "#F38181" },
  { id: "6", name: "Healthcare", type: "expense", icon: "⚕️", color: "#AA96DA" },
  { id: "7", name: "Salary", type: "income", icon: "💰", color: "#52B788" },
  { id: "8", name: "Freelance", type: "income", icon: "💻", color: "#2D6A4F" },
  { id: "9", name: "Investment", type: "income", icon: "📈", color: "#1B4965" },
]

const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Checking Account",
    type: "checking",
    currency: "USD",
    balance: 5000,
    color: "#3B82F6",
    icon: "🏦",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    currency: "USD",
    balance: 15000,
    color: "#10B981",
    icon: "🏦",
    createdAt: new Date(),
  },
]

const DEFAULT_USER: User = {
  id: "1",
  email: "user@example.com",
  name: "User",
  theme: "system",
  currency: "USD",
  createdAt: new Date(),
}

export const storage = {
  // Accounts
  getAccounts: (): Account[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS)
    return data ? JSON.parse(data) : DEFAULT_ACCOUNTS
  },
  setAccounts: (accounts: Account[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts))
  },
  addAccount: (account: Account) => {
    const accounts = storage.getAccounts()
    storage.setAccounts([...accounts, account])
  },
  updateAccount: (id: string, updates: Partial<Account>) => {
    const accounts = storage.getAccounts()
    storage.setAccounts(accounts.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc)))
  },
  deleteAccount: (id: string) => {
    const accounts = storage.getAccounts()
    storage.setAccounts(accounts.filter((acc) => acc.id !== id))
  },

  // Transactions
  getTransactions: (): Transaction[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    return data
      ? JSON.parse(data).map((t: any) => ({ ...t, date: new Date(t.date), createdAt: new Date(t.createdAt) }))
      : []
  },
  setTransactions: (transactions: Transaction[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
  },
  addTransaction: (transaction: Transaction) => {
    const transactions = storage.getTransactions()
    storage.setTransactions([...transactions, transaction])
  },
  updateTransaction: (id: string, updates: Partial<Transaction>) => {
    const transactions = storage.getTransactions()
    storage.setTransactions(transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  },
  deleteTransaction: (id: string) => {
    const transactions = storage.getTransactions()
    storage.setTransactions(transactions.filter((t) => t.id !== id))
  },

  // Budgets
  getBudgets: (): Budget[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS)
    return data ? JSON.parse(data).map((b: any) => ({ ...b, startDate: new Date(b.startDate) })) : []
  },
  setBudgets: (budgets: Budget[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets))
  },
  addBudget: (budget: Budget) => {
    const budgets = storage.getBudgets()
    storage.setBudgets([...budgets, budget])
  },
  updateBudget: (id: string, updates: Partial<Budget>) => {
    const budgets = storage.getBudgets()
    storage.setBudgets(budgets.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  },
  deleteBudget: (id: string) => {
    const budgets = storage.getBudgets()
    storage.setBudgets(budgets.filter((b) => b.id !== id))
  },

  // Goals
  getGoals: (): Goal[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.GOALS)
    return data ? JSON.parse(data).map((g: any) => ({ ...g, deadline: new Date(g.deadline) })) : []
  },
  setGoals: (goals: Goal[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals))
  },
  addGoal: (goal: Goal) => {
    const goals = storage.getGoals()
    storage.setGoals([...goals, goal])
  },
  updateGoal: (id: string, updates: Partial<Goal>) => {
    const goals = storage.getGoals()
    storage.setGoals(goals.map((g) => (g.id === id ? { ...g, ...updates } : g)))
  },
  deleteGoal: (id: string) => {
    const goals = storage.getGoals()
    storage.setGoals(goals.filter((g) => g.id !== id))
  },

  // Categories
  getCategories: (): Category[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES
  },
  setCategories: (categories: Category[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
  },

  // Tags
  getTags: (): Tag[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.TAGS)
    return data ? JSON.parse(data) : []
  },
  setTags: (tags: Tag[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags))
  },

  // User
  getUser: (): User => {
    if (typeof window === "undefined") return DEFAULT_USER
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : DEFAULT_USER
  },
  setUser: (user: User) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },
}
