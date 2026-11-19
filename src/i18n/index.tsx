import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_LANG, detectLang, getLanguage, langFromPath, type UiLang } from './languages'
import type { Messages } from './locales/es'
import { es } from './locales/es'
import { en } from './locales/en'
import { fr } from './locales/fr'
import { de } from './locales/de'
import { pt } from './locales/pt'
import { it } from './locales/it'

/** Registro de idiomas → textos. Añade aquí los nuevos idiomas. */
export const LOCALES: Record<UiLang, Messages> = { es, en, fr, de, pt, it }

export const interpolate = (s: string, vars: Record<string, string | number> = {}) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))

const pathFor = (l: UiLang) => (l === DEFAULT_LANG ? '/' : `/${l}`)

interface Ctx {
  lang: UiLang
  m: Messages
  setLang: (l: UiLang) => void
  t: (s: string, vars?: Record<string, string | number>) => string
  eur: (n: number) => string
  num: (n: number, max?: number) => string
  km: (km: number) => string
}
const I18nContext = createContext<Ctx | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UiLang>(() => detectLang())

  useEffect(() => {
    const onPop = () => setLangState(langFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const setLang = useCallback((l: UiLang) => {
    setLangState(l)
    try {
      window.history.pushState({}, '', pathFor(l) + window.location.hash)
    } catch {
      /* entorno sin history */
    }
  }, [])

  const value = useMemo<Ctx>(() => {
    const m = LOCALES[lang]
    const locale = getLanguage(lang).locale
    const eurF = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    return {
      lang,
      m,
      setLang,
      t: interpolate,
      eur: (n) => eurF.format(n),
      num: (n, max = 1) => n.toLocaleString(locale, { maximumFractionDigits: max }),
      km: (k) => (k < 1 ? m.card.lessThan1 : `${k.toLocaleString(locale, { maximumFractionDigits: k < 10 ? 1 : 0 })} km`),
    }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): Ctx {
  const c = useContext(I18nContext)
  if (!c) throw new Error('useI18n debe usarse dentro de I18nProvider')
  return c
}
