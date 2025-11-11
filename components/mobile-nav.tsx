"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Plus, Wallet, Target, Settings, User2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/transactions", icon: Wallet, label: "Transactions" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/goals", icon: Target, label: "Goals" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    { href: "/dashboard/accounts", icon: User2, label: "Accounts" },
  ]

  return (
    <nav className="fixed  bottom-0 left-0 right-0 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          console.log("Pathname", pathname)
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 px-2 text-xs font-medium transition-all duration-300 flex-1 relative group",
                isActive ? "text-accent" : "text-muted-foreground hover:text-accent",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
