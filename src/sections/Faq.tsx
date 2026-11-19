import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '../i18n'
import { Reveal, SectionHead, rise } from '../components/ui'

export default function Faq() {
  const { m } = useI18n()
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="bg-snow py-20 sm:py-24">
      <Reveal className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead eyebrow={m.faq.eyebrow} title={m.faq.title} />
        <motion.div variants={rise} className="space-y-3">
          {m.faq.items.map((f, i) => {
            const on = open === i
            return (
              <div key={f.q} className="rounded-xl border border-slate-200 bg-white">
                <h3>
                  <button aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setOpen(on ? null : i)} className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-3 text-left font-semibold text-slate-900">
                    {f.q}
                    <ChevronDown size={18} aria-hidden className={`shrink-0 transition-transform ${on ? 'rotate-180' : ''}`} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div id={`faq-${i}`} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-slate-600">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </Reveal>
    </section>
  )
}
