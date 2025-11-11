import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import localFont from "next/font/local";
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/providers/auth.privider"
// import { AuthProvider } from "@/providers/auth.privider"


const avenirLTPro = localFont({
  src: [
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProLightOblique.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProBook.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProBookOblique.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProMediumOblique.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProHeavy.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProHeavyOblique.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./../public/fonts/avenir-lt-pro/AvenirLTProBlackOblique.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-avenir-lt-pro",
  display: "swap",
});
const _geist = Geist({ subsets: ["latin"] })
const _geist_mono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracker - Manage Your Finances",
  description: "Advanced expense tracker with multi-account support, budgets, and analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        `font-sans antialiased`
        , avenirLTPro.variable
      )}>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Toaster position="top-right" />
            {children}
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html >
  )
}
