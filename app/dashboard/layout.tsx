import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto pb-24 md:pb-8">{children}</main>
      <MobileNav />
    </div>
  )
}
