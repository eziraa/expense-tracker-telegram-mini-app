'use client'
import { redirect } from "next/navigation"
import { useAuth } from "@/providers/auth.privider"
import { Loader2Icon } from "lucide-react"

export default async function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center flex-col space-y-4">
        <Loader2Icon className=" animate-spin text-accent" />
      </div>
    )

  }

  if (!user && !loading) {
    redirect("/auth/login")
  }

  redirect("/dashboard")

}
