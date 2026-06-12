import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Instagram, Clock, ExternalLink, Share2, CalendarDays, Star, Music, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SEO, barberSchema } from '@/components/seo/SEO'
import { useBarber } from '@/hooks/use-barbers'
import { trackBarberView, trackReserveClick } from '@/lib/analytics'

// Datos extra por slug (mientras no estén en Supabase)
const barberExtras: Record<string, {
  years_at_lb?: number
  birthday?: string
  zodiac?: string
  fav_artist?: string
  hobby?: string
  available_days?: string
}> = {}

function getZodiacEmoji(sign?: string) {
  const map: Record<string, string> = {
    aries: '♈', tauro: '♉', geminis: '♊', cancer: '♋', leo: '♌', virgo: '♍',
    libra: '♎', escorpio: '♏', sagitario: '♐', capricornio: '♑', acuario: '♒', piscis: '♓',
  }
  return sign ? (map[sign.toLowerCase()] ?? '⭐') : '⭐'
}

const BarberProfile = () => {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { data: barber, isLoading, isError } = useBarber(slug)
  const extras = barberExtras[slug] ?? {}

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
          <div className="grid gap-10 lg:grid-cols-[4fr_8fr]">
            <div className="aspect-[3/4] rounded-sm bg-card animate-pulse" />
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
          <Button asChild variant="copper" className="mt-8">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  const agendaUrl = barber.agendapro_url || 'https://labarberia.agendapro.com/cl'

  const statCards = [
    extras.years_at_lb && { icon: '✦', label: 'Años en La Barbería', value: `${extras.years_at_lb} años` },
    barber.experience && { icon: '✂', label: 'Años de oficio', value: `${barber.experience} años` },
    extras.birthday && { icon: '🎂', label: 'Cumpleaños', value: extras.birthday },
    extras.zodiac && { icon: getZodiacEmoji(extras.zodiac), label: 'Signo zodiacal', value: extras.zodiac },
    extras.fav_artist && { icon: '🎵', label: 'Artista favorito', value: extras.fav_artist },
    extras.hobby && { icon: '⚡', label: 'Hobby', value: extras.hobby },
    extras.available_days && { icon: '📅', label: 'Días disponibles', value: extras.available_days },
    barber.instagram && { icon: '📸', label: 'Instagram', value: barber.instagram, isInstagram: true },
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${barber.name} — Barbero en Santiago`}
        description={barber.bio}
        canonical={`/barberos/${barber.slug}`}
        ogImage={barber.avatar_url}
        schema={barberSchema(barber)}
      />
      <Header />

      <div className="container-wide pt-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver
        </button>
      </div>

      <section className="container-wide pt-8 pb-16">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] items-start">

          {/* Foto — más compacta */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted shadow-elegant max-w-sm w-full">
            <img
              src={barber.avatar_url}
              alt={barber.name}
              width={480}
              height={640}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />

          </div>

          <div>
            {/* Sucursal + Nombre */}
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#9D9D9D] mb-1">{barber.chair}</p>
            <h1 className="display text-5xl md:text-7xl leading-[0.92] text-[#F7F4EF]">{barber.name}</h1>

            {barber.alias && (
              <p className="mt-2 text-sm italic text-[#9D9D9D]/50">&ldquo;{barber.alias}&rdquo;</p>
            )}

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/85">{barber.bio}</p>

            {/* Stat cards — datos curiosos */}
            {statCards.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {statCards.map((s: any) => (
                  <div key={s.label} className="rounded-sm border border-[#9D9D9D]/15 bg-[#111] p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base leading-none">{s.icon}</span>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#9D9D9D]/40">{s.label}</p>
                    </div>
                    {s.isInstagram ? (
                      <a
                        href={`https://instagram.com/${barber.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#9D9D9D] hover:underline"
                      >
                        {s.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-[#F7F4EF]">{s.value}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Botones B&N */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={agendaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackReserveClick(barber.name, 'profile')}
                className="inline-flex items-center gap-2 bg-[#F7F4EF] text-[#000000] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-8 py-3 hover:bg-white transition-colors"
              >
                Reservar con {barber.name.split(' ')[0]}
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 border border-[#F7F4EF]/20 text-[#F7F4EF] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-6 py-3 hover:border-[#F7F4EF]/60 transition-colors"
              >
                <Share2 className="h-4 w-4" /> Compartir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PORTAFOLIO */}
      {(barber as any).portfolio && (barber as any).portfolio.length > 0 && (
        <section className="container-wide py-16">
          <p className="eyebrow mb-3">Portafolio</p>
          <h2 className="display text-3xl md:text-5xl mb-8">Trabajo reciente</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {((barber as any).portfolio as string[]).map((p: string, i: number) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-sm bg-muted">
                <img
                  src={p}
                  alt={`Trabajo ${i + 1} de ${barber.name}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default BarberProfile
