import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowRight, MapPin, Calendar, Clock, MessageCircle, Send, Upload, ChevronRight, ChevronUp, Star, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BarberCard from '@/components/BarberCard'
import { SEO, localBusinessSchema } from '@/components/seo/SEO'
import { useBarbers } from '@/hooks/use-barbers'
import { trackReserveClick, trackExternalLink } from '@/lib/analytics'
import { formatCLP } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ── HERO PHOTO — reemplazar por la nueva foto cuando esté disponible ──────────
// TODO: sube la nueva foto al bucket de Supabase (barberos/locales/hero/hero-new.jpg)
// y actualiza esta URL
const heroShop = 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/slide_montt.jpg'

const AGENDAPRO_URL = 'https://labarberia.agendapro.com/cl'
const WHATSAPP_URL  = 'https://wa.me/56989750668'

// ── Servicios ─────────────────────────────────────────────────────────────────
const serviceCatalog = [
  { name: 'Corte de Cabello',           duration: 40, price: 20990, desc: 'Asesoría, corte y lavado de cabello. Incluye peinado con pomada a elección.' },
  { name: 'Perfilado de Barba',         duration: 40, price: 20990, desc: 'Asesoría, arreglo de barba, aplicación de toalla caliente, aceite y limpieza facial.' },
  { name: 'Cabello + Barba',            duration: 70, price: 30990, desc: 'Disfruta el corte de cabello más el perfilado de barba a un precio preferencial.' },
  { name: 'Corte de Cabello Premium',   duration: 60, price: 24990, desc: 'Skin fade o degradado quirúrgico con diseño personalizado y hair tattoo.' },
  { name: 'Membresía Corte de Cabello', duration: 40, price: null,  desc: 'Acceso mensual ilimitado a cortes de cabello. Consulta condiciones con tu barbero.' },
  { name: 'Gift Card Corte de Cabello', duration: null, price: null, desc: 'Regala una experiencia. Válida para cualquier servicio de corte en todos nuestros locales.' },
]

// ── Marquee ───────────────────────────────────────────────────────────────────
const marqueeItems = [
  'Corte de Cabello',
  'Perfilado de Barba',
  'Cabello + Barba',
  'Corte Premium',
  'Membresía',
  'Gift Card',
]

// ── Locales ───────────────────────────────────────────────────────────────────
const locations = [
  { name: 'Consistorial',     label: 'Sucursal Consistorial',    street: 'Los Presidentes 8220, local 15',         area: 'Peñalolén, RM',    maps: 'https://www.google.com/maps/search/?api=1&query=Los+Presidentes+8220+local+15+Peñalolén' },
  { name: 'Barrio Italia',    label: 'Sucursal Barrio Italia',   street: 'Condell 1166, local 104',                area: 'Providencia, RM',   maps: 'https://www.google.com/maps/place/Condell+1166,+Local+1158,+7501422+Providencia,+Región+Metropolitana/@-33.4454545,-70.6263953,17z' },
  { name: 'Los Dominicos',    label: 'Sucursal Los Dominicos',   street: 'Padre Hurtado Central 1531, local 2B',   area: 'Las Condes, RM',    maps: 'https://www.google.com/maps/place/Padre+Hurtado+Central+1531,+local+2B,+7561052+Las+Condes,+Región+Metropolitana/@-33.4056003,-70.544054,17z' },
  { name: 'Manuel Montt',     label: 'Sucursal Manuel Montt',    street: 'Manuel Montt 1221, local 202',           area: 'Providencia, RM',   maps: 'https://www.google.com/maps/place/Av.+Manuel+Montt+1221,+Providencia,+Región+Metropolitana/@-33.4390756,-70.6179829,17z' },
  { name: 'Príncipe de Gales',label: 'Sucursal Príncipe de Gales', street: 'Príncipe de Gales 5921, local 104',   area: 'La Reina, RM',      maps: 'https://www.google.com/maps/search/?api=1&query=Príncipe+de+Gales+5921+local+104+La+Reina' },
]

