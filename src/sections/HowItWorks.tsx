import { motion } from 'framer-motion'
import { Coins, Hammer, Handshake, KeyRound, LineChart, Search, Wrench, Building } from 'lucide-react'
import { useI18n } from '../i18n'
import { Reveal, SectionHead, rise } from '../components/ui'

const STEP_ICONS = [Search, Coins, KeyRound, LineChart]
const PHASE_ICONS = [Search, Hammer, Handshake, Wrench, Building]

export default function HowItWorks() {
  const { m } = useI18n()
  return (
    <>
      <section id="como-funciona" className="on-dark bg-ink py-20 text-white sm:py-24">
        <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHead dark eyebrow={m.how.eyebrow} title={<>{m.how.title1} <span className="grad-text-light">{m.how.title2}</span></>} />
          <motion.ol variants={rise} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {m.how.steps.map((s, i) => {
              const Icon = STEP_ICONS[i]
              return (
                <motion.li key={s.t} whileHover={{ y: -6 }} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="absolute right-4 top-4 text-4xl font-black text-white/10" aria-hidden>{i + 1}</span>
                  <Icon className="mb-4 text-emerald-400" size={26} aria-hidden />
                  <h3 className="font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm text-slate-300">{s.s}</p>
                </motion.li>
              )
            })}
          </motion.ol>
        </Reveal>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="work-title">
        <Reveal className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHead eyebrow={m.work.eyebrow} title={<span id="work-title">{m.work.title}</span>} sub={m.work.sub} />
          <motion.ol variants={rise} className="relative space-y-6 border-l-2 border-indigo-100 pl-8">
            {m.work.phases.map((p, i) => {
              const Icon = PHASE_ICONS[i]
              return (
                <motion.li key={p.t} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.05 }} className="relative">
                  <span className="absolute -left-[51px] grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white shadow-lg shadow-indigo-500/30"><Icon size={18} aria-hidden /></span>
                  <h3 className="text-lg font-bold text-slate-900">{i + 1}. {p.t}</h3>
                  <p className="mt-1 text-slate-600">{p.s}</p>
                </motion.li>
              )
            })}
          </motion.ol>
        </Reveal>
      </section>
    </>
  )
}
