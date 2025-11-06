"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/app/actions/profile"
import { AlertCircle, CheckCircle } from "lucide-react"
import { CurrencySelector } from "./currency-selector"
import { useAuth } from "@/providers/auth.privider"

interface Profile {
  id: string
  email: string
  display_name: string
  currency: string
}

export function SettingsContent({ profile, userId }: { profile: Profile | null; userId: string }) {
  const { refresh, user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [currency, setCurrency] = useState("")
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    currency: profile?.currency || "USD",
  })

  useEffect(() => {
    setCurrency(user?.profiles?.[0].currency ?? '')
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updateProfile({
        id: userId,
        ...formData,
        currency
      })
      refresh()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="border-[0.6px] border-accent/50 shadow-md">
        <CardHeader className="px-3">
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="px-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                placeholder="Your name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <CurrencySelector
                currency={currency}
                onCurrencyChange={setCurrency}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-600 rounded-lg text-sm">
                <CheckCircle className="h-4 w-4" />
                Settings updated successfully!
              </div>
            )}

            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader className="px-2">
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <p className="text-sm text-muted-foreground">
            Expense Tracker v1.0 - A comprehensive financial management application built with Next.js and Supabase.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