// ── Fotos de locales ──────────────────────────────────────────────────────────
const allLocalPhotos = [
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/barrioitalia/foto-1.jpg',    alt: 'Barrio Italia',      local: 'Barrio Italia' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/barrioitalia/foto-2.jpg',    alt: 'Barrio Italia',      local: 'Barrio Italia' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/barrioitalia/foto-3.jpg',    alt: 'Barrio Italia',      local: 'Barrio Italia' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/barrioitalia/foto-4.jpg',    alt: 'Barrio Italia',      local: 'Barrio Italia' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/losdominicos/foto-1.jpg',    alt: 'Los Dominicos',      local: 'Los Dominicos' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/losdominicos/foto-2.jpg',    alt: 'Los Dominicos',      local: 'Los Dominicos' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/losdominicos/foto-3.jpg',    alt: 'Los Dominicos',      local: 'Los Dominicos' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/losdominicos/foto-4.jpg',    alt: 'Los Dominicos',      local: 'Los Dominicos' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/manuelmontt/foto-1.jpg',     alt: 'Manuel Montt',       local: 'Manuel Montt' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/manuelmontt/foto-2.jpg',     alt: 'Manuel Montt',       local: 'Manuel Montt' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/manuelmontt/foto-3.jpg',     alt: 'Manuel Montt',       local: 'Manuel Montt' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/manuelmontt/foto-4.jpg',     alt: 'Manuel Montt',       local: 'Manuel Montt' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/principedegales/foto-1.jpg', alt: 'Príncipe de Gales',  local: 'Príncipe de Gales' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/principedegales/foto-2.jpeg',alt: 'Príncipe de Gales',  local: 'Príncipe de Gales' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/principedegales/foto-3.jpeg',alt: 'Príncipe de Gales',  local: 'Príncipe de Gales' },
  { src: 'https://mwymquhbuljossskekoj.supabase.co/storage/v1/object/public/barberos/locales/principedegales/foto-4.jpeg',alt: 'Príncipe de Gales',  local: 'Príncipe de Gales' },
]

const localTabs = ['Todos', 'Barrio Italia', 'Los Dominicos', 'Manuel Montt', 'Príncipe de Gales']

// ── Tabs de barberos por local (orden solicitado) ─────────────────────────────
const localesTabs = [
  { label: 'Consistorial',    value: 'Consistorial' },
  { label: 'Barrio Italia',   value: 'Barrio Italia' },
  { label: 'Los Dominicos',   value: 'Los Dominicos' },
  { label: 'Manuel Montt',    value: 'Manuel Montt' },
  { label: 'Príncipe de Gales', value: 'Príncipe de Gales' },
]

// ── Reviews (hasta que se puedan extraer de Google) ───────────────────────────
const googleReviews = [
  { author: 'Sebastián M.',  rating: 5, text: 'Increíble ambiente y atención de primer nivel. Salí con el mejor corte que he tenido en años. Totalmente recomendado.', local: 'Manuel Montt' },
  { author: 'Felipe R.',     rating: 5, text: 'El equipo es muy profesional. Me atendieron rápido y el resultado fue impecable. Definitivamente vuelvo.', local: 'Barrio Italia' },
  { author: 'Matías C.',     rating: 5, text: 'El mejor lugar para cortarse el pelo en Santiago. Ambiente genial, barberos de lujo y precios justos.', local: 'Los Dominicos' },
  { author: 'Andrés P.',     rating: 5, text: 'Me cambié de barbero después de 5 años y no me arrepiento. Excelente corte, buena música y trato de calidad.', local: 'Príncipe de Gales' },
  { author: 'Cristóbal V.',  rating: 5, text: 'Primera vez que voy y quedé encantado. El barbero entendió exactamente lo que quería. 10 de 10.', local: 'Consistorial' },
]

