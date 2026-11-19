import { motion } from 'framer-motion'
import { Database, Eye, Headset, Lock } from 'lucide-react'
import { useI18n } from '../i18n'
import { Reveal, SectionHead, rise } from '../components/ui'

const ICONS = [Database, Eye, Lock, Headset]

export default function Trust() {
  const { m } = useI18n()
  return (
    <section className="bg-white py-20 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={m.trust.eyebrow} title={m.trust.title} />
        <motion.ul variants={rise} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {m.trust.items.map((it, i) => {
            const Icon = ICONS[i]
            return (
              <li key={it.t} className="rounded-2xl border border-slate-200 bg-snow p-6">
                <Icon className="mb-3 text-brand" size={24} aria-hidden />
                <h3 className="font-semibold text-slate-900">{it.t}</h3>
                <p className="mt-1 text-sm text-slate-600">{it.s}</p>
              </li>
            )
          })}
        </motion.ul>
        <p className="mt-6 text-center text-sm text-slate-600">{m.trust.disclaimer}</p>
      </Reveal>
    </section>
  )
}
