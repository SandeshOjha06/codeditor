// Middleware runs in the Edge runtime — avoid importing Node-only modules like 'next-auth' or 'crypto'

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
} from "@/routes";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Check for common next-auth cookie names instead of relying on server-side NextAuth helpers
  const sessionCookie = req.cookies.get("__Secure-next-auth.session-token") || req.cookies.get("next-auth.session-token") || req.cookies.get("next-auth.token")
  const isLoggedIn = !!sessionCookie?.value

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (nextUrl.pathname === "/auth/sign-in") {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }

  // Consider exact matches and optional '/auth' prefix, but prefer exact match first
  const isAuthRoute = authRoutes.includes(nextUrl.pathname) || authRoutes.some(r => nextUrl.pathname === `/auth${r}`);

  if(isApiAuthRoute) return;

  if(isAuthRoute){
    if(isLoggedIn){
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return;
  }

  
  if (!isLoggedIn && !isPublicRoute && !isApiAuthRoute) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }

  return;

}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};