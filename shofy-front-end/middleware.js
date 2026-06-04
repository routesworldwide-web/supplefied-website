import { NextResponse } from "next/server";

const allowedRoutes = [ "/login", "/register", "/contact"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const isAllowed = allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAllowed) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
