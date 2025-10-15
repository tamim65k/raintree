import { createClient } from '@supabase/supabase-js'

// Support both Vite-style and Next-style env names so the app works in different setups.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function maskKey(key) {
    if (!key || key.length < 8) return '****'
    return `${key.slice(0, 8)}...${key.slice(-4)}`
}

if (!supabaseUrl) {
    throw new Error('Supabase URL is not set. Set VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in client/.env or your environment.')
}

if (!supabaseAnonKey) {
    throw new Error('Supabase anon key is not set. Set VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in client/.env or your environment.')
}

// Production ready - no console logs

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Production ready - runtime checks removed
