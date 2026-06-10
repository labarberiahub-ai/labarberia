import { useState } from 'react'
import { Scissors } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BarberCard from '@/components/BarberCard'
import { SEO } from '@/components/seo/SEO'
import { useBarbers, useStyles } from '@/hooks/use-barbers'
import { trackStyleFilter } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const Barbers = () => {
  const [activeStyle, setActiveStyle] = useState<string | null>(null)
  const { data: barbers = [], isLoading } = useBarbers(activeStyle ?? undefined)
  const { data: styles = [] } = useStyles()

  const handleStyleClick = (style: string | null) => {
    setActiveStyle(style)
    if (style) trackStyleFilter(style)
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Barberos en Santiago"
        description="Conoce a todos los barberos residentes de La Barbería. Filtra por estilo y reserva directamente con quien más te represente."
        canonical="/barberos"
      />
      <Header />

      <section className="container-wide pt-12 pb-24">
        <div className="mb-12">
          <p className="eyebrow mb-3">Talento residente</p>
          <h1 className="display text-5xl md:text-7xl">Elige con quién atenderte</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Cada barbero tiene su propio estilo y agenda. Reserva directo con quien más te represente.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => handleStyleClick(null)}
            className={cn(
              'rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all',
              activeStyle === null
                ? 'bg-gradient-copper text-ink border-transparent font-semibold'
                : 'border-border text-foreground/80 hover:border-primary/60 hover:text-primary'
            )}
          >
            Todos
          </button>
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => handleStyleClick(activeStyle === s ? null : s)}
              className={cn(
                'rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all',
                activeStyle === s
                  ? 'bg-gradient-copper text-ink border-transparent font-semibold'
                  : 'border-border text-foreground/80 hover:border-primary/60 hover:text-primary'
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-sm bg-card animate-pulse" />
            ))}
          </div>
        ) : barbers.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border p-16 text-center">
            <Scissors className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <p className="display text-3xl text-muted-foreground">Sin resultados</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {barbers.map((b, i) => (
              <BarberCard key={b.id} barber={b} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default Barbers
