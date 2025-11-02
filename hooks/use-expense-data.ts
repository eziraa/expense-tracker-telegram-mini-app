"use client"

import { useState, useCallback, useEffect } from "react"
import { storage } from "@/lib/storage"
import type { Account, Transaction, Budget, Goal, Category, Tag, User } from "@/lib/types"

export enum TransactionTags {
  ACCOUNTS = "accounts",
  TRANSACTIONS = "transactions",
  BUDGETS = "budgets",
  GOALS = "goals",
  CATEGORIES = "categories",
  USER = "user",
}

export function useExpenseData() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [refreshFlag, setRefreshFlag] = useState<TransactionTags | null>(null)

  // Initialize data from storage
  useEffect(() => {
    setAccounts(storage.getAccounts())
    setTransactions(storage.getTransactions())
    setBudgets(storage.getBudgets())
    setGoals(storage.getGoals())
    setCategories(storage.getCategories())
    setTags(storage.getTags())
    setUser(storage.getUser())
    setIsLoaded(true)
  }, [])

  // Account operations
  const addAccount = useCallback((account: Account) => {
    storage.addAccount(account)
    setAccounts(storage.getAccounts())
  }, [])

  const updateAccount = useCallback((id: string, updates: Partial<Account>) => {
    storage.updateAccount(id, updates)
    setAccounts(storage.getAccounts())
  }, [])

  const deleteAccount = useCallback((id: string) => {
    storage.deleteAccount(id)
    setAccounts(storage.getAccounts())
  }, [])

  // Transaction operations
  const addTransaction = useCallback(
    (transaction: Transaction) => {
      storage.addTransaction(transaction)
      setTransactions(storage.getTransactions())
      // Update account balance
      if (transaction.type === "expense") {
        updateAccount(transaction.accountId, {
          balance: (accounts.find((a) => a.id === transaction.accountId)?.balance || 0) - transaction.amount,
        })
      } else if (transaction.type === "income") {
        updateAccount(transaction.accountId, {
          balance: (accounts.find((a) => a.id === transaction.accountId)?.balance || 0) + transaction.amount,
        })
      } else if (transaction.type === "transfer" && transaction.toAccountId) {
        updateAccount(transaction.accountId, {
          balance: (accounts.find((a) => a.id === transaction.accountId)?.balance || 0) - transaction.amount,
        })
        updateAccount(transaction.toAccountId, {
          balance: (accounts.find((a) => a.id === transaction.toAccountId)?.balance || 0) + transaction.amount,
        })
      }
    },
    [accounts, updateAccount],
  )

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    storage.updateTransaction(id, updates)
    setTransactions(storage.getTransactions())
  }, [])

  const deleteTransaction = useCallback(
    (id: string) => {
      const transaction = transactions.find((t) => t.id === id)
      if (transaction) {
        if (transaction.type === "expense") {
          updateAccount(transaction.accountId, {
            balance: (accounts.find((a) => a.id === transaction.accountId)?.balance || 0) + transaction.amount,
          })
        } else if (transaction.type === "income") {
          updateAccount(transaction.accountId, {
            balance: (accounts.find((a) => a.id === transaction.accountId)?.balance || 0) - transaction.amount,
          })
        } else if (transaction.type === "transfer" && transaction.toAccountId) {
          updateAccount(transaction.accountId, {
            balance: (accounts.find((a) => a.id === transaction.accountId)?.balance || 0) + transaction.amount,
          })
          updateAccount(transaction.toAccountId, {
            balance: (accounts.find((a) => a.id === transaction.toAccountId)?.balance || 0) - transaction.amount,
          })
        }
      }
      storage.deleteTransaction(id)
      setTransactions(storage.getTransactions())
    },
    [transactions, accounts, updateAccount],
  )

  // Budget operations
  const addBudget = useCallback((budget: Budget) => {
    storage.addBudget(budget)
    setBudgets(storage.getBudgets())
  }, [])

  const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
    storage.updateBudget(id, updates)
    setBudgets(storage.getBudgets())
  }, [])

  const deleteBudget = useCallback((id: string) => {
    storage.deleteBudget(id)
    setBudgets(storage.getBudgets())
  }, [])

  // Goal operations
  const addGoal = useCallback((goal: Goal) => {
    storage.addGoal(goal)
    setGoals(storage.getGoals())
  }, [])

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    storage.updateGoal(id, updates)
    setGoals(storage.getGoals())
  }, [])

  const deleteGoal = useCallback((id: string) => {
    storage.deleteGoal(id)
    setGoals(storage.getGoals())
  }, [])

  return {
    accounts,
    transactions,
    budgets,
    goals,
    categories,
    tags,
    user,
    isLoaded,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    addGoal,
    updateGoal,
    deleteGoal,
  }
}
