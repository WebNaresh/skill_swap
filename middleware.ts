/**
 * Authentication Middleware for SkillCircle Platform
 * Handles post-authentication redirects based on profile setup status
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to sign-in page
    if (pathname.startsWith("/sign-in")) {
      return NextResponse.next();
    }

    // Redirect authenticated users to profile setup if not completed
    if (token && !token.isSetupCompleted && pathname !== "/profile") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // Redirect users with completed setup away from profile page
    if (token && token.isSetupCompleted && pathname === "/profile") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public pages
        const publicPages = ["/", "/sign-in", "/terms", "/privacy", "/refund", "/search"];
        if (publicPages.includes(pathname)) {
          return true;
        }

        // Require authentication for protected pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
