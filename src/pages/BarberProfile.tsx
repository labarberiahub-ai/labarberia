import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Share2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SEO, barberSchema } from '@/components/seo/SEO'
import { useBarber } from '@/hooks/use-barbers'
import { trackBarberView, trackReserveClick } from '@/lib/analytics'

function getZodiacEmoji(sign?: string) {
  const map: Record<string, string> = {
    aries: '♈', tauro: '♉', geminis: '♊', cancer: '♋', leo: '♌', virgo: '♍',
    libra: '♎', escorpio: '♏', sagitario: '♐', capricornio: '♑', acuario: '♒', piscis: '♓',
  }
  return sign ? (map[sign.toLowerCase()] ?? '◆') : '◆'
}

const BarberProfile = () => {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { data: barber, isLoading, isError } = useBarber(slug)

  useEffect(() => {
    if (barber) trackBarberView(barber.name, barber.slug)
  }, [barber])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: barber?.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-wide py-24">
          <div className="grid gap-10 lg:grid-cols-[3fr_9fr]">
            <div className="aspect-[3/4] max-w-xs rounded-sm bg-card animate-pulse" />
            <div className="space-y-4 pt-4">
              <div className="h-4 w-24 rounded bg-card animate-pulse" />
              <div className="h-16 w-3/4 rounded bg-card animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isError || !barber) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-wide py-32 text-center">
          <p className="display text-4xl text-muted-foreground">Barbero no encontrado</p>
          <Link to="/" className="inline-flex mt-8 bg-[#F7F4EF] text-[#000] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-8 py-3 hover:bg-white transition-colors">
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const agendaUrl = (barber as any).agendapro_url || 'https://labarberia.agendapro.com/cl'

  const statCards = [
    (barber as any).years_at_lb && { icon: '✦', label: 'Años en La Barbería', value: `${(barber as any).years_at_lb} años` },
    (barber as any).birthday && { icon: '🎂', label: 'Cumpleaños', value: (barber as any).birthday },
    (barber as any).zodiac && { icon: getZodiacEmoji((barber as any).zodiac), label: 'Signo zodiacal', value: (barber as any).zodiac },
    (barber as any).fav_artist && { icon: '🎵', label: 'Artista favorito', value: (barber as any).fav_artist },
    (barber as any).hobby && { icon: '⚡', label: 'Hobby', value: (barber as any).hobby },
    (barber as any).available_days && { icon: '📅', label: 'Días disponibles', value: (barber as any).available_days },
    (barber as any).instagram && { icon: '📸', label: 'Instagram', value: (barber as any).instagram, isInstagram: true },
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${barber.name} — Barbero en Santiago`}
        description={(barber as any).bio}
        canonical={`/barberos/${barber.slug}`}
        ogImage={barber.avatar_url}
        schema={barberSchema(barber)}
      />
      <Header />

      <div className="container-wide pt-8">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#9D9D9D]/60 hover:text-[#F7F4EF] transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </button>
      </div>

      <section className="container-wide pt-8 pb-16">
        <div className="grid gap-10 lg:grid-cols-[3fr_9fr] items-start">

          {/* Foto compacta */}
          <div className="relative overflow-hidden rounded-sm bg-[#111] max-w-[280px] w-full" style={{ aspectRatio: '3/4' }}>
            <img src={barber.avatar_url} alt={barber.name}
              className="h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
          </div>

          <div className="pt-2">
            {/* Sucursal */}
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#9D9D9D] mb-2">{barber.chair}</p>
            {/* Nombre */}
            <h1 className="display text-5xl md:text-7xl leading-[0.92] text-[#F7F4EF]">{barber.name}</h1>

            {(barber as any).bio && (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#F7F4EF]/70">{(barber as any).bio}</p>
            )}

            {/* Stat cards */}
            {statCards.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {statCards.map((s: any) => (
                  <div key={s.label} className="rounded-sm border border-[#9D9D9D]/12 bg-[#111] p-3 hover:border-[#9D9D9D]/30 transition-colors">
                    <p className="text-[8px] uppercase tracking-[0.22em] text-[#9D9D9D]/40 mb-2">{s.label}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm leading-none">{s.icon}</span>
                      {s.isInstagram ? (
                        <a href={`https://instagram.com/${(barber as any).instagram.replace('@', '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-[#9D9D9D] hover:text-[#F7F4EF] hover:underline transition-colors">
                          {s.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-[#F7F4EF]">{s.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botones B&N */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={agendaUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => trackReserveClick(barber.name, 'profile')}
                className="inline-flex items-center gap-2 bg-[#F7F4EF] text-[#000000] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-8 py-3 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
                Reservar con {barber.name.split(' ')[0]}
                <ExternalLink className="h-4 w-4" />
              </a>
              <button onClick={handleShare}
                className="inline-flex items-center gap-2 border border-[#F7F4EF]/20 text-[#F7F4EF] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-6 py-3 hover:border-[#F7F4EF]/60 hover:bg-[#F7F4EF]/5 transition-all">
                <Share2 className="h-4 w-4" /> Compartir
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BarberProfile
