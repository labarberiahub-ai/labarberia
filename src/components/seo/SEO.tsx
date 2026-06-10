import { Helmet } from 'react-helmet-async'

type SEOProps = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  schema?: object
}

const SITE_NAME = 'La Barbería'
const BASE_URL = 'https://labarberia.cl'
const DEFAULT_DESC = 'Reserva con los mejores barberos de Santiago. Elige por estilo, no por turno. 4 locales en Providencia, Las Condes y La Reina.'
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`

export function SEO({ title, description, canonical, ogImage, schema }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Hub de Barberos en Santiago`
  const desc = description ?? DEFAULT_DESC
  const image = ogImage ?? DEFAULT_IMAGE
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_CL" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}

// ─── Pre-built schemas ────────────────────────────────────────────────────────

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: 'La Barbería',
  description: DEFAULT_DESC,
  url: BASE_URL,
  telephone: '+56912345678',
  image: DEFAULT_IMAGE,
  priceRange: '$$',
  servesCuisine: undefined,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '21:00',
    },
  ],
  location: [
    { '@type': 'Place', name: 'Providencia · Condell', address: { '@type': 'PostalAddress', streetAddress: 'Condell 1166, Local 1158', addressLocality: 'Providencia', addressRegion: 'RM', addressCountry: 'CL' } },
    { '@type': 'Place', name: 'Las Condes · Padre Hurtado', address: { '@type': 'PostalAddress', streetAddress: 'Padre Hurtado Central 1531, Local 2B', addressLocality: 'Las Condes', addressRegion: 'RM', addressCountry: 'CL' } },
    { '@type': 'Place', name: 'Providencia · Manuel Montt', address: { '@type': 'PostalAddress', streetAddress: 'Manuel Montt 1221', addressLocality: 'Providencia', addressRegion: 'RM', addressCountry: 'CL' } },
    { '@type': 'Place', name: 'La Reina · Príncipe de Gales', address: { '@type': 'PostalAddress', streetAddress: 'Av. Príncipe de Gales 5921, Local 103', addressLocality: 'La Reina', addressRegion: 'RM', addressCountry: 'CL' } },
  ],
  sameAs: ['https://www.instagram.com/labarberia.cl'],
}

export function barberSchema(barber: { name: string; bio: string; slug: string; avatar_url: string; rating: number; review_count: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: barber.name,
    description: barber.bio,
    url: `${BASE_URL}/barberos/${barber.slug}`,
    image: barber.avatar_url,
    jobTitle: 'Barbero',
    worksFor: { '@type': 'Organization', name: 'La Barbería' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: barber.rating,
      reviewCount: barber.review_count,
      bestRating: 5,
    },
  }
}
