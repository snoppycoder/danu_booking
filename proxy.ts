import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJWT } from "./lib/jwt";
import { Constants } from "./lib/constant";
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/guest");

  const isUnauthorizedPage = pathname.startsWith("/unauthorized");
  const isNextInternal = pathname.startsWith("/_next");

  const token = request.cookies.get("access_token")?.value;
  const decoded = token ? decodeJWT(token) : null;
  const userRole = decoded?.roles?.[0];

  if (
    !token &&
    (pathname.startsWith("/operator") ||
      pathname.startsWith("/agent") ||
      pathname.startsWith("/passenger") ||
      pathname.startsWith("/superadmin"))
  ) {
    return NextResponse.redirect(new URL("/guest", request.url));
  }
  if (pathname.startsWith("/tvn")) {
    const q = request.nextUrl.searchParams.get("q");
    console.log(pathname);
    if (token) {
      return NextResponse.redirect(
        new URL(`/passenger/tvn?q=${q}`, request.url),
      );
    }
    return NextResponse.redirect(new URL(`/guest/tvn?q=${q}`, request.url));
  }
  if (isAuthPage) {
    if (userRole) {
      if (userRole === "super_admin")
        return NextResponse.redirect(new URL("/superadmin", request.url));
      if (userRole === "operator_admin")
        return NextResponse.redirect(new URL("/operator", request.url));
      if (userRole === "passenger")
        return NextResponse.redirect(new URL("/passenger", request.url));
      if (userRole === "agent" && decoded.agent_type == "operator-agent-admin")
        return NextResponse.redirect(
          new URL("/operator-agent/ticket-booking", request.url),
        );
      if (userRole === "agent" && decoded.agent_type == "agent-admin")
        return NextResponse.redirect(
          new URL("/agent/ticket-booking", request.url),
        );
    }
    return NextResponse.next();
  }

  if (isUnauthorizedPage || isNextInternal) {
    return NextResponse.next();
  }

  if (!userRole) {
    if (Constants.public_paths.some((path) => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/guest", request.url));
  }

  if (pathname.startsWith("/superadmin") && userRole !== "super_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (pathname.startsWith("/operator-agent") && userRole !== "agent_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (
    pathname.startsWith("/agent") &&
    userRole !== "agent_admin" &&
    decoded.agent_type !== "agent-admin"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (
    pathname.startsWith("/operator-agent") &&
    userRole !== "agent_admin" &&
    decoded.agent_type !== "operator-agent-admin"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (pathname.startsWith("/operator/") && userRole !== "operator_admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (pathname == "/operator/" && userRole !== "operator_admin") {
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
