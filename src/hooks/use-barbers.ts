import { useQuery } from '@tanstack/react-query'
import { supabase, type Barber, type BarberWithServices } from '@/lib/supabase'

// ─── Fetch all active barbers, optionally filtered by chair (local) ───────────
export function useBarbers(chairFilter?: string) {
  return useQuery({
    queryKey: ['barbers', chairFilter],
    queryFn: async () => {
      let query = supabase
        .from('barbers')
        .select('*')
        .eq('active', true)
        .order('plan', { ascending: false })

      if (chairFilter && chairFilter !== 'Todos') {
        query = query.ilike('chair', `%${chairFilter}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Barber[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

// ─── Fetch single barber with services ───────────────────────────────────────
export function useBarber(slug: string) {
  return useQuery({
    queryKey: ['barber', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select(`*, services (*)`)
        .eq('slug', slug)
        .eq('active', true)
        .single()

      if (error) throw error
      return data as BarberWithServices
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  })
}

// ─── Fetch all unique styles ──────────────────────────────────────────────────
export function useStyles() {
  return useQuery({
    queryKey: ['styles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('barbers')
        .select('styles')
        .eq('active', true)

      if (error) throw error
      const allStyles = (data ?? []).flatMap((b) => b.styles as string[])
      return [...new Set(allStyles)].sort() as string[]
    },
    staleTime: 1000 * 60 * 10,
  })
}
