"use client"

import { useAuth } from "@/providers/auth.privider"
import { use, useEffect, useState } from "react"

interface AnimatedCounterProps {
    value: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
    isCurrency?: boolean
}

export function AnimatedCounter({
    value,
    duration = 1000,
    prefix = "",
    suffix = "",
    decimals = 2,
    isCurrency = true,
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const userProfile = useAuth().user?.profiles?.[0]

    console.log("@@ User  ", userProfile)
    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            setDisplayValue(Math.floor(value * progress * 100) / 100)

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [value, duration])

    return (
        <span>
            {prefix}
            {displayValue.toFixed(decimals)}
            {suffix}
            {isCurrency && <span className="text-sm"> {userProfile?.currency ?? 'ETB'}</span>}
        </span>
    )
}
