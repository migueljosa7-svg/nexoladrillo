import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Crosshair, Loader2, MapPin, Search, X } from 'lucide-react'
import { useProperties } from '../services/properties/useProperties'
import { QUICK_CITIES, fmtKm, haversineKm, resolvePlace, norm } from '../services/properties/geo'
import type { Property } from '../services/properties/types'
import { Button, Reveal, SectionHead, rise } from '../components/ui'
import DataStatus from '../components/DataStatus'
import PropertyCard from '../components/PropertyCard'

type Sort = 'cercania' | 'rentabilidad' | 'progreso'
type Center = { lat: number; lng: number; label: string; isUser: boolean }
type GeoState = 'idle' | 'loading' | 'ok' | 'denied' | 'unsupported' | 'error'
const RADII = [
  { v: 5, l: '5 km' },
  { v: 15, l: '15 km' },
  { v: 50, l: '50 km' },
  { v: 0, l: 'Toda España' },
]

export default function Catalog({ onInvest }: { onInvest: (p: Property) => void }) {
  const { result, loading, outage, toggleOutage, retry } = useProperties()
  const [query, setQuery] = useState('')
  const [applied, setApplied] = useState('')
  const [userPos, setUserPos] = useState<Center | null>(null)
  const [geo, setGeo] = useState<GeoState>('idle')
  const [radius, setRadius] = useState(0)
  const [sort, setSort] = useState<Sort>('rentabilidad')
  const [op, setOp] = useState<'todas' | 'alquiler' | 'compraventa'>('todas')

  const place = useMemo(() => (applied ? resolvePlace(applied) : null), [applied])
  const center: Center | null = place ? { ...place, isUser: false } : userPos
  const textOnly = applied && !place ? norm(applied) : ''

  const useMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return setGeo('unsupported')
    setGeo('loading')
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'tu ubicación', isUser: true })
          setApplied('')
          setQuery('')
          setGeo('ok')
          if (radius === 0) setRadius(50)
        },
        (err) => setGeo(err.code === 1 ? 'denied' : 'error'),
        { timeout: 8000, maximumAge: 300000 },
      )
    } catch {
      setGeo('error')
    }
  }

  const all = result?.properties ?? []
  const rows = useMemo(() => {
    let list = all
      .filter((p) => op === 'todas' || p.operation === op)
      .map((p) => ({
        p,
        km: center && p.lat !== null && p.lng !== null ? haversineKm(center.lat, center.lng, p.lat, p.lng) : null,
      }))
    if (textOnly) {
      list = list.filter(({ p }) => norm(`${p.title} ${p.city} ${p.zone} ${p.postalCode}`).includes(textOnly))
    }
    const inRadius = center && radius > 0 ? list.filter((r) => r.km !== null && r.km <= radius) : list
    const sorter = {
      cercania: (a: (typeof list)[number], b: (typeof list)[number]) => (a.km ?? 1e9) - (b.km ?? 1e9),
      rentabilidad: (a: (typeof list)[number], b: (typeof list)[number]) => b.p.yield - a.p.yield,
      progreso: (a: (typeof list)[number], b: (typeof list)[number]) => b.p.funded / b.p.price - a.p.funded / a.p.price,
    }[center || sort !== 'cercania' ? sort : 'rentabilidad']
    return { inRadius: [...inRadius].sort(sorter), nearest: [...list].filter((r) => r.km !== null).sort((a, b) => (a.km ?? 0) - (b.km ?? 0)).slice(0, 3), total: list.length }
  }, [all, op, center, radius, sort, textOnly])

  const submit = (v: string) => {
    setQuery(v)
    setApplied(v)
    setGeo('idle')
    setUserPos(null)
  }
  const clear = () => {
    setQuery('')
    setApplied('')
    setUserPos(null)
    setGeo('idle')
  }

  const geoMsg: Record<GeoState, string> = {
    idle: '',
    loading: 'Obteniendo tu ubicación…',
    ok: 'Usando tu ubicación (solo se procesa en tu navegador).',
    denied: 'No has dado permiso de ubicación. Puedes buscar por ciudad, barrio o código postal.',
    unsupported: 'Tu navegador no soporta geolocalización. Busca por ciudad, barrio o código postal.',
    error: 'No hemos podido obtener tu ubicación. Prueba de nuevo o busca por ciudad.',
  }

  return (
    <section id="invertir" className="bg-snow py-20 sm:py-24">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Invertir"
          title={<>Qué hay <span className="grad-text">cerca de tu casa</span> o en otra ciudad</>}
          sub="Busca por ciudad, barrio o código postal, o usa tu ubicación. Ordena por cercanía, rentabilidad o financiación."
        />

        <motion.div variants={rise} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <form
            className="flex flex-col gap-2 lg:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              submit(query)
            }}
            role="search"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar por ciudad, barrio o código postal"
                placeholder="Ciudad, barrio o código postal (p. ej. Delicias, 28010)"
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-slate-900 placeholder:text-slate-500"
              />
              {(query || userPos) && (
                <button type="button" onClick={clear} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full hover:bg-slate-100">
                  <X size={16} aria-hidden />
                </button>
              )}
            </div>
            <Button type="submit" aria-label="Buscar">Buscar</Button>
            <Button type="button" variant="ghost" onClick={useMyLocation} aria-label="Usar mi ubicación" disabled={geo === 'loading'}>
              {geo === 'loading' ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Crosshair size={16} aria-hidden />} Usar mi ubicación
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-600">Sugerencias:</span>
            {QUICK_CITIES.map((c) => (
              <button key={c} type="button" onClick={() => submit(c)} aria-label={`Buscar en ${c}`} className="min-h-9 rounded-full border border-slate-300 bg-white px-3 text-slate-700 hover:border-brand hover:text-brand">
                {c}
              </button>
            ))}
          </div>
          {geo !== 'idle' && (
            <p role="status" className={`mt-3 rounded-lg px-3 py-2 text-sm ${geo === 'ok' || geo === 'loading' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
              {geoMsg[geo]}
            </p>
          )}
          {applied && !place && (
            <p role="status" className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
              No conocemos la ubicación “{applied}”: filtramos por coincidencia de texto.
            </p>
          )}

          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
            <div>
              <label htmlFor="radius" className="mb-1 block text-xs font-semibold text-slate-700">Radio de distancia</label>
              <select id="radius" value={radius} onChange={(e) => setRadius(+e.target.value)} disabled={!center} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm disabled:bg-slate-100 disabled:text-slate-500">
                {RADII.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}
              </select>
              {!center && <p className="mt-1 text-xs text-slate-600">Elige una ubicación para activar el radio.</p>}
            </div>
            <div>
              <label htmlFor="sort" className="mb-1 block text-xs font-semibold text-slate-700">Ordenar por</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm">
                <option value="cercania" disabled={!center}>Cercanía</option>
                <option value="rentabilidad">Rentabilidad estimada</option>
                <option value="progreso">Progreso de financiación</option>
              </select>
            </div>
            <div>
              <span className="mb-1 block text-xs font-semibold text-slate-700">Tipo de proyecto</span>
              <div className="flex gap-1" role="group" aria-label="Tipo de proyecto">
                {([['todas', 'Todos'], ['alquiler', 'Alquiler'], ['compraventa', 'Compra y venta']] as const).map(([v, l]) => (
                  <button key={v} aria-pressed={op === v} onClick={() => setOp(v)} className={`min-h-11 flex-1 rounded-lg border px-2 text-xs font-semibold sm:text-sm ${op === v ? 'border-transparent bg-brand text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-4">
          <DataStatus result={result} loading={loading} outage={outage} onOutage={toggleOutage} onRetry={retry} />
        </div>

        <div className="mt-6" aria-live="polite">
          <p className="mb-4 text-sm text-slate-700">
            {loading && !result ? 'Cargando oportunidades…' : (
              <>
                <b>{rows.inRadius.length}</b> {rows.inRadius.length === 1 ? 'oportunidad' : 'oportunidades'}
                {center && radius > 0 ? <> en {radius} km de <b>{center.label}</b></> : center ? <> ordenadas respecto a <b>{center.label}</b></> : null}
              </>
            )}
          </p>

          {rows.inRadius.length > 0 ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {rows.inRadius.map(({ p, km }) => (
                  <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                    <PropertyCard p={p} km={km} centerLabel={center?.label} isUser={!!center?.isUser} onInvest={() => onInvest(p)} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : !loading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <MapPin className="mx-auto text-brand" aria-hidden />
              <h3 className="mt-2 text-lg font-semibold">No hay inmuebles {radius > 0 && center ? `a menos de ${radius} km de ${center.label}` : 'con esos criterios'}</h3>
              {rows.nearest.length > 0 && (
                <>
                  <p className="mt-1 text-sm text-slate-600">Los más cercanos:</p>
                  <ul className="mx-auto mt-3 max-w-md space-y-2 text-left text-sm">
                    {rows.nearest.map(({ p, km }) => (
                      <li key={p.id} className="flex justify-between gap-3 rounded-lg bg-snow px-3 py-2">
                        <span>{p.title}</span>
                        <b className="shrink-0 text-brand">{km !== null ? fmtKm(km) : ''}</b>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {radius !== 0 && <Button onClick={() => setRadius(radius < 50 ? 50 : 0)}>{radius < 50 ? 'Ampliar a 50 km' : 'Ampliar a toda España'}</Button>}
                <Button variant="ghost" onClick={() => { clear(); setRadius(0); setOp('todas') }}>Ver todas las oportunidades</Button>
              </div>
            </div>
          ) : null}
        </div>
      </Reveal>
    </section>
  )
}
