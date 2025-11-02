"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"
import { AnimatedCounter } from "./animated-counter"

interface StatCardProps {
    title: string
    value: number
    icon: ReactNode
    color: "blue" | "green" | "red" | "purple"
    delay?: number
}

const colorClasses = {
    blue: "from-blue-600/20 to-blue-500/5 border-blue-500/50 dark:border-blue-900/50",
    green: "from-green-600/20 to-green-500/5 border-green-500/50 dark:border-green-900/50",
    red: "from-red-600/20 to-red-500/5 border-red-500/50 dark:border-red-900/50",
    purple: "from-purple-600/20 to-purple-500/5 border-purple-500/50 dark:border-purple-900/50",
}

const textClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
}

const iconBgClasses = {
    blue: "bg-blue-200 dark:bg-blue-900/30",
    green: "bg-green-200 dark:bg-green-900/30",
    red: "bg-red-200 dark:bg-red-900/30",
    purple: "bg-purple-200 dark:bg-purple-900/30",
}

export function StatCard({ title, value, icon, color, delay = 0 }: StatCardProps) {
    return (
        <Card
            className={`relative overflow-hidden border-[0.6px] animate-fade-in backdrop-blur-sm bg-linear-to-br ${colorClasses[color]} shadow-lg hover:scale-105 transition-all duration-300 group`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-accent transition-colors duration-300">
                        {title}
                    </CardTitle>
                    <div
                        className={`p-2.5 rounded-lg ${iconBgClasses[color]} group-hover:scale-110 transition-transform duration-300`}
                    >
                        {icon}
                    </div>
                </div>
            </CardHeader>

            <CardContent className=" pt-0">
                <div
                    className={`text-2xl font-bold tracking-tight ${textClasses[color]} group-hover:scale-110 transition-transform duration-300 origin-left`}
                >
                    <AnimatedCounter value={value} duration={800} decimals={2} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 group-hover:text-accent/70 transition-colors duration-300">
                    {color === "blue" && "Total account balance"}
                    {color === "green" && "Income this period"}
                    {color === "red" && "Expenses this period"}
                    {color === "purple" && "Savings growth"}
                </p>
            </CardContent>
        </Card>
    )
}
