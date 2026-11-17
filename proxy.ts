import { NextResponse, type NextRequest } from "next/server";
import { isAdminRole, SESSION_COOKIE, verifySession } from "./lib/session";

// Optimistic gate for /admin and /account. Every admin page and server action
// also re-checks the session, so this is not the only protection.
// The public website needs no login.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && !isAdminRole(user.role)) {
    return NextResponse.redirect(new URL("/account", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*"],
};
