"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PenIcon, Loader2Icon } from "lucide-react"
import { updateGoal } from "@/app/actions/goals"
import { AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

interface Goal {
    id: string
    name: string
    target_amount: number
    current_amount: number
    deadline: string
    category: string
}

interface EditGoalProps {
    goal: Goal
    onSuccess: (goal: Goal) => void
}

export function EditGoalDialog({ goal, onSuccess }: EditGoalProps) {
    const [open, setOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: goal.name || "",
        target_amount: (goal.target_amount).toString() || "",
        deadline: goal.deadline || "",
        category: goal.category || "",
        current_amount: (goal.current_amount).toString() || "",
    })


    useEffect(() => {
        setFormData({
            name: goal.name || "",
            target_amount: (goal.target_amount).toString() || "",
            deadline: goal.deadline || "",
            category: goal.category || "",
            current_amount: (goal.current_amount).toString() || "",
        })
    }, [goal])
    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        try {
            const updatedGoal = await updateGoal(goal.id, {
                ...formData,
                target_amount: Number.parseFloat(formData.target_amount),
                current_amount: Number.parseFloat(formData.current_amount),
            })
            if (updatedGoal) {
                onSuccess(updatedGoal)
            }
            setOpen(false)
            toast.success("Goal updated successfully")
            setFormData({ name: "", target_amount: "", deadline: "", category: "", current_amount: "" })
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update goal")
            setError(err instanceof Error ? err.message : "Failed to create goal")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <PenIcon className="h-4 w-4 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
                {/* Add Goal Form */}
                <Card className=" border-none p-0 shadow-none w-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PenIcon className="h-5 w-5" />
                            Update Goal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddGoal} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Goal Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Emergency Fund"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={isSaving}
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
                                    disabled={isSaving}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Amount</Label>
                                <Input
                                    id="current"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.current_amount}
                                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                                    disabled={isSaving}
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
                                    disabled={isSaving}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g., Savings"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    disabled={isSaving}
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
                                    <AlertCircle className="h-3 w-3" />
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={isSaving}>
                                {
                                    isSaving ? (
                                        <>
                                            <Loader2Icon className="h-4 w-4 text-accent animate-spin mr-1" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Goal"
                                    )
                                }
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
