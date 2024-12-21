import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    }
  }
})

// Helper function to check if we have real Supabase credentials
export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-url.supabase.co' &&
         import.meta.env.VITE_SUPABASE_ANON_KEY && 
         import.meta.env.VITE_SUPABASE_ANON_KEY !== 'placeholder-key'
}

// Helper function to safely make Supabase calls
export const safeSupabaseCall = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured with real credentials. Using fallback data.')
    return fallback
  }

  try {
    return await operation()
  } catch (error) {
    console.error('Supabase operation failed:', error)
    return fallback
  }
}
