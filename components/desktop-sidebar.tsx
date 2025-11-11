"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Home,
    Wallet,
    BarChart3,
    Target,
    Settings,
    User2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function DesktopSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    const navItems = [
        { href: "/dashboard", icon: Home, label: "Home" },
        { href: "/dashboard/transactions", icon: Wallet, label: "Transactions" },
        { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
        { href: "/dashboard/goals", icon: Target, label: "Goals" },
        { href: "/dashboard/accounts", icon: User2, label: "Accounts" },
        { href: "/dashboard/settings", icon: Settings, label: "Settings" },
    ]

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col bg-card  h-[90vh] border-r border-border  transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                {!collapsed && (
                    <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1 rounded-md hover:bg-accent/10 transition-colors"
                >
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/")

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                                "hover:bg-accent/10 hover:text-accent",
                                isActive && "bg-accent/20 text-accent",
                                collapsed && "justify-center"
                            )}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="px-4 py-4 border-t border-border text-xs text-muted-foreground">
                {!collapsed && <p className="text-center">© 2025 FinanceApp</p>}
            </div>
        </aside>
    )
}
