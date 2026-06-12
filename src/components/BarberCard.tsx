import { Link } from 'react-router-dom'
import type { Barber } from '@/lib/supabase'
import { trackReserveClick } from '@/lib/analytics'

const BarberCard = ({ barber, index = 0 }: { barber: Barber; index?: number }) => {
  return (
    <Link
      to={`/barberos/${barber.slug}`}
      onClick={() => trackReserveClick(barber.name, 'card')}
      className="group relative block overflow-hidden rounded-sm bg-[#111] border border-[#9D9D9D]/10 hover:border-[#9D9D9D]/40 transition-all duration-500 hover:shadow-[0_0_30px_hsl(32_70%_55%/0.15)] animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Foto */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
        <img
          src={barber.avatar_url}
          alt={barber.name}
          loading="lazy"
          width={400}
          height={533}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/30 to-transparent" />



        {/* Info bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9D9D9D] mb-1">{barber.chair}</p>
          <h3 className="display text-3xl text-[#F7F4EF] leading-none">{barber.name}</h3>
        </div>
      </div>

      {/* Footer card — sin estrellas */}
      <div className="flex items-center justify-end px-4 py-3 border-t border-[#9D9D9D]/10">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D] group-hover:translate-x-1 transition-transform">
          Ver perfil →
        </span>
      </div>
    </Link>
  )
}

export default BarberCard
