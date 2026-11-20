import { NextResponse, type NextRequest } from "next/server";
import { SECTION_BASE, SHARED_PREFIXES, sectionForHost } from "./lib/hosts";
import { isAdminRole, SESSION_COOKIE, verifySession } from "./lib/session";

/**
 * 1. Separate websites: a request to the Montessori / Dhamma School address is
 *    rewritten into that section (e.g. "/" -> "/montessori").
 * 2. Optimistic login gate for /admin and /account (pages re-check the session).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const section = sectionForHost(request.headers.get("host"));
  if (section) {
    const base = SECTION_BASE[section];
    const shared = SHARED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
    const isFile = /\.[a-z0-9]+$/i.test(pathname);
    if (!shared && !isFile && !pathname.startsWith(base)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname === "/" ? base : base + pathname;
      return NextResponse.rewrite(url);
    }
  }

  const protectedPath = pathname.startsWith("/admin") || pathname.startsWith("/account");
  if (!protectedPath) return NextResponse.next();

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
