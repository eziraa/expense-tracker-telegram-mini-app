import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
  const token = (await cookies()).get("auth_token")?.value


  if (!token) {
    console.log("No auth token found, redirecting to login")
    redirect("/auth/login")
  }

  redirect("/dashboard")

}
