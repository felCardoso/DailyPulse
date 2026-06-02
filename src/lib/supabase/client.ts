import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

// Stable singleton for client-side hooks
let _client: ReturnType<typeof createClient> | null = null
export function getSupabaseClient() {
  if (typeof window === "undefined") return createClient()
  return (_client ??= createClient())
}
