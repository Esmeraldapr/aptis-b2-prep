import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env.'
  )
}

// Todas las tablas de esta app viven en el esquema aislado "ingles",
// para no interferir con otras apps que comparten el mismo proyecto Supabase.
export const supabase = createClient<Database, 'ingles'>(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'ingles' },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
