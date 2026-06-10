import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifySessionToken } from "@/lib/auth-token";

export async function proxy(request: NextRequest) {
  const session = await verifySessionToken(
    request.cookies.get(AUTH_COOKIE)?.value,
    process.env.AUTH_SECRET,
  );
  const pathname = request.nextUrl.pathname;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const closerRoute = pathname.startsWith("/dashboard/closer");
  if (session.role === "closer" && !closerRoute) {
    return NextResponse.redirect(new URL("/dashboard/closer", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
