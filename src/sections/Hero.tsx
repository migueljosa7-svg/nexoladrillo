import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, animate } from 'framer-motion'
import { ArrowRight, Check, Globe2, Loader2, Lock, Search, Sparkles, TrendingUp } from 'lucide-react'
import type { UiLang } from '../config'
import { DICT } from '../i18n'
import { Button, rise, stagger } from '../components/ui'
import {
  BASE_METRICS, DEMO_LANGS, DEMO_SITES, INDEX_STEPS, LANGUAGES, formatPrice, getLang, isDemoLang,
  localizedHost, resolveSite, tickMetrics, translateAsync, currencySymbol, type DemoLang,
} from '../services/translationEngineMock'

function Counter({ value, label }: { value: number; label: string }) {
  const [shown, setShown] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    const c = animate(prev.current, value, { duration: 0.8, onUpdate: (v) => setShown(Math.round(v)) })
    prev.current = value
    return () => c.stop()
  }, [value])
  return (
    <div className="text-center">
      <div className="text-2xl font-bold tabular-nums text-slate-900 sm:text-3xl">{shown.toLocaleString('es-ES')}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  )
}

export default function Hero({ lang, onSignup }: { lang: UiLang; onSignup: (plan?: string) => void }) {
  const d = DICT[lang]
  const [input, setInput] = useState(DEMO_SITES[0].host)
  const [applied, setApplied] = useState(DEMO_SITES[0].host)
  const [target, setTarget] = useState('es')
  const [shown, setShown] = useState('es')
  const [busy, setBusy] = useState(false)
  const [idx, setIdx] = useState(0)
  const [metrics, setMetrics] = useState(BASE_METRICS)

  const { site, host, custom } = useMemo(() => resolveSite(applied), [applied])
  const contentLang: DemoLang = isDemoLang(shown) ? shown : 'en'
  const c = site.content[contentLang]
  const L = getLang(shown)
  const rtl = L.rtl && isDemoLang(shown)

  useEffect(() => {
    const t = setInterval(() => setMetrics(tickMetrics), 2200)
    return () => clearInterval(t)
  }, [])

  // Traducción en vivo con latencia simulada
  useEffect(() => {
    let alive = true
    setBusy(true)
    translateAsync(target).then((l) => {
      if (!alive) return
      setShown(l)
      setBusy(false)
    })
    return () => {
      alive = false
    }
  }, [target, applied])

  // Progreso de indexación en Google
  useEffect(() => {
    if (shown === 'es') return setIdx(0)
    setIdx(0)
    const timers = [1, 2, 3, 4].map((n) => setTimeout(() => setIdx(n), n * 700))
    return () => timers.forEach(clearTimeout)
  }, [shown, applied])

  const apply = (v: string) => {
    setInput(v)
    setApplied(v)
  }

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-snow to-white pt-28 sm:pt-32">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand/20 to-brand-2/20 blur-3xl" aria-hidden />
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p variants={rise} className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            <Sparkles size={16} aria-hidden /> {d.badge}
          </motion.p>
          <motion.h1 variants={rise} className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            {d.h1a} <span className="grad-text">{d.h1b}</span>
          </motion.h1>
          <motion.p variants={rise} className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            {d.sub}
          </motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={() => onSignup()} aria-label={d.ctaPrimary}>
              {d.ctaPrimary} <ArrowRight size={16} aria-hidden />
            </Button>
            <a href="#precios">
              <Button variant="ghost" tabIndex={-1}>
                {d.ctaSecondary}
              </Button>
            </a>
          </motion.div>
          <motion.p variants={rise} className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-600">
            <Lock size={14} aria-hidden /> {d.noCard}
          </motion.p>
        </div>

        {/* ───────── Demo interactiva ───────── */}
        <motion.div variants={rise} id="demo" className="mx-auto mt-14 max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-5">
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                setApplied(input)
              }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  aria-label="URL de tu web para la demo"
                  placeholder="Escribe la URL de tu web, p. ej. mi-tienda.com"
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-slate-900 placeholder:text-slate-500"
                />
              </div>
              <Button type="submit" aria-label="Analizar web">
                Pruébalo en tu web
              </Button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-600">Ejemplos:</span>
              {DEMO_SITES.map((s) => (
                <button
                  key={s.host}
                  type="button"
                  onClick={() => apply(s.host)}
                  aria-label={`Usar ejemplo ${s.host}`}
                  className="min-h-9 rounded-full border border-slate-300 bg-white px-3 text-slate-700 hover:border-brand hover:text-brand"
                >
                  {s.host}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Idioma de destino">
              {DEMO_LANGS.map((code) => {
                const l = getLang(code)
                const on = target === code
                return (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Traducir a ${l.name}`}
                    onClick={() => setTarget(code)}
                    className={`min-h-10 rounded-xl border px-3 text-sm font-medium transition-colors ${
                      on ? 'border-transparent bg-gradient-to-r from-brand to-brand-2 text-white' : 'border-slate-300 bg-white text-slate-800 hover:border-brand'
                    }`}
                  >
                    <span aria-hidden>{l.flag}</span> {l.name}
                  </button>
                )
              })}
              <label className="sr-only" htmlFor="more-langs">
                Más idiomas
              </label>
              <select
                id="more-langs"
                value={isDemoLang(target) ? '' : target}
                onChange={(e) => e.target.value && setTarget(e.target.value)}
                className="min-h-10 rounded-xl border border-slate-300 bg-white px-2 text-sm text-slate-800"
              >
                <option value="">+{LANGUAGES.length - DEMO_LANGS.length} idiomas más…</option>
                {LANGUAGES.filter((l) => !isDemoLang(l.code)).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.native})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_270px]">
              {/* Navegador simulado */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="flex gap-1.5" aria-hidden>
                    <i className="h-3 w-3 rounded-full bg-red-400" />
                    <i className="h-3 w-3 rounded-full bg-amber-400" />
                    <i className="h-3 w-3 rounded-full bg-emerald-400" />
                  </span>
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200" aria-live="polite">
                    <Lock size={12} className="text-emerald-600" aria-hidden />
                    <span className="truncate">
                      https://<b>{localizedHost(host, shown)}</b>
                    </span>
                    {busy && <Loader2 size={12} className="ml-auto animate-spin text-brand" aria-label="Traduciendo" />}
                  </div>
                </div>
                <div dir={rtl ? 'rtl' : 'ltr'} lang={shown} className="relative min-h-[360px] p-5 sm:p-7">
                  {custom && (
                    <p className="mb-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-800">
                      Vista previa genérica de <b>{host}</b>: la marca “{site.brand}” se respeta gracias al glosario.
                    </p>
                  )}
                  {!isDemoLang(shown) && (
                    <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Demo: para {L.name} se muestra texto de ejemplo en inglés. El motor completo traduce a este idioma al instalarlo.
                    </p>
                  )}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${host}-${shown}`}
                      initial={{ opacity: 0, filter: 'blur(6px)', y: 8 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      exit={{ opacity: 0, filter: 'blur(6px)' }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <b className="text-lg" style={{ color: site.tint }}>
                          {site.brand}
                        </b>
                        <ul className="hidden gap-4 text-sm text-slate-600 sm:flex">
                          {c.nav.map((n) => (
                            <li key={n}>{n}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: site.tint }}>
                          {c.badge}
                        </span>
                        <h3 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{c.title}</h3>
                        <p className="mt-2 max-w-md text-slate-600">{c.sub}</p>
                        <span className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: site.tint }}>
                          {c.cta}
                        </span>
                      </div>
                      <h4 className="mb-2 mt-7 text-sm font-semibold text-slate-700">{c.itemsTitle}</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {c.items.map((it) => (
                          <div key={it.name} className="rounded-xl border border-slate-200 p-3 text-center">
                            <div className="text-2xl" aria-hidden>
                              {it.emoji}
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-800 sm:text-sm">{it.name}</div>
                            <div className="text-sm font-bold" style={{ color: site.tint }}>
                              {formatPrice(it.eur, contentLang)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-xs text-slate-600">✓ {c.trust}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Panel SEO */}
              <aside className="rounded-2xl bg-ink p-4 text-slate-200 on-dark" aria-label="Estado de indexación en Google">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <TrendingUp size={16} className="text-emerald-400" aria-hidden /> Indexación en Google
                </h3>
                <dl className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between"><dt className="text-slate-400">Idioma</dt><dd>{L.flag} {L.name}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">Moneda</dt><dd>{isDemoLang(shown) ? currencySymbol(shown) : '$'} · {rtl ? 'RTL' : 'LTR'}</dd></div>
                  <div className="flex justify-between"><dt className="text-slate-400">hreflang</dt><dd className="font-mono">{shown}</dd></div>
                </dl>
                <ol className="mt-4 space-y-2.5">
                  {INDEX_STEPS.map((s, i) => {
                    const done = shown !== 'es' && idx > i
                    return (
                      <li key={s} className="flex items-start gap-2 text-xs">
                        <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${done ? 'bg-emerald-500 text-white' : 'bg-slate-700'}`}>
                          {done ? <Check size={11} aria-hidden /> : shown !== 'es' && idx === i ? <Loader2 size={11} className="animate-spin" aria-hidden /> : null}
                        </span>
                        <span className={done ? 'text-slate-100' : 'text-slate-400'}>{s}</span>
                      </li>
                    )
                  })}
                </ol>
                <p className="mt-4 rounded-lg bg-white/5 p-2 font-mono text-[11px] leading-relaxed text-slate-300">
                  &lt;link rel=&quot;alternate&quot; hreflang=&quot;{shown}&quot; href=&quot;https://{localizedHost(host, shown)}/&quot; /&gt;
                </p>
              </aside>
            </div>
          </div>
        </motion.div>

        <motion.div variants={rise} className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 pb-16 sm:grid-cols-3" aria-label="Métricas en vivo (simuladas)">
          <Counter value={metrics.words} label="palabras traducidas" />
          <Counter value={metrics.customers} label="clientes activos" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              <Globe2 size={24} className="text-brand" aria-hidden /> {LANGUAGES.length}+
            </div>
            <div className="text-sm text-slate-600">idiomas soportados</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
