import { createClient } from "@supabase/supabase-js"
import { config } from "./config"

export function getSupabaseServiceRoleClient() {
  const supabaseUrl = config.supabaseUrl()
  const supabaseKey = config.supabaseServiceRole()

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}

export function getSupabaseAnonClient() {
  const supabaseUrl = config.supabaseUrl()
  const supabaseKey = config.supabaseAnonKey()

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })
}
