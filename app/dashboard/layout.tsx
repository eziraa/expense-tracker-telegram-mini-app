import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = (await cookies()).get("auth_token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen   md:overflow-y-hidden relative bg-background">
      <Header />
      <main className="px-4 py-6 md:px-6 md:py-4 w-full md:overflow-y-hidden mx-auto pb-24 md:pb-8 flex gap-2   " >
        <DesktopSidebar />
        <div className="flex-1 px-5 md:min-h-[90vh] py-2.5 md:max-h-[90vh] md:overflow-y-auto bg-card rounded-lg border border-border shadow-sm">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
