import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./lib/auth/session";
import { defaultLocale, locales } from "./i18n/config";

// Next 16 renamed `middleware` → `proxy`.
//  - Gates the /admin area behind a valid session (edge-safe jose verify).
//  - Redirects locale-less storefront paths (e.g. "/", "/shop") to the default locale.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin area — never locale-redirect; require a session (except the login page).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") return;
    const ok = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (ok) return;
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, API routes, and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
