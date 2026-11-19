import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Clock, Percent, X } from 'lucide-react'
import type { Property } from '../services/properties/types'
import { useI18n } from '../i18n'
import { propertyPlace, propertyTitle } from '../i18n/display'
import PropertyArt from './PropertyArt'
import { Button } from './ui'

export default function PropertyDetail({ property, onClose }: { property: Property | null; onClose: () => void }) {
  const { m, t, eur, num } = useI18n()
  const [amount, setAmount] = useState(100)
  const [done, setDone] = useState(false)
  const [photo, setPhoto] = useState<0 | 1 | 2>(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!property) return
    setAmount(Math.max(property.minInvestment, 100))
    setDone(false)
    setPhoto(0)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [property, onClose])

  const p = property
  const remaining = p ? Math.max(0, p.price - p.funded) : 0
  const valid = p ? amount >= p.minInvestment && amount <= remaining : false
  const title = p ? propertyTitle(p, m) : ''
  const rent = p?.operation === 'alquiler'
  const pct = p ? Math.round((p.funded / p.price) * 100) : 0

  return (
    <AnimatePresence>
      {p && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-end bg-ink/70 backdrop-blur-sm sm:place-items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="det-title"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="relative max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <button onClick={onClose} aria-label={m.a11y.close} className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow hover:bg-white">
              <X size={18} aria-hidden />
            </button>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={photo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <PropertyArt id={p.id} asset={p.asset} variant={photo} className="h-52 w-full sm:h-64" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-3 left-3 flex gap-2" role="group" aria-label={m.detail.gallery}>
                {([0, 1, 2] as const).map((i) => (
                  <button key={i} onClick={() => setPhoto(i)} aria-pressed={photo === i} aria-label={t(m.detail.photo, { n: i + 1 })} className={`h-3 rounded-full transition-all ${photo === i ? 'w-8 bg-white' : 'w-3 bg-white/60'}`} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-brand">{rent ? m.card.rent : m.card.sale}</span>
                <h2 id="det-title" className="mt-3 text-2xl font-bold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-600">{propertyPlace(p)}</p>
                <p className="mt-3 text-slate-600">{rent ? m.desc.alquiler : m.desc.compraventa}</p>

                <h3 className="mt-6 text-sm font-semibold text-slate-900">{m.detail.key}</h3>
                <dl className="mt-2 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">{m.card.target}</dt><dd className="font-bold">{eur(p.price)}</dd></div>
                  <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">{m.detail.minimum}</dt><dd className="font-bold">{eur(p.minInvestment)}</dd></div>
                  <div className="rounded-xl bg-snow p-3"><dt className="flex items-center gap-1 text-xs text-slate-600"><Clock size={12} aria-hidden />{m.detail.term}</dt><dd className="font-bold">{rent ? m.detail.termRent : m.detail.termSale}</dd></div>
                  <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">{m.card.funding}</dt><dd className="font-bold">{pct} %</dd></div>
                </dl>

                <h3 className="mt-6 text-sm font-semibold text-slate-900">{m.detail.scenarios}</h3>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                  {([['pess', 0.6], ['real', 1], ['opt', 1.25]] as const).map(([k, f]) => (
                    <div key={k} className={`rounded-xl p-3 ${k === 'real' ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-snow'}`}>
                      <p className="text-xs text-slate-600">{m.detail[k]}</p>
                      <p className="text-lg font-extrabold text-emerald-700">{num(p.yield * f)} %</p>
                    </div>
                  ))}
                </div>

                <h3 className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-slate-900"><Percent size={14} aria-hidden />{m.detail.fees}</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
                  {(rent ? m.detail.feesRent : m.detail.feesSale).map((f) => <li key={f}>{f}</li>)}
                </ul>

                <h3 className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-slate-900"><AlertTriangle size={14} className="text-amber-600" aria-hidden />{m.detail.risks}</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
                  {m.detail.risksList.map((r) => <li key={r}>{r}</li>)}
                </ul>
              </div>

              <div className="md:sticky md:top-0 md:self-start">
                <div className="rounded-2xl border border-slate-200 bg-snow p-5">
                  {!done ? (
                    <form onSubmit={(e) => { e.preventDefault(); if (valid) setDone(true) }} className="space-y-4">
                      <p className="text-3xl font-extrabold text-emerald-700">{num(p.yield)} %</p>
                      <p className="-mt-3 text-xs text-slate-600">{m.card.yield} · {t(m.detail.available)} {eur(remaining)}</p>
                      <div>
                        <label htmlFor="inv-amount" className="mb-1 block text-sm font-semibold">{t(m.detail.amount, { n: eur(p.minInvestment) })}</label>
                        <input id="inv-amount" type="number" inputMode="numeric" min={p.minInvestment} max={remaining} step={10} value={amount} onChange={(e) => setAmount(+e.target.value)} className="min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3" />
                        {!valid && <p role="alert" className="mt-1 text-sm text-red-700">{t(m.detail.amountRange, { min: eur(p.minInvestment), max: eur(remaining) })}</p>}
                      </div>
                      <p className="rounded-lg bg-white p-3 text-sm text-slate-700">{t(m.detail.estGain, { n: eur((amount * p.yield) / 100) })}</p>
                      <Button type="submit" className="w-full" disabled={!valid}>{m.detail.confirm}</Button>
                      <p className="text-center text-xs text-slate-600">{m.detail.demo}</p>
                    </form>
                  ) : (
                    <div className="text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check aria-hidden /></motion.div>
                      <h3 className="mt-3 text-lg font-bold">{m.detail.doneTitle}</h3>
                      <p className="mt-2 text-sm text-slate-600">{t(m.detail.doneText, { n: eur(amount), p: title })}</p>
                      <Button onClick={onClose} className="mt-4 w-full">{m.a11y.close}</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
