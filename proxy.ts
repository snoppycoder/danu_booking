import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWT } from "./lib/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/_next") ||
    pathname === "/guest"
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = decodeJWT(token);

  if (!decoded || !decoded.roles || decoded.roles.length === 0) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = decoded.roles[0];

  // Role-based route protection
  if (pathname.startsWith("/superadmin") && role !== "superadmin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/operator") && role !== "operator_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/passenger") && role !== "passenger") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Prevent logged-in users from accessing login
  if (pathname.startsWith("/login")) {
    if (role === "superadmin") {
      return NextResponse.redirect(new URL("/superadmin", request.url));
    }
    if (role === "operator_admin") {
      return NextResponse.redirect(new URL("/operator", request.url));
    }
    if (role === "passenger") {
      return NextResponse.redirect(new URL("/passenger", request.url));
    }
    if (role === "agent_admin") {
      return NextResponse.redirect(new URL("/agent", request.url));
    }
  }

  return NextResponse.next();
}
