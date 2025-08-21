import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log("[v0] Middleware - Path:", req.nextUrl.pathname)
    console.log("[v0] Middleware - Token:", !!req.nextauth.token)
    console.log("[v0] Middleware - Role:", req.nextauth.token?.role)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        if (pathname.startsWith("/admin")) {
          const hasValidRole = token?.role === "admin" || token?.role === "author"
          console.log("[v0] Admin route check - Has valid role:", hasValidRole)
          return hasValidRole
        }

        if (pathname.startsWith("/profile") || pathname.startsWith("/user/")) {
          return !!token
        }

        if (pathname.startsWith("/write")) {
          const hasValidRole = token?.role === "admin" || token?.role === "author"
          console.log("[v0] Write route check - Has valid role:", hasValidRole)
          return hasValidRole
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/user/:path*", "/write/:path*"],
}
