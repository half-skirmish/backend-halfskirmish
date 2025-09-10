import { NextResponse } from "next/server";

export function middleware(req) {
  const { cookies, nextUrl } = req;
  const token = cookies.get("token")?.value;

  const isLoginPage = nextUrl.pathname === "/login";

  // If not logged in and trying to access dashboard, redirect to login
  if (!token && nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and trying to access login, redirect to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard"], // paths to protect/redirect
};
