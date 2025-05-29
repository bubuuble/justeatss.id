// middleware.ts
import { clerkMiddleware, createRouteMatcher, ClerkMiddlewareAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

const isIgnoredRoute = createRouteMatcher(['/admin/studio(.*)', '/api/webhooks/(.*)', '/api/doku-notification(.*)']);
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/products', '/products/(.*)', '/cart', '/about', '/order-status(.*)']);
const isAdminRoute = createRouteMatcher(['/admin$']);

// Adjust the return type of the main handler slightly, or let TypeScript infer.
// When auth.protect() is called and protects, it will throw/redirect, so execution
// doesn't "return" normally from that branch.
export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest, evt: NextFetchEvent) => {
  const { userId, orgRole, sessionClaims } = await auth();

  console.log(`[Middleware] Path: ${req.nextUrl.pathname}, UserID: ${userId}, OrgRole: ${orgRole}`);
  console.log(`[Middleware] User Public Metadata Role: ${(sessionClaims?.publicMetadata as any)?.role}`);

  if (isIgnoredRoute(req)) {
    console.log(`[Middleware] Path ${req.nextUrl.pathname} is IGNORED.`);
    return NextResponse.next(); // Explicitly continue for ignored routes
  }

  if (isAdminRoute(req)) {
    console.log(`[Middleware] Path ${req.nextUrl.pathname} IS an Admin Route.`);

    if (!userId) {
      console.log(`[Middleware] No user ID, protecting admin route (will redirect to sign-in).`);
      auth.protect(); // Let Clerk handle the redirect. No need to return its result.
      return; // Or simply don't have a return here, as protect() will throw.
                // For clarity, explicitly returning might be okay if TS allows undefined.
                // However, often protect() will throw, so this return might not be hit.
    }

    // User is signed in, check role
    if (orgRole === 'org:admin' || (sessionClaims?.publicMetadata as any)?.role === 'admin') {
      console.log(`[Middleware] User HAS admin role. Allowing access to admin route.`);
      return NextResponse.next();
    } else {
      console.log(`[Middleware] User does NOT have admin role. Denying access. OrgRole: ${orgRole}, PublicMetaRole: ${(sessionClaims?.publicMetadata as any)?.role}`);
      const homeUrl = new URL('/', req.url);
      return NextResponse.redirect(homeUrl); // Explicit redirect for unauthorized admin access
    }
  }

  if (!isPublicRoute(req)) {
    console.log(`[Middleware] Path ${req.nextUrl.pathname} is NOT public. Protecting.`);
    auth.protect(); // Let Clerk handle the redirect.
    return; // Similar to above, protect() will throw or redirect.
  }

  console.log(`[Middleware] Path ${req.nextUrl.pathname} is PUBLIC or already handled. Allowing.`);
  return NextResponse.next(); // Explicitly allow public routes
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};