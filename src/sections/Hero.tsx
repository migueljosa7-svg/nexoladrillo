import { motion } from 'framer-motion'
import { ArrowRight, Building2, ShieldAlert, TrendingUp } from 'lucide-react'
import type { UiLang } from '../config'
import { DICT } from '../i18n'
import { Button, rise, stagger } from '../components/ui'

const STATS = [
  ['50 €', 'inversión mínima'],
  ['15', 'ciudades disponibles'],
  ['5–12 %', 'rentabilidad estimada*'],
]

export default function Hero({ lang }: { lang: UiLang }) {
  const d = DICT[lang]
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-snow to-white pt-28 pb-16 sm:pt-36">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand/20 to-brand-2/20 blur-3xl" aria-hidden />
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p variants={rise} className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            <Building2 size={16} aria-hidden /> {d.badge}
          </motion.p>
          <motion.h1 variants={rise} className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            {d.h1a} <span className="grad-text">{d.h1b}</span>
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-xl text-lg text-slate-600">{d.sub}</motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#invertir"><Button tabIndex={-1}>{d.ctaPrimary} <ArrowRight size={16} aria-hidden /></Button></a>
            <a href="#simulador"><Button variant="ghost" tabIndex={-1}>{d.ctaSecondary}</Button></a>
          </motion.div>
          <motion.p variants={rise} className="mt-5 flex max-w-xl items-start gap-2 text-sm text-slate-600">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden /> {d.risk}
          </motion.p>
        </div>
        <motion.div variants={rise} className="relative">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-indigo-500/10">
            <div className="grid h-40 place-items-center rounded-2xl bg-gradient-to-br from-indigo-100 via-violet-100 to-emerald-100 text-7xl" aria-hidden>🏙️</div>
            <h2 className="mt-4 text-lg font-bold">Piso en Chamberí, Madrid</h2>
            <p className="text-sm text-slate-600">Ejemplo de oportunidad de alquiler</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="flex items-center gap-1 text-3xl font-extrabold text-emerald-700"><TrendingUp size={22} aria-hidden /> 5,9 %</p>
              <p className="text-sm text-slate-600">81 % financiado</p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-full w-[81%] rounded-full bg-gradient-to-r from-brand to-emerald" /></div>
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {STATS.map(([v, l]) => (
              <div key={l} className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <dt className="sr-only">{l}</dt>
                <dd className="text-xl font-extrabold text-slate-900">{v}</dd>
                <dd className="text-xs text-slate-600">{l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>
      <p className="relative mx-auto mt-6 max-w-7xl px-4 text-xs text-slate-600 sm:px-6">* Estimaciones no garantizadas. Web de demostración con datos ficticios.</p>
    </section>
  )
}
