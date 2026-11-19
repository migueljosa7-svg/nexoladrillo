import { useState } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import type { GatewayMode, GatewayResult } from '../services/properties/types'
import { useI18n } from '../i18n'

const DOT: Record<GatewayMode, string> = { live: 'bg-emerald-500', backup: 'bg-amber-500', cache: 'bg-amber-500', generated: 'bg-slate-500' }

export default function DataStatus({
  result, loading, outage, onOutage, onRetry,
}: { result: GatewayResult | null; loading: boolean; outage: boolean; onOutage: (v: boolean) => void; onRetry: () => void }) {
  const { m, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ok = result?.reports.filter((r) => r.ok).length ?? 0
  const failed = result?.reports.filter((r) => !r.ok && !r.skipped).length ?? 0
  const total = result?.reports.length ?? 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span role="status" className="flex items-center gap-2 font-semibold text-slate-800">
          <span className={`h-2.5 w-2.5 rounded-full ${loading ? 'animate-pulse bg-slate-400' : result ? DOT[result.mode] : 'bg-slate-400'}`} aria-hidden />
          {loading ? m.status.syncing : result ? m.status[result.mode] : m.status.none}
        </span>
        {result && !loading && (
          <span className="text-slate-600">
            {t(m.status.summary, { n: result.properties.length, ok, total })}
            {failed > 0 ? t(m.status.failed, { n: failed }) : ''}
          </span>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <label className="flex min-h-9 cursor-pointer items-center gap-2 text-slate-700">
            <input type="checkbox" checked={outage} onChange={(e) => onOutage(e.target.checked)} className="h-4 w-4" />
            {m.status.simulate}
          </label>
          <button onClick={onRetry} disabled={loading} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 font-semibold text-slate-800 hover:border-brand disabled:opacity-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden /> {m.status.retry}
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex min-h-9 items-center gap-1 text-brand">
            {m.status.detail} <ChevronDown size={14} className={open ? 'rotate-180' : ''} aria-hidden />
          </button>
        </div>
      </div>
      {open && result && (
        <ul className="mt-3 grid gap-1.5 border-t border-slate-100 pt-3 text-xs sm:grid-cols-2">
          {result.reports.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
              <span className="truncate text-slate-800">{r.label}</span>
              <span className={r.ok ? 'text-emerald-700' : r.skipped ? 'text-slate-600' : 'text-red-700'}>
                {r.ok ? `${t(m.status.records, { n: r.count })}${r.rejected ? ` ${t(m.status.discarded, { n: r.rejected })}` : ''}` : r.skipped ? m.status.skipped : r.error ?? m.status.fail}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
