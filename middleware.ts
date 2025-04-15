// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware' // Use correct path alias or relative path

export async function middleware(request: NextRequest) {
  // updateSession() handles refreshing the session and setting cookies.
  // It returns a NextResponse instance.
  return await updateSession(request)

  // Note: If you want to add route protection logic (redirecting unauthenticated
  // users), you would typically do it AFTER calling updateSession,
  // potentially creating a separate Supabase client within this middleware
  // scope to check auth status if needed for redirects.
  // Example (add this *after* the updateSession call if needed):
  // const response = await updateSession(request);
  // const supabase = createMiddlewareClient(...) // Need a way to get client instance here
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }
  // return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more exceptions.
     * Avoid matching routes that shouldn't run middleware e.g., API routes if not needed.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}