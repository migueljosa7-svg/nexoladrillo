import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Zap, Search, Languages } from 'lucide-react'
import { PLATFORMS } from '../services/translationEngineMock'
import { Reveal, SectionHead, rise } from '../components/ui'

export default function Integrations() {
  const [id, setId] = useState('shopify')
  const [copied, setCopied] = useState(false)
  const p = PLATFORMS.find((x) => x.id === id)!

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* portapapeles no disponible */
    }
  }

  return (
    <section id="integraciones" className="bg-white py-20 sm:py-28">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Cero código"
          title={<>Instalado en <span className="grad-text">2 minutos</span>, en cualquier plataforma</>}
          sub="Elige tu plataforma y copia el snippet. Sin desarrolladores, sin migrar contenido, sin tocar tu diseño."
        />
        <motion.div variants={rise} className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <div role="tablist" aria-label="Plataformas" className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {PLATFORMS.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={x.id === id}
                aria-label={`Integración ${x.name}`}
                onClick={() => setId(x.id)}
                className={`min-h-11 rounded-xl border px-4 py-2 text-left text-sm font-semibold transition-all ${
                  x.id === id ? 'border-brand bg-indigo-50 text-brand shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                {x.name}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="overflow-hidden rounded-2xl bg-ink on-dark">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-sm font-semibold text-white">{p.name}</span>
              <button
                onClick={copy}
                aria-label="Copiar snippet"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-xs font-semibold text-white hover:bg-white/20"
              >
                {copied ? <Check size={14} className="text-emerald-400" aria-hidden /> : <Copy size={14} aria-hidden />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="p-5">
                <p className="mb-4 text-sm text-slate-300">{p.steps}</p>
                <pre className="overflow-x-auto rounded-xl bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-emerald-300">
                  <code>{p.snippet}</code>
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.ul variants={rise} className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            [Zap, 'Detecta y traduce solo', 'Rastrea tu contenido, menús, metadatos y emails transaccionales.'],
            [Search, 'SEO listo para Google', 'hreflang, sitemap y URLs por idioma generados automáticamente.'],
            [Languages, 'Se actualiza contigo', 'Nuevo contenido en tu web = nueva traducción sin tocar nada.'],
          ].map(([Icon, t, s]) => {
            const I = Icon as typeof Zap
            return (
              <li key={t as string} className="rounded-2xl border border-slate-200 bg-snow p-5">
                <I className="mb-3 text-brand" size={22} aria-hidden />
                <h3 className="font-semibold text-slate-900">{t as string}</h3>
                <p className="mt-1 text-sm text-slate-600">{s as string}</p>
              </li>
            )
          })}
        </motion.ul>
      </Reveal>
    </section>
  )
}
