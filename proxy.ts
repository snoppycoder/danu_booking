import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWT } from "./lib/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Separate Auth pages from the Unauthorized page
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/guest");

  const isUnauthorizedPage = pathname.startsWith("/unauthorized");
  const isNextInternal = pathname.startsWith("/_next");

  const token = request.cookies.get("access_token")?.value;
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded?.roles?.[0];

  // 2. Redirect logged-in users AWAY from login/signup pages
  if (isAuthPage) {
    if (userRole) {
      if (userRole === "superadmin")
        return NextResponse.redirect(new URL("/superadmin", request.url));
      if (userRole === "operator_admin")
        return NextResponse.redirect(new URL("/operator", request.url));
      if (userRole === "passenger")
        return NextResponse.redirect(new URL("/passenger", request.url));
    }
    return NextResponse.next();
  }

  // 3. Let anyone (logged in or not) view the unauthorized page & internal Next files
  if (isUnauthorizedPage || isNextInternal) {
    return NextResponse.next();
  }

  // 4. Block unauthenticated users from protected routes
  if (!userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 5. Role-based access control for protected routes
  if (pathname.startsWith("/superadmin") && userRole !== "superadmin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/operator") && userRole !== "operator_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/passenger") && userRole !== "passenger") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
