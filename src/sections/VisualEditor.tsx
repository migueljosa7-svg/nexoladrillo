import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BookLock, Brain, Check, Pencil, Sparkles } from 'lucide-react'
import { BRAND_NEURAL, EDITOR_SEGMENTS, renderSegment, type EditorLang } from '../services/translationEngineMock'
import { Button, Reveal, SectionHead, rise } from '../components/ui'

const LANGS: { code: EditorLang; label: string }[] = [
  { code: 'en', label: '🇬🇧 Inglés' },
  { code: 'fr', label: '🇫🇷 Francés' },
  { code: 'de', label: '🇩🇪 Alemán' },
]

export default function VisualEditor() {
  const [lang, setLang] = useState<EditorLang>('en')
  const [locked, setLocked] = useState(true)
  const [extra, setExtra] = useState({ checkout: true, envio: false })
  const [sel, setSel] = useState('h')
  const [overrides, setOverrides] = useState<Record<string, string>>({})
  const [draft, setDraft] = useState('')
  const [saved, setSaved] = useState(false)

  const brandCtx = locked ? 'Nexo' : BRAND_NEURAL[lang]
  const ctxText = (id: string) => {
    const s = EDITOR_SEGMENTS.find((x) => x.id === id)!
    return overrides[`${id}-${lang}`] ?? renderSegment(s.contextual[lang], brandCtx)
  }
  const current = EDITOR_SEGMENTS.find((s) => s.id === sel)!

  const choose = (id: string) => {
    setSel(id)
    setDraft(ctxText(id))
    setSaved(false)
  }
  const mark = (t: string): ReactNode => {
    const b = BRAND_NEURAL[lang]
    const parts = t.split(b)
    return parts.flatMap((p, i) => (i < parts.length - 1 ? [p, <mark key={i} className="rounded bg-red-500/30 px-1 text-red-200">{b}</mark>] : [p]))
  }

  return (
    <section id="editor" className="on-dark bg-ink py-20 text-white sm:py-28">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          dark
          eyebrow="Editor visual + Glosario IA"
          title={<>Haz clic, edita y <span className="grad-text-light">protege tu marca</span></>}
          sub="Edita cualquier texto en contexto, bloquea términos de marca y compara la traducción neuronal base con la IA ajustada a tu tono."
        />
        <motion.div variants={rise} className="mb-5 flex flex-wrap items-center gap-2" role="group" aria-label="Idioma del editor">
          {LANGS.map((l) => (
            <button
              key={l.code}
              aria-pressed={lang === l.code}
              onClick={() => {
                setLang(l.code)
                setSaved(false)
              }}
              className={`min-h-10 rounded-xl px-4 text-sm font-semibold ${lang === l.code ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {l.label}
            </button>
          ))}
        </motion.div>

        <motion.div variants={rise} className="grid gap-5 lg:grid-cols-2">
          {/* Interfaz simulada */}
          <div className="rounded-2xl bg-white p-5 text-slate-900">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <Pencil size={13} aria-hidden /> Haz clic en un texto para editarlo
            </p>
            <div className="space-y-3 rounded-xl bg-snow p-4">
              {EDITOR_SEGMENTS.map((s) => {
                const on = s.id === sel
                return (
                  <button
                    key={s.id}
                    onClick={() => choose(s.id)}
                    aria-pressed={on}
                    aria-label={`Editar texto: ${ctxText(s.id)}`}
                    className={`block w-full rounded-lg border-2 border-dashed px-3 py-2 text-left transition-colors ${
                      on ? 'border-brand bg-indigo-50' : 'border-transparent hover:border-indigo-300'
                    } ${s.id === 'h' ? 'text-xl font-bold' : s.id === 'c' ? 'font-semibold text-brand' : 'text-slate-700'}`}
                  >
                    {ctxText(s.id)}
                    {overrides[`${s.id}-${lang}`] && <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">EDITADO</span>}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <BookLock size={16} className="text-brand" aria-hidden /> Glosario de reglas
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  { k: 'nexo', term: 'Nexo', rule: 'Nunca traducir (marca)', on: locked, set: () => setLocked((v) => !v) },
                  { k: 'checkout', term: 'checkout', rule: 'Mantener en inglés', on: extra.checkout, set: () => setExtra((e) => ({ ...e, checkout: !e.checkout })) },
                  { k: 'envio', term: 'envíos', rule: 'Usar “delivery” (tono premium)', on: extra.envio, set: () => setExtra((e) => ({ ...e, envio: !e.envio })) },
                ].map((r) => (
                  <li key={r.k} className="flex items-center justify-between gap-3">
                    <span>
                      <b className="rounded bg-slate-100 px-1.5 py-0.5">{r.term}</b> <span className="text-slate-600">→ {r.rule}</span>
                    </span>
                    <button
                      role="switch"
                      aria-checked={r.on}
                      aria-label={`Regla de glosario para ${r.term}`}
                      onClick={r.set}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${r.on ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${r.on ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comparación */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Original (ES)</p>
              <p className="text-slate-100">{renderSegment(current.source, 'Nexo')}</p>
            </div>
            <div className="rounded-2xl border border-red-400/30 bg-red-500/5 p-5">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-300">
                <Brain size={14} aria-hidden /> Traducción neuronal base
              </p>
              <p className="text-slate-200">{mark(current.neural[lang])}</p>
              <p className="mt-2 text-xs text-slate-400">Literal, sin contexto: traduce la marca y suena poco natural.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5">
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                <Sparkles size={14} aria-hidden /> IA contextual (tono de marca)
              </p>
              <p className="text-white">{renderSegment(current.contextual[lang], brandCtx)}</p>
              <label htmlFor="edit-seg" className="mb-1 mt-4 block text-xs font-semibold text-slate-300">
                Tu versión final
              </label>
              <textarea
                id="edit-seg"
                value={draft || ctxText(sel)}
                onChange={(e) => {
                  setDraft(e.target.value)
                  setSaved(false)
                }}
                rows={2}
                className="w-full rounded-lg border border-white/20 bg-black/30 p-3 text-sm text-white"
              />
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="light"
                  onClick={() => {
                    setOverrides((o) => ({ ...o, [`${sel}-${lang}`]: draft || ctxText(sel) }))
                    setSaved(true)
                  }}
                >
                  Guardar traducción
                </Button>
                {saved && (
                  <span role="status" className="flex items-center gap-1 text-sm text-emerald-300">
                    <Check size={16} aria-hidden /> Guardada y publicada
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}
