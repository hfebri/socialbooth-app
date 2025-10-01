function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const config = {
  replicateToken: () => requireEnv("REPLICATE_API_TOKEN", process.env.REPLICATE_API_TOKEN),
  replicateModel: () => process.env.REPLICATE_MODEL ?? "google/nano-banana",
  supabaseUrl: () => requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: () => requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRole: () => requireEnv("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),
  supabaseBucket: () => process.env.SUPABASE_STORAGE_BUCKET ?? "generated-images",
  siteUrl: () => process.env.NEXT_PUBLIC_SITE_URL,
}
