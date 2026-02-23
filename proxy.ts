import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWT } from "./lib/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token");
  if (!token) {
    return NextResponse.redirect(new URL("/guest", request.url));
  }
  const decoded = decodeJWT(token?.value || "");

  if (!decoded || !decoded.roles || decoded.roles.length === 0) {
    return NextResponse.redirect(new URL("/guest", request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/guest", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/superadmin")) {
    if (decoded.roles[0] !== "superadmin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/operator")) {
    if (decoded.roles[0] !== "operator_admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/passenger")) {
    if (decoded.roles[0] !== "passenger") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  // Guest-only routes
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (token) {
      if (decoded.roles[0] == "superadmin") {
        return NextResponse.redirect(new URL("/superadmin", request.url));
      } else if (decoded.roles[0] == "operator_admin") {
        return NextResponse.redirect(new URL("/operator", request.url));
      } else if (decoded.roles[0] == "passenger") {
        return NextResponse.redirect(new URL("/passenger", request.url));
      } else if (decoded.roles[0] == "agent_admin") {
        return NextResponse.redirect(new URL("/agent", request.url));
      }
    }
  }

  return NextResponse.next();
}
