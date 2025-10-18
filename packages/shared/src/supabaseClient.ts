import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types.ts' // ✅ Correct type-only import

// These variables are populated by the .env files in the mobile and desktop apps.
// This shared file doesn't have direct access to them, but the apps that import it do.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.')
}

// The <Database> generic tells the client what your database looks like
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)