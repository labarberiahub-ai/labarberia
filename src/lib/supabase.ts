import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Database types ───────────────────────────────────────────────────────────

export type Barber = {
  id: string
  slug: string
  name: string
  alias: string
  bio: string
  experience: number
  rating: number
  review_count: number
  styles: string[]
  specialties: string[]
  instagram: string
  chair: string
  plan: 'Básico' | 'Pro' | 'Premium'
  available: boolean
  badge: 'Disponible hoy' | 'Alta demanda' | 'Top rated' | null
  avatar_url: string
  agendapro_url: string
  active: boolean
  created_at: string
}

export type Service = {
  id: string
  barber_id: string
  name: string
  duration: number
  price: number
  active: boolean
}

export type BarberWithServices = Barber & {
  services: Service[]
}
