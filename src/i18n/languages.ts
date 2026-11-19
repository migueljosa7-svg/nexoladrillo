/**
 * ÚNICA fuente de verdad de los idiomas de la web.
 * Para añadir uno nuevo:
 *   1) añade su entrada aquí,
 *   2) crea src/i18n/locales/<code>.ts (copia es.ts y traduce; TypeScript avisa si falta alguna clave),
 *   3) regístralo en src/i18n/locales/index.ts,
 *   4) añádelo a public/sitemap.xml.
 */
export const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr', locale: 'es-ES', og: 'es_ES' },
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr', locale: 'en-GB', og: 'en_GB' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr', locale: 'fr-FR', og: 'fr_FR' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr', locale: 'de-DE', og: 'de_DE' },
  { code: 'pt', label: 'Português', flag: '🇵🇹', dir: 'ltr', locale: 'pt-PT', og: 'pt_PT' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr', locale: 'it-IT', og: 'it_IT' },
] as const

export type UiLang = (typeof LANGUAGES)[number]['code']
export const UI_LANGS = LANGUAGES.map((l) => l.code) as UiLang[]
export const DEFAULT_LANG: UiLang = 'es'
export const getLanguage = (code: UiLang) => LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]

export function langFromPath(path: string): UiLang {
  const seg = path.split('/').filter(Boolean)[0]
  return (UI_LANGS as string[]).includes(seg) ? (seg as UiLang) : DEFAULT_LANG
}
/** Idioma inicial: ruta > preferencia guardada > idioma del navegador > español. */
export function detectLang(): UiLang {
  const seg = window.location.pathname.split('/').filter(Boolean)[0]
  if (seg && (UI_LANGS as string[]).includes(seg)) return seg as UiLang
  return DEFAULT_LANG
}
