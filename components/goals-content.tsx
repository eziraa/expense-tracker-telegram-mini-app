"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Target } from "lucide-react"
import { createGoal, deleteGoal } from "@/app/actions/goals"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/providers/auth.privider"
import DeleteDialog from "./delete-dialog"
import { EditGoalDialog } from "./edit-goal-dialog"

interface Goal {
  id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string
  category: string
}

export function GoalsContent({ goals: initialGoals, userId }: { goals: Goal[]; userId: string }) {
  const userProfile = useAuth().user?.profiles?.[0]
  const [goals, setGoals] = useState(initialGoals)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    deadline: "",
    category: "",
  })

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const newGoal = await createGoal({
        ...formData,
        target_amount: Number.parseFloat(formData.target_amount),
        user_id: userId,
      })
      setGoals([...goals, newGoal])
      setFormData({ name: "", target_amount: "", deadline: "", category: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create goal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGoal = async (goal: Goal) => {
    setIsDeleting(goal.id)
    try {
      await deleteGoal(goal.id)
      setGoals(goals.filter((g) => g.id !== goal.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete goal")
    } finally {
      setIsDeleting(null)
    }
  }

  const totalProgress = goals.reduce((sum, g) => sum + g.current_amount, 0)
  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Financial Goals</h1>
        <p className="text-muted-foreground text-sm">Track your savings and financial objectives</p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-linear-to-tr from-blue-600/20 via-white dark:via-black to-blue-600/30 ">
        <CardContent className="pt-6 px-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-sm font-semibold">
                {totalTarget > 0 ? ((totalProgress / totalTarget) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="h-3 rounded-full bg-primary transition-all"
                style={{ width: `${totalTarget > 0 ? Math.min((totalProgress / totalTarget) * 100, 100) : 0}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {totalProgress.toFixed(2)} {userProfile?.currency ?? 'ETB'} / {totalTarget.toFixed(2)} {userProfile?.currency ?? 'ETB'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Goal Form */}
        <Card className="lg:col-span-1 ">
          <CardHeader className="px-3">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3">
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Emergency Fund"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target Amount</Label>
                <Input
                  id="target"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Savings"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Goal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="lg:col-span-2 space-y-4">
          {goals.length > 0 ? (
            goals.map((goal) => {
              const percentage = (goal.current_amount / goal.target_amount) * 100
              const daysLeft = goal.deadline
                ? Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <Card key={goal.id}>
                  <CardContent className="pt-6 px-3">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {goal.name}
                          </p>
                          {goal.category && <p className="text-sm text-muted-foreground">{goal.category}</p>}
                        </div>
                        <div className="flex items-center justify-center">
                          <EditGoalDialog
                            goal={goal}
                            onSuccess={(updatedGoal) => {
                              setGoals((prev) =>
                                prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g))
                              )
                            }}
                          />
                          <DeleteDialog
                            title="Delete Goal"
                            open={isDeleting === goal.id}
                            onOpenChange={(value) => {
                              if (!value) {
                                setIsDeleting(null);
                              }
                            }}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsDeleting(goal.id)}
                                disabled={isDeleting === goal.id}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                            onConfirm={() => handleDeleteGoal(goal)}
                            item={'goal'}
                            itemName={`goal with id ${goal.id}`}
                          />

                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {goal.current_amount.toFixed(2)} {userProfile?.currency ?? 'ETB'} / {goal.target_amount.toFixed(2)} {userProfile?.currency ?? 'ETB'}
                          </span>
                          <span className="text-sm font-semibold">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      {goal.deadline && (
                        <p className={`text-xs ${daysLeft && daysLeft > 0 ? "text-muted-foreground" : "text-red-600"}`}>
                          {daysLeft && daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No goals yet. Create one to start tracking your financial objectives!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