const Index = () => {
  const { hash } = useLocation()
  const [activeLocal, setActiveLocal] = useState('Consistorial')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [activeLocalPhoto, setActiveLocalPhoto] = useState('Todos')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [contactSent, setContactSent] = useState(false)
  const [cvSent, setCvSent] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const localPhotos = activeLocalPhoto === 'Todos'
    ? allLocalPhotos
    : allLocalPhotos.filter(p => p.local === activeLocalPhoto)

  const { data: barbers = [], isLoading } = useBarbers(activeLocal)

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [hash])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-rotate reviews
  useEffect(() => {
    const t = setInterval(() => setReviewIndex(i => (i + 1) % googleReviews.length), 5000)
    return () => clearInterval(t)
  }, [])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Contacto desde labarberia.cl — ${contactForm.name}`)
    const body    = encodeURIComponent(`Nombre: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMensaje:\n${contactForm.message}`)
    window.open(`mailto:info@labarberia.cl?subject=${subject}&body=${body}`)
    setContactSent(true)
    setContactForm({ name: '', email: '', message: '' })
  }

  const handleCvSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cvFile) return
    const subject = encodeURIComponent('Postulación — CV desde labarberia.cl')
    const body    = encodeURIComponent(`Postulante adjunta su CV: ${cvFile.name}\n\nPor favor revisar el archivo adjunto.`)
    window.open(`mailto:info@labarberia.cl?subject=${subject}&body=${body}`)
    setCvSent(true)
    setCvFile(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO schema={localBusinessSchema} />
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        <img src={heroShop} alt="Interior de La Barbería" width={1920} height={1080}
          fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'rgba(13,10,7,0.80)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")', opacity: 0.4 }} />

        <div className="container-wide relative z-10 flex h-full flex-col justify-center pb-20">
          <div className="flex items-center gap-3 mb-6 animate-fade-up">
            <p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              ◆ SANTIAGO DE CHILE · DESDE EL 2014 ◆
            </p>
          </div>

          <h1 className="display leading-[0.92] text-bone animate-fade-up" style={{ animationDelay: '100ms' }}>
            <span className="block whitespace-nowrap" style={{ fontSize: 'clamp(2.5rem, 6vw, 6.5rem)', lineHeight: 1 }}>
              SOMOS LA BARBERÍA
            </span>
            <span className="block" style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.2rem, 3vw, 3.2rem)', lineHeight: 1.1, color: '#9D9D9D' }}>
              Hub de barberos profesionales
            </span>
          </h1>

          <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Button asChild size="lg" className="bg-[#F7F4EF] text-[#000000] font-semibold uppercase tracking-[0.15em] hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all rounded-sm px-8">
              <a href="#barberos">
                Reservar hora
              </a>
            </Button>
          </div>
        </div>

      </section>

      {/* ── STATS / HUB CONCEPT ──────────────────────────────────────────── */}
      <section className="container-wide py-20 md:py-28">
        <div className="grid gap-4 md:grid-cols-2 mb-16">
          <div>
            <p className="eyebrow mb-3" style={{ color: '#F7F4EF' }}>◆ El concepto HUB</p>
            <h2 className="display text-4xl md:text-6xl text-[#F7F4EF]">
              Un espacio donde el talento<br />
              <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400 }} className="text-[#9D9D9D]">
                independiente florece</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-[#9D9D9D] leading-relaxed max-w-md">
              La Barbería no es solo un lugar donde cortarse el pelo. Es una plataforma donde barberos independientes de excelencia encuentran silla, comunidad, marca y clientes. Cada barbero es su propio negocio — nosotros ponemos el espacio, el estilo y la cultura</p>
          </div>
        </div>

        <div className="grid gap-px bg-[#9D9D9D]/10 border border-[#9D9D9D]/10 md:grid-cols-4">
          {[
            { k: '+16',   l: 'Barberos residentes',     d: 'Talento cuidadosamente seleccionado' },
            { k: '5',     l: 'Locales en Santiago',     d: 'Estratégicamente localizados' },
            { k: '+2.000', l: 'Clientes satisfechos',   d: 'Calidad en cada servicio' },
            { k: '10',    l: 'Años en el mercado',      d: 'Excelencia y tradición en cada servicio' },
          ].map((s) => (
            <div key={s.l} className="bg-background p-8">
              <p className="display text-5xl md:text-6xl text-[#9D9D9D] leading-none">{s.k}</p>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[#F7F4EF]">{s.l}</p>
              <p className="mt-1 text-xs text-[#9D9D9D]/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GOOGLE REVIEWS ───────────────────────────────────────────────── */}
      <section className="bg-[#000000] border-y border-[#9D9D9D]/10 py-16">
        <div className="container-wide">
          {/* Header Opción B — score grande + info */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center mb-10">
            <div className="flex items-center gap-6 border-r border-[#9D9D9D]/10 pr-8 shrink-0">
              <div className="text-center">
                <p className="display text-6xl md:text-7xl text-[#F7F4EF] leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>5.0</p>
                <div className="flex justify-center gap-1 my-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[#9D9D9D] text-[#9D9D9D]" />)}
                </div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#9D9D9D]/50">Google</p>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3" style={{ color: '#F7F4EF' }}>◆ Lo que dicen</p>
              <h2 className="display text-3xl md:text-5xl text-[#F7F4EF]">+2.600 reseñas verificadas</h2>
              <p className="mt-2 text-sm text-[#9D9D9D]/60">La opinión de miles de clientes que ya eligieron a su barbero en La Barbería</p>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {googleReviews.slice(0, 3).map((review, i) => (
              <div key={i} className="rounded-sm border border-[#9D9D9D]/12 bg-[#111] p-6">
                <p className="text-sm leading-relaxed text-[#F7F4EF]/75 italic mb-6">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#9D9D9D]/10">
                  <div>
                    <p className="text-sm font-semibold text-[#F7F4EF]">{review.author}</p>
                    <p className="text-[10px] text-[#9D9D9D] uppercase tracking-[0.15em] mt-0.5">{review.local}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-3 w-3 fill-[#9D9D9D] text-[#9D9D9D]" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BARBEROS POR LOCAL ────────────────────────────────────────────── */}
      <section id="barberos" className="container-wide py-16 scroll-mt-24">
        <div className="mb-10">
          <p className="eyebrow mb-3">◆ Talento residente</p>
          <h2 className="display text-4xl md:text-6xl">Elige con quién atenderte</h2>
          <p className="mt-3 max-w-xl text-[#9D9D9D]/70">
            Cada barbero tiene su propio sello y estilo y agenda. Reserva con quien más te represente</p>
        </div>

        {/* Tabs por local */}
        <div className="mb-8 flex flex-wrap gap-2">
          {localesTabs.map((loc) => (
            <button key={loc.value} onClick={() => setActiveLocal(loc.value)}
              className={cn('rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all',
                activeLocal === loc.value
                  ? 'bg-[#374151] text-[#000000] border-transparent font-semibold'
                  : 'border-[#9D9D9D]/20 text-[#F7F4EF]/70 hover:border-[#9D9D9D]/60 hover:text-[#9D9D9D]'
              )}>
              {loc.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-sm bg-card animate-pulse" />)}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {barbers.map((b, i) => <BarberCard key={b.id} barber={b} index={i} />)}
          </div>
        )}
      </section>

      {/* ── SERVICIOS ────────────────────────────────────────────────────── */}
      <section id="servicios" className="bg-[#000000] border-y border-[#9D9D9D]/10 mt-16 scroll-mt-24">
        <div className="container-wide py-20 md:py-28">
          <div className="mb-12">
            <p className="eyebrow mb-3">◆ Servicios</p>
            <h2 className="display text-4xl md:text-6xl max-w-3xl">
              Lo que hacemos,{' '}
              <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400 }} className="text-[#9D9D9D]">
                bien hecho</span>
            </h2>
            <p className="mt-3 max-w-xl text-[#9D9D9D]/60">
              Resultados consistentes y atención excepcional. Sin complicaciones ni atajos. Solo calidad</p>
          </div>

          <div className="grid gap-px bg-[#9D9D9D]/10 border border-[#9D9D9D]/10 md:grid-cols-2 lg:grid-cols-3">
            {serviceCatalog.map((srv) => (
              <div key={srv.name} className="group bg-[#000000] p-6 hover:bg-[#111]/80 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#9D9D9D] text-xs">◆</span>
                  <h3 className="display text-2xl text-[#F7F4EF]">{srv.name}</h3>
                </div>
                <p className="text-sm text-[#9D9D9D]/60 leading-relaxed mb-4">{srv.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D]/50">
                    {srv.duration && <><Clock className="h-3.5 w-3.5" /> {srv.duration} min</>}
                  </div>
                  {srv.price ? (
                    <p className="display text-2xl text-[#9D9D9D]">{formatCLP(srv.price)}</p>
                  ) : (
                    <p className="text-xs uppercase tracking-[0.18em] text-[#9D9D9D]">Consultar</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a href={AGENDAPRO_URL} target="_blank" rel="noopener noreferrer"
              onClick={() => trackReserveClick('general', 'home')}
              className="inline-flex items-center gap-2 bg-[#F7F4EF] text-[#000000] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-8 py-3 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
              VER TODOS NUESTROS SERVICIOS <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── PORTAFOLIO (fotos de locales) ─────────────────────────────────── */}
      <section id="portafolio" className="container-wide py-20 md:py-28 scroll-mt-24">
        <div className="mb-8">
          <p className="eyebrow mb-3">◆ Nuestros locales</p>
          <h2 className="display text-4xl md:text-6xl">Los espacios del hub</h2>
          <p className="mt-3 max-w-xl text-[#9D9D9D]/60">
            Cinco locales diseñados para la experiencia de barbería clásica premium</p>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {localTabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveLocalPhoto(tab); setCarouselIndex(0) }}
              className={cn('rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-all',
                activeLocalPhoto === tab
                  ? 'bg-[#374151] text-[#000000] border-transparent font-semibold'
                  : 'border-[#9D9D9D]/20 text-[#F7F4EF]/70 hover:border-[#9D9D9D]/60 hover:text-[#9D9D9D]'
              )}>
              {tab}
            </button>
          ))}
        </div>

        <div className="relative aspect-[16/7] overflow-hidden rounded-sm bg-[#111] mb-3">
          <img src={localPhotos[carouselIndex]?.src} alt={localPhotos[carouselIndex]?.alt}
            className="h-full w-full object-cover transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000]/60 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D]">◆ {localPhotos[carouselIndex]?.local}</p>
            <p className="text-xs text-[#F7F4EF]/60 mt-1">{carouselIndex + 1} / {localPhotos.length}</p>
          </div>
          <button onClick={() => setCarouselIndex(i => (i - 1 + localPhotos.length) % localPhotos.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-sm bg-[#000]/60 text-[#9D9D9D] hover:bg-[#9D9D9D] hover:text-[#000] transition-all text-xl">‹</button>
          <button onClick={() => setCarouselIndex(i => (i + 1) % localPhotos.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-sm bg-[#000]/60 text-[#9D9D9D] hover:bg-[#9D9D9D] hover:text-[#000] transition-all text-xl">›</button>
        </div>

        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
          {localPhotos.map((p, i) => (
            <button key={i} onClick={() => setCarouselIndex(i)}
              className={cn('relative aspect-square overflow-hidden rounded-sm transition-all',
                carouselIndex === i ? 'ring-2 ring-[#9D9D9D] opacity-100' : 'opacity-50 hover:opacity-80')}>
              <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* ── UBICACIONES ──────────────────────────────────────────────────── */}
      <section id="ubicaciones" className="container-wide py-20 md:py-28 scroll-mt-24">
        <div className="mb-12">
          <p className="eyebrow mb-3">◆ Ubicaciones</p>
          <h2 className="display text-4xl md:text-6xl">
            5 sucursales en Santiago,{' '}
            <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400 }} className="text-[#9D9D9D]">
              la misma calidad</span>
          </h2>
          <p className="mt-3 max-w-xl text-[#9D9D9D]/60">
            Presencia en sectores estratégicos de Santiago. Mismo servicio. Más cerca de ti</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <a key={loc.name} href={loc.maps} target="_blank" rel="noopener noreferrer"
              onClick={() => trackExternalLink(`map_${loc.name}`)}
              className="group block rounded-sm border border-[#9D9D9D]/10 bg-[#000000] p-6 hover:border-[#9D9D9D]/40 transition-all">
              <div className="flex items-start justify-between mb-4">
                <MapPin className="h-5 w-5 text-[#9D9D9D]" />
                <span className="text-[#9D9D9D] text-xs group-hover:translate-x-1 transition-transform">◆</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9D9D9D]/60 mb-1">{loc.label}</p>
              <p className="display text-2xl leading-tight text-[#F7F4EF]">{loc.name}</p>
              <p className="mt-3 text-sm text-[#F7F4EF]/70">{loc.street}</p>
              <p className="text-xs text-[#9D9D9D]/50">{loc.area}</p>
              <div className="mt-5 text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D]">Ver en mapa →</div>
            </a>
          ))}

          {/* 6to local */}
          <div className="rounded-sm border border-dashed border-[#9D9D9D]/30 bg-[#9D9D9D]/5 p-6 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#9D9D9D]/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#9D9D9D] font-semibold w-fit">
              ◆ 6º Local en camino
            </span>
            <p className="mt-4 display text-2xl leading-tight text-[#F7F4EF]">Próximamente</p>
            <p className="mt-3 text-sm text-[#F7F4EF]/60">
              Seguimos expandiendo el hub. Síguenos en Instagram para enterarte primero</p>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm text-[#9D9D9D]/50 border-t border-[#9D9D9D]/10 pt-6">
          <Calendar className="h-4 w-4 text-[#9D9D9D]" />
          <span>Abiertos todo el año, excepto feriados irrenunciables</span>
        </div>
      </section>

      {/* ── FRANQUICIA ───────────────────────────────────────────────────── */}
      <section id="franquicia" className="bg-[#000000] border-y border-[#9D9D9D]/10 scroll-mt-24">
        <div className="container-wide py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="eyebrow mb-3">◆ Franquicia</p>
              <h2 className="display text-4xl md:text-6xl text-[#F7F4EF]">
                Sé parte del{' '}
                <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400 }} className="text-[#9D9D9D]">
                  hub</span>
              </h2>
              <p className="mt-6 text-[#9D9D9D] leading-relaxed max-w-lg">
                La Barbería es más que un local — es un modelo de negocio probado. Con 10 años en el mercado, 5 sucursales y +2.000 clientes mensuales, abrimos nuestra red a emprendedores con visión</p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: '◆', t: 'Marca consolidada', d: 'Identidad visual, procesos y reputación ya construidos.' },
                  { icon: '◆', t: 'Modelo escalable', d: 'Gestión digital, agenda online y barberos independientes.' },
                  { icon: '◆', t: 'Soporte continuo', d: 'Capacitación, marketing y acompañamiento operacional.' },
                  { icon: '◆', t: 'Comunidad de barberos', d: 'Acceso a nuestra red de talento residente.' },
                ].map((item) => (
                  <li key={item.t} className="flex gap-4">
                    <span className="text-[#9D9D9D] mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#F7F4EF] uppercase tracking-[0.15em]">{item.t}</p>
                      <p className="text-xs text-[#9D9D9D]/60 mt-0.5">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#contacto"
                  className="inline-flex items-center gap-2 bg-[#F7F4EF] text-[#000000] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-8 py-3 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
                  Quiero saber más <ArrowRight className="h-4 w-4" />
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#9D9D9D]/30 text-[#9D9D9D] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-6 py-3 hover:border-[#9D9D9D] transition-colors">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Stats franquicia */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: '10', l: 'Años de trayectoria', d: 'Desde 2014 en Santiago' },
                { k: '5',  l: 'Locales activos',     d: 'Red en expansión' },
                { k: '+16', l: 'Barberos en la red', d: 'Talento independiente' },
                { k: '+2K', l: 'Clientes al mes',    d: 'Base fiel y creciente' },
              ].map((s) => (
                <div key={s.l} className="rounded-sm border border-[#9D9D9D]/10 bg-[#111] p-6">
                  <p className="display text-4xl text-[#9D9D9D] leading-none">{s.k}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.15em] text-[#F7F4EF]">{s.l}</p>
                  <p className="mt-1 text-xs text-[#9D9D9D]/50">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ─────────────────────────────────────────────────────── */}
      <section id="contacto" className="border-t border-[#9D9D9D]/10 scroll-mt-24">
        <div className="container-wide py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">◆ Contacto</p>
              <h2 className="display text-4xl md:text-5xl mb-8">Escríbenos</h2>
              {contactSent ? (
                <div className="rounded-sm border border-[#9D9D9D]/30 bg-[#9D9D9D]/10 p-8 text-center">
                  <p className="display text-3xl text-[#9D9D9D]">◆ Mensaje enviado</p>
                  <p className="mt-3 text-[#9D9D9D]/70">Te respondemos a la brevedad en info@labarberia.cl</p>
                  <button onClick={() => setContactSent(false)} className="mt-6 text-xs uppercase tracking-[0.2em] text-[#9D9D9D] hover:underline">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D]/60 block mb-2">Nombre</label>
                    <input required value={contactForm.name}
                      onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-sm border border-[#9D9D9D]/20 bg-[#111] px-4 py-3 text-sm text-[#F7F4EF] focus:border-[#9D9D9D]/60 focus:outline-none transition-colors"
                      placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D]/60 block mb-2">Email</label>
                    <input required type="email" value={contactForm.email}
                      onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-sm border border-[#9D9D9D]/20 bg-[#111] px-4 py-3 text-sm text-[#F7F4EF] focus:border-[#9D9D9D]/60 focus:outline-none transition-colors"
                      placeholder="tu@email.com" />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D]/60 block mb-2">Mensaje</label>
                    <textarea required rows={4} value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full rounded-sm border border-[#9D9D9D]/20 bg-[#111] px-4 py-3 text-sm text-[#F7F4EF] focus:border-[#9D9D9D]/60 focus:outline-none transition-colors resize-none"
                      placeholder="¿En qué podemos ayudarte?" />
                  </div>
                  <button type="submit"
                    className="inline-flex items-center gap-2 bg-[#F7F4EF] text-[#000000] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-8 py-3 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <Send className="h-4 w-4" /> Enviar mensaje
                  </button>
                </form>
              )}
            </div>

            <div>
              <p className="eyebrow mb-3">◆ Únete al hub</p>
              <h2 className="display text-4xl md:text-5xl mb-4">
                ¿Quieres trabajar<br />con nosotros?
              </h2>
              <p className="text-[#9D9D9D]/60 leading-relaxed mb-8">
                Si eres barbero y quieres ser parte del hub, o si buscas trabajo en cualquier rol en La Barbería, envíanos tu CV. Siempre estamos buscando talento</p>

              {cvSent ? (
                <div className="rounded-sm border border-[#9D9D9D]/30 bg-[#9D9D9D]/10 p-8 text-center">
                  <p className="display text-3xl text-[#9D9D9D]">◆ CV enviado</p>
                  <p className="mt-3 text-[#9D9D9D]/70">Lo revisamos y te contactamos si hay match</p>
                  <button onClick={() => setCvSent(false)} className="mt-6 text-xs uppercase tracking-[0.2em] text-[#9D9D9D] hover:underline">
                    Enviar otro
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCvSubmit} className="space-y-4">
                  <div onClick={() => fileRef.current?.click()}
                    className="cursor-pointer rounded-sm border border-dashed border-[#9D9D9D]/30 bg-[#9D9D9D]/5 p-8 text-center hover:border-[#9D9D9D]/60 transition-colors">
                    <Upload className="h-8 w-8 text-[#9D9D9D] mx-auto mb-3" />
                    <p className="text-[#F7F4EF] text-sm font-medium">
                      {cvFile ? cvFile.name : 'Haz clic para cargar tu CV'}
                    </p>
                    <p className="text-[#9D9D9D]/50 text-xs mt-1">PDF, DOC hasta 10MB</p>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                      onChange={e => setCvFile(e.target.files?.[0] ?? null)} />
                  </div>
                  <button type="submit" disabled={!cvFile}
                    className="inline-flex items-center gap-2 bg-[#F7F4EF] text-[#000000] font-semibold uppercase tracking-[0.15em] text-sm rounded-sm px-8 py-3 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight className="h-4 w-4" /> Enviar postulación
                  </button>
                </form>
              )}

              <div className="mt-8 border-t border-[#9D9D9D]/10 pt-6 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#9D9D9D]/40">O escríbenos directo</p>
                <a href="mailto:info@labarberia.cl" className="flex items-center gap-2 text-sm text-[#9D9D9D] hover:underline">
                  info@labarberia.cl
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackExternalLink('whatsapp_contacto')}
                  className="flex items-center gap-2 text-sm text-[#9D9D9D] hover:underline">
                  <MessageCircle className="h-4 w-4" /> +56 9 8975 0668
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── SCROLL TO TOP ─────────────────────────────────────────────────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-24 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-sm border border-[#9D9D9D]/30 bg-[#000000]/80 backdrop-blur text-[#9D9D9D] shadow-lg transition-all hover:border-[#9D9D9D] hover:bg-[#111]',
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        aria-label="Volver al inicio">
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Index
