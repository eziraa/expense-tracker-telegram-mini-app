import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    const cookieStore = await cookies()
    
    if (!token) {
      // Clear the cookie
      cookieStore.delete("auth_token")
      return NextResponse.json({ success: true })
    }

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to set token" },
      { status: 500 }
    )
  }
}

