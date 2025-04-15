// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
// import type { Database } from '../database.types' // Optional: If you generated types

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient( // Use <Database> if you have types
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}