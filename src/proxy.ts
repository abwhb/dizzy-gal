import { type NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";

/**
 * Gate everything under /admin behind the admin session cookie. The login
 * page is the one exception. Pages and actions check again on their own, so
 * this is the first line rather than the only one.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
