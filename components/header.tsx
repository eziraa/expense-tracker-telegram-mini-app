"use client"

import { Moon, Sun, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    router.push("/auth/login")
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex">
          <Image src="/logo.png" alt="Logo" width={30} height={30} className="mr-2 rounded-full" />
          <h1 className="text-[18px] font-bold text-foreground">
            Expense Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoading} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
