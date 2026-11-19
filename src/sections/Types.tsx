import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useI18n } from '../i18n'
import { Reveal, SectionHead, rise } from '../components/ui'

export default function Types() {
  const { m } = useI18n()
  const cards = [m.types.rent, m.types.sale]
  return (
    <section className="bg-white py-20 sm:py-24">
      <Reveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHead eyebrow={m.types.eyebrow} title={m.types.title} />
        <motion.div variants={rise} className="grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div key={c.name} whileHover={{ y: -6 }} className={`rounded-3xl p-7 ${i === 0 ? 'border border-slate-200 bg-snow' : 'bg-gradient-to-br from-brand to-brand-2 text-white'}`}>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${i === 0 ? 'bg-indigo-100 text-brand' : 'bg-white/20'}`}>{c.tag}</span>
              <h3 className="mt-4 text-2xl font-bold">{c.name}</h3>
              <p className={`mt-2 ${i === 0 ? 'text-slate-600' : 'text-indigo-100'}`}>{c.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {c.points.map((p) => <li key={p} className="flex gap-2"><Check size={16} className={`mt-0.5 shrink-0 ${i === 0 ? 'text-emerald-600' : 'text-emerald-300'}`} aria-hidden />{p}</li>)}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <p className="mt-4 text-center text-xs text-slate-600">{m.types.note}</p>
      </Reveal>
    </section>
  )
}
