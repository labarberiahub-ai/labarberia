import { useLocation } from 'react-router-dom'
import { Instagram, Phone, MapPin, Clock } from 'lucide-react'
import Logo from './Logo'
import { trackExternalLink } from '@/lib/analytics'

const Footer = () => {
  const { pathname } = useLocation()
  if (pathname.startsWith('/dashboard')) return null

  return (
    <footer style={{ borderTop: '1px solid #45454533', background: '#000000' }}>
      <div className="container-wide py-14">
        <div className="grid gap-10 md:grid-cols-3 items-start">

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed max-w-xs" style={{ color: '#F7F4EF99' }}>
              Un hub donde el talento independiente encuentra silla, marca y comunidad.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <p className="text-[11px] uppercase tracking-[0.25em] font-medium" style={{ color: '#9D9D9D' }}>◆ Contacto</p>
            <a href="https://www.instagram.com/labarberiacl/" target="_blank" rel="noopener noreferrer"
              onClick={() => trackExternalLink('instagram_footer')}
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
              style={{ color: '#F7F4EF' }}>
              <Instagram className="h-4 w-4" /> @labarberiacl
            </a>
            <a href="tel:+56989750668"
              onClick={() => trackExternalLink('phone_footer')}
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
              style={{ color: '#F7F4EF' }}>
              <Phone className="h-4 w-4" /> +56 9 8975 0668
            </a>
            <a href="mailto:info@labarberia.cl"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
              style={{ color: '#F7F4EF' }}>
              info@labarberia.cl
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4">
            <p className="text-[11px] uppercase tracking-[0.25em] font-medium" style={{ color: '#9D9D9D' }}>◆ Horario</p>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#F7F4EF' }}>
              <Clock className="h-4 w-4" style={{ color: '#9D9D9D' }} />
              Lun – Sáb · 10:00 – 21:00
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#F7F4EF' }}>
              <MapPin className="h-4 w-4" style={{ color: '#9D9D9D' }} />
              5 locales en Santiago
            </div>
            <a href="https://labarberia.agendapro.com/cl" target="_blank" rel="noopener noreferrer"
              onClick={() => trackExternalLink('agendapro_footer')}
              className="text-[11px] uppercase tracking-[0.2em] hover:underline mt-1 transition-colors"
              style={{ color: '#CDCDCD' }}>
              Reservar hora →
            </a>
          </div>
        </div>

        <div className="mt-12 pt-5 flex flex-col gap-2 text-[11px] md:flex-row md:items-center md:justify-between"
          style={{ borderTop: '1px solid #45454533', color: '#F7F4EF44' }}>
          <p>© {new Date().getFullYear()} La Barbería · Todos los derechos reservados.</p>
          <p className="display tracking-[0.28em]">EST. 2014 — SANTIAGO DE CHILE</p>
          <p className="uppercase tracking-[0.18em] md:text-right">
            Desarrollado por{' '}
            <a href="https://www.kvras.cl" target="_blank" rel="noopener noreferrer"
              className="font-semibold hover:underline" style={{ color: '#CDCDCD' }}>
              KVRAS
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
