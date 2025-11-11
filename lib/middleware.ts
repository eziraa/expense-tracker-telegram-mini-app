import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const pathname = request.nextUrl.pathname

  // Allow access to auth pages and root without token
  const isAuthPage = pathname.startsWith("/auth")
  const isRoot = pathname === "/"
  const isPublicAsset = pathname.startsWith("/_next") || 
                        pathname.startsWith("/api/") ||
                        pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)

  // If no token and trying to access protected route, redirect to login
  if (!token && !isAuthPage && !isRoot && !isPublicAsset) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // If has token and on auth page (except callback), redirect to dashboard
  if (token && isAuthPage && pathname !== "/auth/callback" && pathname !== "/auth/sign-up-success") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
