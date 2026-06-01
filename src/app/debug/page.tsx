export default function DebugPage() {
  return (
    <pre className="p-8 text-xs">
      {JSON.stringify(
        {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING",
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            ? "SET (" + process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.slice(0, 20) + "…)"
            : "MISSING",
        },
        null,
        2
      )}
    </pre>
  )
}
