import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { Property } from '../services/properties/types'
import { Button } from './ui'

const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export default function InvestModal({ property, onClose }: { property: Property | null; onClose: () => void }) {
  const [amount, setAmount] = useState(100)
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!property) return
    setAmount(Math.max(property.minInvestment, 100))
    setDone(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('input,button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [property, onClose])

  const remaining = property ? property.price - property.funded : 0
  const valid = property ? amount >= property.minInvestment && amount <= remaining : false

  return (
    <AnimatePresence>
      {property && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby="inv-title" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"><X size={18} aria-hidden /></button>
            {!done ? (
              <form onSubmit={(e) => { e.preventDefault(); if (valid) setDone(true) }} className="space-y-4">
                <h2 id="inv-title" className="pr-8 text-xl font-bold">Invertir en {property.title}</h2>
                <p className="text-sm text-slate-600">Rentabilidad estimada {property.yield.toLocaleString('es-ES')} % · Disponible {eur(remaining)}</p>
                <div>
                  <label htmlFor="inv-amount" className="mb-1 block text-sm font-semibold">Importe (mín. {eur(property.minInvestment)})</label>
                  <input id="inv-amount" type="number" min={property.minInvestment} max={remaining} step={10} value={amount} onChange={(e) => setAmount(+e.target.value)} className="min-h-12 w-full rounded-xl border border-slate-300 px-3" />
                  {!valid && <p role="alert" className="mt-1 text-sm text-red-700">Introduce un importe entre {eur(property.minInvestment)} y {eur(remaining)}.</p>}
                </div>
                <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Ganancia anual estimada: <b className="text-emerald-700">{eur((amount * property.yield) / 100)}</b> (no garantizada).</p>
                <Button type="submit" className="w-full" disabled={!valid}>Confirmar (demo)</Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check aria-hidden /></div>
                <h2 id="inv-title" className="mt-3 text-xl font-bold">¡Reserva simulada!</h2>
                <p className="mt-2 text-sm text-slate-600">Has reservado {eur(amount)} en {property.title}. Es una demostración: no se ha movido dinero real.</p>
                <Button onClick={onClose} className="mt-5 w-full">Cerrar</Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
