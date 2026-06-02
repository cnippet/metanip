import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If user is logged in and trying to access auth pages, redirect to dashboard
  // if (token && (pathname === "/login" || pathname === "/register")) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  // If user is not logged in and trying to access protected routes, redirect to sign in
  if (!token && pathname.startsWith("/u")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is not logged in and trying to access admin routes, redirect to sign in
  // if (!token && pathname.startsWith("/admin")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/u/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};
