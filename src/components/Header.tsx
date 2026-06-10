import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'

const navLinks = [
  { hash: 'barberos',    label: 'Barberos' },
  { hash: 'servicios',   label: 'Servicios' },
  { hash: 'portafolio',  label: 'Portafolio' },
  { hash: 'ubicaciones', label: 'Ubicaciones' },
  { hash: 'franquicia',  label: 'Franquicia' },
  { hash: 'contacto',    label: 'Contacto' },
]

const AGENDAPRO_URL = 'https://labarberia.agendapro.com/cl'

const Header = () => {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const goToSection = (hash: string) => {
    setOpen(false)
    if (pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(`/#${hash}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between md:h-20">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <button
              key={l.hash}
              onClick={() => goToSection(l.hash)}
              className="text-[12px] uppercase tracking-[0.22em] text-[#F7F4EF] transition-colors hover:text-primary"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="copper" size="sm">
            <a href={AGENDAPRO_URL} target="_blank" rel="noopener noreferrer">
              Reservar hora
            </a>
          </Button>
        </div>

        <button
          className="lg:hidden text-foreground p-2"
          onClick={() => setOpen((s) => !s)}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden animate-fade-in">
          <div className="container-wide flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <button
                key={l.hash}
                onClick={() => goToSection(l.hash)}
                className="py-3 text-left text-sm uppercase tracking-[0.18em] text-[#F7F4EF]"
              >
                {l.label}
              </button>
            ))}
            <Button asChild variant="copper" className="mt-3">
              <a href={AGENDAPRO_URL} target="_blank" rel="noopener noreferrer">
                Reservar hora
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
