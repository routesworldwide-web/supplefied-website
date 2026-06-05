import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow static assets and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Allow authentication and contact pages
  if (pathname === "/authenticate" || pathname === "/contact") {
    return NextResponse.next();
  }

  // Redirect all other pages to /authenticate (including root /)
  return NextResponse.redirect(new URL("/authenticate", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
