// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 1. Define PUBLIC routes (accessible without Clerk auth, but Clerk state is available)
const isPublicRoute = createRouteMatcher([
  '/',             // Allow access to the homepage
  '/sign-in(.*)',  // Allow access to sign-in pages and sub-routes
  '/sign-up(.*)',  // Allow access to sign-up pages and sub-routes
  '/admin(.*)',  // Allow access to admin pages and sub-routes
  // Add other public pages or API routes below as needed:
  // '/about',
  // '/products(.*)',
]);

// 2. Define IGNORED routes (Clerk middleware completely skips these)
const isIgnoredRoute = createRouteMatcher([
  '/admin/studio(.*)', // <--- Ignore the Sanity Studio paths
  '/structure(.*)', // <--- Ignore the Sanity Studio structure paths
  '/api/webhooks/(.*)', // <--- Example: Ignore specific API routes like webhooks if they have separate auth
  // Add other routes Clerk should fully ignore
]);

// 3. Update the middleware function
export default clerkMiddleware((auth, req) => {
  // If the route is NOT ignored by Clerk...
  if (!isIgnoredRoute(req)) {
    // ...AND it's also NOT a public route, then protect it.
    if (!isPublicRoute(req)) {
      auth.protect();
    }
    // If it's public OR ignored, the middleware does nothing further for protection.
  }
  // Note: Even on public/ignored routes, auth() state can often still be read
  // server-side if needed, but protection won't trigger.
});

// 4. Keep your config object
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};