# La Barbería — Sitio web

Stack: Vite + React + TypeScript · Supabase · Vercel

## Setup local

```bash
# 1. Clonar
git clone https://github.com/tu-usuario/labarberia

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.example .env.local
# → completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# 4. Base de datos
# Ir a Supabase Dashboard → SQL Editor → pegar supabase/schema.sql

# 5. Dev
npm run dev
```

## Deploy (Vercel)

1. Conectar repositorio en vercel.com
2. Agregar variables de entorno en Vercel → Settings → Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Cada push a `main` despliega automáticamente

## Estructura

```
src/
  components/
    seo/          ← SEO.tsx (react-helmet-async + Schema.org)
    Header.tsx
    Footer.tsx
    BarberCard.tsx
  hooks/
    use-barbers.ts  ← queries a Supabase
  lib/
    supabase.ts     ← cliente + tipos
    analytics.ts    ← eventos GA4 vía dataLayer
    utils.ts
  pages/
    Index.tsx       ← Home con SEO
    Barbers.tsx     ← Marketplace
    BarberProfile.tsx ← Perfil individual
    NotFound.tsx
supabase/
  schema.sql        ← Ejecutar en Supabase SQL Editor
public/
  robots.txt
.env.example        ← Template de variables
```

## Administración de contenido

El dueño edita **directamente en Supabase Table Editor**:
- `barbers` → agregar/editar/desactivar barberos (`active = false`)
- `services` → cambiar precios y duración por barbero

Para desactivar un barbero sin borrarlo: `active = false`

## SEO

- `react-helmet-async` con meta tags dinámicos por ruta
- Schema.org: `LocalBusiness` en home, `Person` en perfil de barbero
- `robots.txt` configurado
- GTM listo para activar en `index.html`

## Analytics

Eventos trackeados vía `dataLayer` (GTM):
- `barber_view` — al ver perfil
- `reserve_click` — al hacer clic en Reservar
- `style_filter` — al filtrar por estilo
- `external_link_click` — maps, Instagram, teléfono
