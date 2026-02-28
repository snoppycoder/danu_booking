import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWT } from "./lib/jwt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/guest");

  const isUnauthorizedPage = pathname.startsWith("/unauthorized");
  const isNextInternal = pathname.startsWith("/_next");

  const public_paths = [
    "/login",
    "/signup",
    "/guest",
    "/unauthorized",
    "/verify-email",
    "/_next",
    "/forgot-password",
    "/favicon.ico",
    "/api",
  ];

  const token = request.cookies.get("access_token")?.value;
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded?.roles?.[0];

  if (isAuthPage) {
    console.log(token, "token from proxy");
    if (userRole) {
      if (userRole === "super_admin")
        return NextResponse.redirect(new URL("/superadmin", request.url));
      if (userRole === "operator_admin")
        return NextResponse.redirect(new URL("/operator", request.url));
      if (userRole === "passenger")
        return NextResponse.redirect(new URL("/passenger", request.url));
    }
    return NextResponse.next();
  }

  if (isUnauthorizedPage || isNextInternal) {
    return NextResponse.next();
  }

  if (!userRole) {
    if (public_paths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  if (pathname.startsWith("/superadmin") && userRole !== "super_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/operator") && userRole !== "operator_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (pathname.startsWith("/agent") && userRole !== "agent_admin") {
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
