import { LANGUAGES, UI_LANGS, getLanguage, type UiLang } from './i18n/languages'

/** Dominio público. Cámbialo aquí, en public/robots.txt, public/sitemap.xml e index.html al desplegar. */
export const SITE_URL = 'https://tu-dominio.vercel.app'
export const SITE_NAME = 'NexoLadrillo'
export const CONTACT_EMAIL = 'hola@tu-dominio.vercel.app'

export { LANGUAGES, UI_LANGS }
export type { UiLang }

export const OG_LOCALE = (l: UiLang) => getLanguage(l).og
export const langPath = (l: UiLang) => (l === 'es' ? '/' : `/${l}`)
export const langUrl = (l: UiLang) => `${SITE_URL}${l === 'es' ? '/' : `/${l}`}`
