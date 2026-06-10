// ─── GA4 event helpers ────────────────────────────────────────────────────────
// GTM / GA4 must be installed via index.html (GTM snippet)
// These helpers push to the dataLayer for GTM to pick up.

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

function push(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event, ...params })
}

// ─── Events ──────────────────────────────────────────────────────────────────

/** Fired when user views a barber profile */
export function trackBarberView(barberName: string, barberSlug: string) {
  push('barber_view', { barber_name: barberName, barber_slug: barberSlug })
}

/** Fired when user clicks "Reservar" on a barber profile → opens AgendaPro */
export function trackReserveClick(barberName: string, source: 'profile' | 'card' | 'home') {
  push('reserve_click', { barber_name: barberName, click_source: source })
}

/** Fired when user clicks a style filter on /barberos */
export function trackStyleFilter(style: string) {
  push('style_filter', { style_name: style })
}

/** Fired on WhatsApp / map / Instagram link clicks */
export function trackExternalLink(destination: string) {
  push('external_link_click', { destination })
}
