import { motion } from 'framer-motion'
import { Banknote, Compass, Eye, HardHat, PiggyBank, TrendingUp } from 'lucide-react'
import { useI18n } from '../i18n'
import { Reveal, SectionHead, rise } from '../components/ui'

const ICONS = [Banknote, TrendingUp, PiggyBank, HardHat, Eye, Compass]

export default function Why() {
  const { m } = useI18n()
  return (
    <section id="por-que" className="bg-snow py-20 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={m.why.eyebrow} title={m.why.title} />
        <motion.ul variants={rise} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {m.why.items.map((it, i) => {
            const Icon = ICONS[i]
            return (
              <motion.li key={it.t} whileHover={{ y: -6 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-brand"><Icon size={24} aria-hidden /></span>
                <h3 className="font-semibold text-slate-900">{it.t}</h3>
                <p className="mt-1 text-sm text-slate-600">{it.s}</p>
              </motion.li>
            )
          })}
        </motion.ul>
      </Reveal>
    </section>
  )
}
