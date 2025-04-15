// lib/supabase/server.ts - CORRECT PATTERN (Following Official Docs)
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
// import type { Database } from '../database.types' // Optional: Uncomment if using generated types

// Use async function and await cookies() as per docs
export async function createClient() {
  const cookieStore = await cookies() // No await needed here according to latest checks and common usage,
                                // BUT if you faced errors without await and docs show await, stick to docs.
                                // Let's assume docs example with await is what works in your setup based on screenshot.
  // const cookieStore = await cookies(); // <--- Use this if simple cookies() call gave errors AND docs show await

  return createServerClient/*<Database>*/( // Add <Database> if using types
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // The getAll method is expected to return all cookies
        getAll() {
          return cookieStore.getAll() // Pass the result of cookieStore.getAll()
        },
        // The setAll method receives an array of cookies to set
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Use the request's cookieStore instance to set each cookie
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            // Log error for debugging?
            console.error('Error setting cookies in Server Component:', error);
          }
        },
        // Optional: Define 'get' and 'remove' if needed by specific Supabase operations,
        // but 'getAll'/'setAll' are the primary ones in the latest docs example.
        // get(name: string) {
        //   return cookieStore.get(name)?.value
        // },
        // remove(name: string, options: CookieOptions) {
        //   try {
        //     cookieStore.set({ name, value: '', ...options })
        //   } catch (error) {
        //     // Ignore error from Server Component
        //   }
        // }
      },
    }
  )
}