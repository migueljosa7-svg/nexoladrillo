import { motion } from 'framer-motion'
import { Heart, MapPin, TrendingUp } from 'lucide-react'
import type { Property } from '../services/properties/types'
import { useI18n } from '../i18n'
import { propertyPlace, propertyTitle } from '../i18n/display'
import PropertyArt from './PropertyArt'
import { Button } from './ui'

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white" aria-hidden>
      <div className="h-36 animate-pulse bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-8 animate-pulse rounded bg-slate-200" />
        <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}

export default function PropertyCard({
  p, km, centerLabel, isUser, fav, onFav, onOpen,
}: { p: Property; km: number | null; centerLabel?: string; isUser: boolean; fav: boolean; onFav: () => void; onOpen: () => void }) {
  const { m, t, eur, num, km: fmtKm } = useI18n()
  const pct = Math.round((p.funded / p.price) * 100)
  const done = pct >= 100
  const title = propertyTitle(p, m)
  const place = propertyPlace(p)
  const where =
    km !== null && centerLabel
      ? isUser
        ? t(m.card.fromUser, { d: fmtKm(km) })
        : t(m.card.fromPlace, { d: fmtKm(km), place: centerLabel }) + ` · ${place}`
      : t(m.card.inPlace, { place })

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-indigo-500/10">
      <button type="button" onClick={onOpen} aria-label={`${m.card.details}: ${title}`} className="relative block overflow-hidden text-left">
        <PropertyArt id={p.id} asset={p.asset} className="h-36 w-full transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800">
          {p.operation === 'alquiler' ? m.card.rent : m.card.sale}
        </span>
      </button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.8 }}
        onClick={onFav}
        aria-pressed={fav}
        aria-label={t(fav ? m.card.favRemove : m.card.favAdd, { t: title })}
        className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow"
      >
        <Heart size={18} className={fav ? 'fill-rose-500 text-rose-500' : 'text-slate-600'} aria-hidden />
      </motion.button>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin size={14} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {where}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-600">{m.card.yield}</p>
            <p className="flex items-center gap-1 text-2xl font-extrabold text-emerald-700">
              <TrendingUp size={18} aria-hidden />
              {num(p.yield)} %
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600">{m.card.target}</p>
            <p className="font-bold text-slate-900">{eur(p.price)}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-slate-700">
            <span>{done ? m.card.funded : m.card.funding}</span>
            <b>{pct} %</b>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t(m.card.progressAria, { t: title })}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-brand to-emerald" />
          </div>
        </div>
        <div className="mt-auto pt-5">
          <Button onClick={onOpen} disabled={done} className="w-full" aria-label={`${t(m.card.invest, { n: eur(p.minInvestment) })} · ${title}`}>
            {done ? m.card.completed : t(m.card.invest, { n: eur(p.minInvestment) })}
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
