import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Crosshair, Heart, List, Loader2, Map as MapIcon, MapPin, Search, X } from 'lucide-react'
import { useProperties } from '../services/properties/useProperties'
import { QUICK_CITIES, haversineKm, norm, resolvePlace } from '../services/properties/geo'
import { geocode, photonSearch, type Suggestion } from '../services/properties/geocoder'
import type { Property } from '../services/properties/types'
import { useI18n } from '../i18n'
import { propertyTitle } from '../i18n/display'
import { useFavorites } from '../hooks'
import { Button, Reveal, SectionHead, rise } from '../components/ui'
import DataStatus from '../components/DataStatus'
import PropertyCard, { CardSkeleton } from '../components/PropertyCard'

const MapView = lazy(() => import('../components/MapView'))

type Sort = 'cercania' | 'rentabilidad' | 'progreso'
type Center = { lat: number; lng: number; label: string; isUser: boolean }
type GeoState = 'idle' | 'loading' | 'ok' | 'denied' | 'unsupported' | 'error'
const RADII = [5, 15, 50, 0]
const PAGE = 9

export default function Catalog({ onOpen }: { onOpen: (p: Property) => void }) {
  const { m, t, km: fmtKm } = useI18n()
  const { result, loading, outage, toggleOutage, retry } = useProperties()
  const { favs, toggle } = useFavorites()
  const [query, setQuery] = useState('')
  const [applied, setApplied] = useState('')
  const [remote, setRemote] = useState<Center | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [userPos, setUserPos] = useState<Center | null>(null)
  const [geo, setGeo] = useState<GeoState>('idle')
  const [radius, setRadius] = useState(0)
  const [sort, setSort] = useState<Sort>('rentabilidad')
  const [op, setOp] = useState<'todas' | 'alquiler' | 'compraventa'>('todas')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [visible, setVisible] = useState(PAGE)
  const [sugg, setSugg] = useState<Suggestion[]>([])
  const [focus, setFocus] = useState(false)
  const alive = useRef(true)

  useEffect(() => () => { alive.current = false }, [])

  const local = useMemo(() => (applied ? resolvePlace(applied) : null), [applied])
  const place = local ?? remote
  const center: Center | null = place ? { ...place, isUser: false } : userPos
  const textOnly = applied && !place && !geocoding ? norm(applied) : ''

  // Resolución con APIs abiertas (Zippopotam / Photon) cuando el gazetteer local no conoce el lugar
  useEffect(() => {
    setRemote(null)
    if (!applied || local) return setGeocoding(false)
    setGeocoding(true)
    void geocode(applied).then((r) => {
      if (!alive.current) return
      setRemote(r ? { ...r, isUser: false } : null)
      setGeocoding(false)
    })
  }, [applied, local])

  // Autocompletado (con debounce) para lugares fuera del gazetteer
  useEffect(() => {
    const q = query.trim()
    if (q.length < 3 || !focus) return setSugg([])
    const id = setTimeout(() => {
      void photonSearch(q, 5).then((r) => alive.current && setSugg(r))
    }, 400)
    return () => clearTimeout(id)
  }, [query, focus])

  const useMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return setGeo('unsupported')
    setGeo('loading')
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: '', isUser: true })
          setApplied('')
          setQuery('')
          setGeo('ok')
          setRadius((r) => (r === 0 ? 50 : r))
          setSort('cercania')
        },
        (err) => setGeo(err.code === 1 ? 'denied' : 'error'),
        { timeout: 8000, maximumAge: 300000 },
      )
    } catch {
      setGeo('error')
    }
  }

  const all = result?.properties ?? []
  const data = useMemo(() => {
    type Row = { p: Property; km: number | null }
    let list: Row[] = all
      .filter((p) => (op === 'todas' || p.operation === op) && (!onlyFavs || favs.includes(p.id)))
      .map((p) => ({ p, km: center && p.lat !== null && p.lng !== null ? haversineKm(center.lat, center.lng, p.lat, p.lng) : null }))
    if (textOnly) list = list.filter(({ p }) => norm(`${p.title} ${p.city} ${p.zone} ${p.postalCode}`).includes(textOnly))
    const inRadius = center && radius > 0 ? list.filter((r) => r.km !== null && r.km <= radius) : list
    const effective: Sort = sort === 'cercania' && !center ? 'rentabilidad' : sort
    const sorters: Record<Sort, (a: Row, b: Row) => number> = {
      cercania: (a, b) => (a.km ?? 1e9) - (b.km ?? 1e9),
      rentabilidad: (a, b) => b.p.yield - a.p.yield,
      progreso: (a, b) => b.p.funded / b.p.price - a.p.funded / a.p.price,
    }
    return {
      rows: [...inRadius].sort(sorters[effective]),
      nearest: list.filter((r) => r.km !== null).sort((a, b) => (a.km ?? 0) - (b.km ?? 0)).slice(0, 3),
    }
  }, [all, op, onlyFavs, favs, center, radius, sort, textOnly])

  useEffect(() => setVisible(PAGE), [applied, radius, sort, op, onlyFavs, userPos])

  const submit = (v: string) => {
    setQuery(v)
    setApplied(v.trim())
    setGeo('idle')
    setUserPos(null)
    setSugg([])
    setFocus(false)
  }
  const pick = (s: Suggestion) => {
    setQuery(s.label)
    setApplied(s.label)
    setRemote({ lat: s.lat, lng: s.lng, label: s.label, isUser: false })
    setUserPos(null)
    setSugg([])
    setFocus(false)
  }
  const clear = () => {
    setQuery('')
    setApplied('')
    setUserPos(null)
    setGeo('idle')
  }
  const reset = () => {
    clear()
    setRadius(0)
    setOp('todas')
    setOnlyFavs(false)
  }
  const onSelectMap = useCallback((p: Property) => onOpen(p), [onOpen])

  const geoMsg: Record<GeoState, string> = {
    idle: '', loading: m.catalog.geoLoading, ok: m.catalog.geoOk, denied: m.catalog.geoDenied, unsupported: m.catalog.geoUnsupported, error: m.catalog.geoError,
  }
  const centerLabel = center?.isUser ? '' : center?.label
  const shown = data.rows.slice(0, visible)
  const mapItems = useMemo(() => data.rows.map(({ p }) => ({ p, title: propertyTitle(p, m) })), [data.rows, m])
  const missingCoords = data.rows.some(({ p }) => p.lat === null)
  const radiusLabel = (r: number) => (r === 0 ? m.catalog.radiusAll : `${r} km`)

  return (
    <section id="invertir" className="bg-snow py-20 sm:py-24">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow={m.catalog.eyebrow}
          title={<>{m.catalog.title1} <span className="grad-text">{m.catalog.title2}</span> {m.catalog.title3}</>}
          sub={m.catalog.sub}
        />

        <motion.div variants={rise} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <form className="flex flex-col gap-2 lg:flex-row" onSubmit={(e) => { e.preventDefault(); submit(query) }} role="search">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setTimeout(() => setFocus(false), 150)}
                aria-label={m.catalog.searchLabel}
                placeholder={m.catalog.searchPlaceholder}
                autoComplete="off"
                className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 text-slate-900 placeholder:text-slate-500"
              />
              {(query || userPos) && (
                <button type="button" onClick={clear} aria-label={m.catalog.clear} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full hover:bg-slate-100">
                  <X size={16} aria-hidden />
                </button>
              )}
              {sugg.length > 0 && (
                <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl" aria-label={m.catalog.placesHeading}>
                  {sugg.map((s) => (
                    <li key={s.label + s.lat}>
                      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s)} className="flex min-h-11 w-full items-center gap-2 px-4 text-left text-sm hover:bg-slate-50">
                        <MapPin size={14} className="text-brand" aria-hidden /> {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button type="submit">{m.catalog.search}</Button>
            <Button type="button" variant="ghost" onClick={useMyLocation} disabled={geo === 'loading'}>
              {geo === 'loading' ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Crosshair size={16} aria-hidden />} {m.catalog.useLocation}
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-600">{m.catalog.suggestions}</span>
            {QUICK_CITIES.map((c) => (
              <button key={c} type="button" onClick={() => submit(c)} aria-label={t(m.catalog.searchIn, { c })} className="min-h-9 rounded-full border border-slate-300 bg-white px-3 text-slate-700 transition-colors hover:border-brand hover:text-brand">
                {c}
              </button>
            ))}
          </div>
          <div aria-live="polite">
            {geo !== 'idle' && (
              <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${geo === 'ok' || geo === 'loading' ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>{geoMsg[geo]}</p>
            )}
            {geocoding && <p className="mt-3 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900"><Loader2 size={14} className="animate-spin" aria-hidden />{t(m.catalog.geocoding, { q: applied })}</p>}
            {remote && !geocoding && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{t(m.catalog.geocoded, { place: remote.label })}</p>}
            {textOnly && <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900">{t(m.catalog.textFilter, { q: applied })}</p>}
          </div>

          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="radius" className="mb-1 block text-xs font-semibold text-slate-700">{m.catalog.radius}</label>
              <select id="radius" value={radius} onChange={(e) => setRadius(+e.target.value)} disabled={!center} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm disabled:bg-slate-100 disabled:text-slate-500">
                {RADII.map((r) => <option key={r} value={r}>{radiusLabel(r)}</option>)}
              </select>
              {!center && <p className="mt-1 text-xs text-slate-600">{m.catalog.radiusHint}</p>}
            </div>
            <div>
              <label htmlFor="sort" className="mb-1 block text-xs font-semibold text-slate-700">{m.catalog.sort}</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm">
                <option value="cercania" disabled={!center}>{m.catalog.sortNear}</option>
                <option value="rentabilidad">{m.catalog.sortYield}</option>
                <option value="progreso">{m.catalog.sortProgress}</option>
              </select>
            </div>
            <div>
              <span className="mb-1 block text-xs font-semibold text-slate-700">{m.catalog.type}</span>
              <div className="flex gap-1" role="group" aria-label={m.catalog.type}>
                {([['todas', m.catalog.typeAll], ['alquiler', m.catalog.typeRent], ['compraventa', m.catalog.typeSale]] as const).map(([v, l]) => (
                  <button key={v} aria-pressed={op === v} onClick={() => setOp(v)} className={`min-h-11 flex-1 rounded-lg border px-1.5 text-xs font-semibold transition-colors sm:text-sm ${op === v ? 'border-transparent bg-brand text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button aria-pressed={onlyFavs} onClick={() => setOnlyFavs((v) => !v)} className={`inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 text-sm font-semibold ${onlyFavs ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-300 bg-white text-slate-700'}`}>
                <Heart size={14} className={onlyFavs ? 'fill-rose-500' : ''} aria-hidden /> {m.catalog.favoritesOnly}
              </button>
              <div className="flex overflow-hidden rounded-lg border border-slate-300" role="group" aria-label="Vista">
                {([['list', List, m.catalog.viewList], ['map', MapIcon, m.catalog.viewMap]] as const).map(([v, Icon, l]) => (
                  <button key={v} aria-pressed={view === v} aria-label={l} onClick={() => setView(v)} className={`grid min-h-11 w-11 place-items-center ${view === v ? 'bg-brand text-white' : 'bg-white text-slate-700'}`}>
                    <Icon size={16} aria-hidden />
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
            {loading && !result ? m.catalog.loading : (
              <>
                <b>{t(data.rows.length === 1 ? m.catalog.countOne : m.catalog.countMany, { n: data.rows.length })}</b>
                {center && radius > 0 ? <> · {t(m.catalog.withinOf, { r: radius, place: centerLabel || '📍' })}</> : center ? <> · {t(m.catalog.sortedFrom, { place: centerLabel || '📍' })}</> : null}
              </>
            )}
          </p>

          {loading && !result ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <li key={i}><CardSkeleton /></li>)}</ul>
          ) : data.rows.length > 0 ? (
            view === 'map' ? (
              <>
                <Suspense fallback={<div className="grid h-[480px] place-items-center rounded-2xl bg-slate-100 text-slate-600">{m.catalog.mapLoading}</div>}>
                  <MapView items={mapItems} center={center} onSelect={onSelectMap} ariaLabel={m.catalog.mapAria} />
                </Suspense>
                <p className="mt-2 text-xs text-slate-600">{m.footer.mapCredit}{missingCoords ? ` · ${m.catalog.mapNoCoords}` : ''}</p>
              </>
            ) : (
              <>
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {shown.map(({ p, km }) => (
                      <motion.li key={p.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                        <PropertyCard p={p} km={km} centerLabel={centerLabel} isUser={!!center?.isUser} fav={favs.includes(p.id)} onFav={() => toggle(p.id)} onOpen={() => onOpen(p)} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                {visible < data.rows.length && (
                  <div className="mt-8 text-center"><Button variant="ghost" onClick={() => setVisible((v) => v + PAGE)}>{m.catalog.showMore}</Button></div>
                )}
              </>
            )
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <MapPin className="mx-auto text-brand" aria-hidden />
              <h3 className="mt-2 text-lg font-semibold">
                {onlyFavs && favs.length === 0 ? m.catalog.favoritesEmpty : radius > 0 && center ? t(m.catalog.noneRadius, { r: radius, place: centerLabel || '📍' }) : m.catalog.none}
              </h3>
              {data.nearest.length > 0 && (
                <>
                  <p className="mt-1 text-sm text-slate-600">{m.catalog.nearest}</p>
                  <ul className="mx-auto mt-3 max-w-md space-y-2 text-left text-sm">
                    {data.nearest.map(({ p, km }) => (
                      <li key={p.id}>
                        <button onClick={() => onOpen(p)} className="flex w-full justify-between gap-3 rounded-lg bg-snow px-3 py-2 text-left hover:bg-indigo-50">
                          <span>{propertyTitle(p, m)}</span>
                          <b className="shrink-0 text-brand">{km !== null ? fmtKm(km) : ''}</b>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {radius !== 0 && <Button onClick={() => setRadius(radius < 50 ? 50 : 0)}>{radius < 50 ? m.catalog.widen50 : m.catalog.widenAll}</Button>}
                <Button variant="ghost" onClick={reset}>{m.catalog.viewAll}</Button>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
