// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
// import type { Database } from '../database.types' // Optional

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient/*<Database>*/( // Use <Database> if you have types
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the request for future reads
          // and the response for setting the cookie
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ // Re-create response to apply cookie changes
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
           // If the cookie is removed, update the request for future reads
           // and the response for deleting the cookie
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ // Re-create response to apply cookie changes
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // IMPORTANT: Avoid accessing `request.url` here or modifying response
  // based on session state in this specific `updateSession` function
  // if you only want it to refresh tokens. Let the main middleware logic handle redirects.

  // Refresh session if expired - This will automatically handle loading
  // the session from the cookie, refreshing it if needed, and setting
  // the refreshed cookie on the response.
  await supabase.auth.getSession()

  return response // Return the potentially modified response object
}