import { motion } from 'framer-motion'
import { MapPin, TrendingUp } from 'lucide-react'
import type { Property } from '../services/properties/types'
import { fmtKm } from '../services/properties/geo'
import { Button } from './ui'

const eur = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

export default function PropertyCard({
  p, km, centerLabel, isUser, onInvest,
}: { p: Property; km: number | null; centerLabel?: string; isUser: boolean; onInvest: () => void }) {
  const pct = Math.round((p.funded / p.price) * 100)
  const done = pct >= 100
  const place = [p.zone, p.city].filter(Boolean).join(', ') || 'España'
  return (
    <motion.article whileHover={{ y: -5 }} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-indigo-500/10">
      <div className="relative grid h-32 place-items-center bg-gradient-to-br from-indigo-100 via-violet-100 to-emerald-100 text-5xl" aria-hidden>
        {p.emoji}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800">
          {p.operation === 'alquiler' ? 'Alquiler' : 'Compra y venta'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-slate-900">{p.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
          <MapPin size={14} className="shrink-0 text-brand" aria-hidden />
          {km !== null && centerLabel
            ? isUser ? `A ${fmtKm(km).replace('a ', '')} de tu ubicación` : `${fmtKm(km).charAt(0).toUpperCase()}${fmtKm(km).slice(1)} de ${centerLabel} · ${place}`
            : `En ${place}`}
        </p>
        {p.description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{p.description}</p>}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-600">Rentabilidad estimada</p>
            <p className="flex items-center gap-1 text-2xl font-extrabold text-emerald-700"><TrendingUp size={18} aria-hidden />{p.yield.toLocaleString('es-ES', { maximumFractionDigits: 1 })} %</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600">Objetivo</p>
            <p className="font-bold text-slate-900">{eur(p.price)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-700">
            <span>{done ? 'Financiado' : 'Financiación'}</span><b>{pct} %</b>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de financiación de ${p.title}`}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-brand to-emerald" />
          </div>
        </div>
        <div className="mt-auto pt-5">
          <Button onClick={onInvest} disabled={done} className="w-full" aria-label={`Invertir desde ${eur(p.minInvestment)} en ${p.title}`}>
            {done ? 'Completado' : `Invertir desde ${eur(p.minInvestment)}`}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
