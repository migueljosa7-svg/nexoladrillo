/** Dominio público. Cámbialo aquí, en public/robots.txt, public/sitemap.xml e index.html al desplegar. */
export const SITE_URL = 'https://tu-dominio.vercel.app'
export const SITE_NAME = 'NexoLadrillo'
export const CONTACT_EMAIL = 'hola@tu-dominio.vercel.app'

/** Idiomas de la propia web (rutas / /en /fr /de /pt /it). */
export const UI_LANGS = ['es', 'en', 'fr', 'de', 'pt', 'it'] as const
export type UiLang = (typeof UI_LANGS)[number]

export const OG_LOCALE: Record<UiLang, string> = {
  es: 'es_ES', en: 'en_US', fr: 'fr_FR', de: 'de_DE', pt: 'pt_PT', it: 'it_IT',
}

export const langPath = (l: UiLang) => (l === 'es' ? '/' : `/${l}`)
export const langUrl = (l: UiLang) => `${SITE_URL}${l === 'es' ? '/' : `/${l}`}`
