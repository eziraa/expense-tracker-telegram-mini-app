import { updateSession } from "@/lib/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Only log in development to reduce noise
  if (process.env.NODE_ENV === "development") {
    console.log("Proxying request:", request.url)
  }
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
