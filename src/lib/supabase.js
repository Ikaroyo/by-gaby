import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar que las variables existen
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// La clave anónima (anon key) es SEGURA para exponerse públicamente
// Solo permite operaciones que están definidas en tus políticas RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey)