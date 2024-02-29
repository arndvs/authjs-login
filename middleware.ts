import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_AUTH_ROUTE_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_AUTH_ROUTE_REDIRECT, nextUrl))
    }
    return null;
  }

  // if not logged in and not public route, redirect to login
  if (!isLoggedIn && !isPublicRoute) {
    // redirect to login with callback url
    let callbackUrl = nextUrl.pathname;
    // add search params if they exist
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    // encode callback url
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    // redirect to login with callback url
    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
