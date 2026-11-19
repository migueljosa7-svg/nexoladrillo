import { motion } from 'framer-motion'
import { ArrowRight, Building2, ShieldAlert, TrendingUp, Wallet } from 'lucide-react'
import { useI18n } from '../i18n'
import { Button, rise, stagger } from '../components/ui'
import PropertyArt from '../components/PropertyArt'

export default function Hero() {
  const { m, t, num } = useI18n()
  const h = m.hero
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-snow to-white pb-16 pt-28 sm:pt-36">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <motion.div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand/20 to-brand-2/20 blur-3xl" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p variants={rise} className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-800">
            <Building2 size={16} aria-hidden /> {h.badge}
          </motion.p>
          <motion.h1 variants={rise} className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {h.h1a} <span className="grad-text">{h.h1b}</span>
          </motion.h1>
          <motion.p variants={rise} className="mt-6 max-w-xl text-lg text-slate-600">{h.sub}</motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#invertir"><Button tabIndex={-1}>{h.ctaPrimary} <ArrowRight size={16} aria-hidden /></Button></a>
            <a href="#simulador"><Button variant="ghost" tabIndex={-1}>{h.ctaSecondary}</Button></a>
          </motion.div>
          <motion.p variants={rise} className="mt-5 flex max-w-xl items-start gap-2 text-sm text-slate-600">
            <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden /> {h.risk}
          </motion.p>
        </div>

        <motion.div variants={rise} className="relative mx-auto w-full max-w-md">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-indigo-500/15">
            <PropertyArt id="hero-demo" asset="vivienda" className="h-44 w-full" />
            <div className="p-5">
              <h2 className="text-lg font-bold">{h.cardTitle}</h2>
              <p className="text-sm text-slate-600">{h.cardSub}</p>
              <div className="mt-4 flex items-end justify-between">
                <p className="flex items-center gap-1 text-3xl font-extrabold text-emerald-700"><TrendingUp size={22} aria-hidden /> {num(5.9)} %</p>
                <p className="text-sm text-slate-600">{t(h.cardFunded, { n: 81 })}</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <motion.div initial={{ width: 0 }} animate={{ width: '81%' }} transition={{ delay: 0.6, duration: 1.2 }} className="h-full rounded-full bg-gradient-to-r from-brand to-emerald" />
              </div>
            </div>
          </motion.div>
          {/* Móvil flotante */}
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-10 -right-2 hidden w-44 rounded-[28px] border-4 border-slate-900 bg-white p-3 shadow-2xl sm:block" aria-hidden>
            <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-900" />
            <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-600"><Wallet size={12} /> {h.phoneTitle}</p>
            <p className="mt-1 text-xl font-extrabold text-slate-900">{(6000).toLocaleString('es-ES')} €</p>
            <p className="text-[10px] text-slate-600">{h.phoneMonthly}</p>
            <p className="text-sm font-bold text-emerald-700">+{num(38.4)} €</p>
            <div className="mt-2 flex h-10 items-end gap-1">
              {[4, 6, 5, 8, 7, 10, 9, 12].map((v, i) => <span key={i} className="flex-1 rounded-sm bg-gradient-to-t from-brand to-brand-2" style={{ height: `${v * 8}%` }} />)}
            </div>
            <p className="mt-2 text-[9px] text-slate-500">{h.phoneNext}</p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.dl variants={rise} initial="hidden" animate="show" className="relative mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-3 px-4 text-center sm:px-6">
        {[['50 €', h.statMin], ['15', h.statCities], ['5–12 %', h.statYield]].map(([v, l]) => (
          <div key={l} className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <dd className="text-xl font-extrabold text-slate-900 sm:text-2xl">{v}</dd>
            <dt className="text-xs text-slate-600 sm:text-sm">{l}</dt>
          </div>
        ))}
      </motion.dl>
      <p className="relative mx-auto mt-4 max-w-7xl px-4 text-center text-xs text-slate-600 sm:px-6">{h.footnote}</p>
    </section>
  )
}
