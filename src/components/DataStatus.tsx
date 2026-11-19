import { useState } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import type { GatewayMode, GatewayResult } from '../services/properties/types'

const MODE: Record<GatewayMode, { label: string; dot: string }> = {
  live: { label: 'Fuente activa', dot: 'bg-emerald-500' },
  backup: { label: 'Respaldo sincronizado', dot: 'bg-amber-500' },
  cache: { label: 'Datos en caché local', dot: 'bg-amber-500' },
  generated: { label: 'Generador de respaldo', dot: 'bg-slate-500' },
}

export default function DataStatus({
  result, loading, outage, onOutage, onRetry,
}: { result: GatewayResult | null; loading: boolean; outage: boolean; onOutage: (v: boolean) => void; onRetry: () => void }) {
  const [open, setOpen] = useState(false)
  const m = result ? MODE[result.mode] : null
  const ok = result?.reports.filter((r) => r.ok).length ?? 0
  const failed = result?.reports.filter((r) => !r.ok && !r.skipped).length ?? 0
  const total = result?.reports.length ?? 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span role="status" className="flex items-center gap-2 font-semibold text-slate-800">
          <span className={`h-2.5 w-2.5 rounded-full ${loading ? 'animate-pulse bg-slate-400' : m?.dot ?? 'bg-slate-400'}`} aria-hidden />
          {loading ? 'Sincronizando fuentes…' : m?.label ?? 'Sin datos'}
        </span>
        {result && !loading && (
          <span className="text-slate-600">
            {result.properties.length} inmuebles · {ok}/{total} fuentes OK{failed > 0 ? ` · ${failed} con fallo (gestionado)` : ''}
          </span>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <label className="flex min-h-9 cursor-pointer items-center gap-2 text-slate-700">
            <input type="checkbox" checked={outage} onChange={(e) => onOutage(e.target.checked)} className="h-4 w-4" />
            Simular caída de fuentes remotas
          </label>
          <button onClick={onRetry} disabled={loading} aria-label="Reintentar actualización" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-3 font-semibold text-slate-800 hover:border-brand disabled:opacity-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden /> Reintentar actualización
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex min-h-9 items-center gap-1 text-brand">
            Detalle <ChevronDown size={14} className={open ? 'rotate-180' : ''} aria-hidden />
          </button>
        </div>
      </div>
      {open && result && (
        <ul className="mt-3 grid gap-1.5 border-t border-slate-100 pt-3 text-xs sm:grid-cols-2">
          {result.reports.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
              <span className="truncate text-slate-800">{r.label}</span>
              <span className={r.ok ? 'text-emerald-700' : r.skipped ? 'text-slate-600' : 'text-red-700'}>
                {r.ok ? `${r.count} reg.${r.rejected ? ` (${r.rejected} descartados)` : ''}` : r.skipped ? 'Sin usar' : r.error ?? 'Fallo'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
