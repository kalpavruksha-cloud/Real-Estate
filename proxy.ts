import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);
  requestHeaders.set("x-request-time", String(Date.now()));
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }
  const hasSession = request.cookies.has("kre_admin_session");
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"]
};


