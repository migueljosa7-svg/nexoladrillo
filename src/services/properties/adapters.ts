import { cityCenter } from './geo'
import type { AssetType, Operation, Property } from './types'

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)

/** Lee una ruta con puntos ("location.lat") sin lanzar nunca. */
function get(o: unknown, path: string): unknown {
  let cur: unknown = o
  for (const k of path.split('.')) {
    if (cur === null || cur === undefined) return undefined
    if (Array.isArray(cur)) cur = cur[Number(k)]
    else if (isObj(cur)) cur = cur[k]
    else return undefined
  }
  return cur
}
const pick = (o: unknown, keys: string[]): unknown => {
  for (const k of keys) {
    const v = get(o, k)
    if (v !== undefined && v !== null && v !== '') return v
  }
  return undefined
}

/** "185.000 €", "1.250,50", "7,5 %", 12000 → número. */
export function toNumber(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null
  if (typeof v !== 'string') return null
  let s = v.replace(/[^\d.,-]/g, '')
  if (!s) return null
  const lastComma = s.lastIndexOf(',')
  const lastDot = s.lastIndexOf('.')
  if (lastComma > -1 && lastDot > -1) {
    s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '')
  } else if (lastComma > -1) {
    s = /,\d{1,2}$/.test(s) ? s.replace(',', '.') : s.replace(/,/g, '')
  } else if (lastDot > -1 && /\.\d{3}$/.test(s) && s.indexOf('.') === lastDot) {
    s = s.replace('.', '')
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}
const toStr = (v: unknown): string | null => {
  if (typeof v === 'string' && v.trim()) return v.trim()
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  return null
}
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

function coords(raw: unknown): { lat: number | null; lng: number | null } {
  let lat = toNumber(pick(raw, ['lat', 'latitude', 'location.lat', 'location.latitude', 'coordinates.lat', 'coordinates.latitude', 'geo.lat', 'position.lat']))
  let lng = toNumber(pick(raw, ['lng', 'lon', 'long', 'longitude', 'location.lng', 'location.lon', 'location.longitude', 'coordinates.lng', 'coordinates.lon', 'coordinates.longitude', 'geo.lng', 'position.lng']))
  if (lat === null || lng === null) {
    // GeoJSON: [lng, lat]
    const arr = pick(raw, ['coordinates', 'geometry.coordinates', 'location.coordinates'])
    if (Array.isArray(arr) && arr.length >= 2) {
      lng = toNumber(arr[0])
      lat = toNumber(arr[1])
    }
  }
  if (lat === null || lng === null || Math.abs(lat) > 90 || Math.abs(lng) > 180) return { lat: null, lng: null }
  return { lat, lng }
}

function hash(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}

/**
 * Valida y normaliza un registro de cualquier fuente. Devuelve null si está corrupto.
 * Nunca lanza ni escribe en consola.
 */
export function normalizeProperty(raw: unknown, source = 'unknown'): Property | null {
  try {
    if (!isObj(raw)) return null
    const title = toStr(pick(raw, ['title', 'name', 'propertyName', 'nombre', 'titulo']))
    const price = toNumber(pick(raw, ['price', 'targetAmount', 'fundingGoal', 'goal', 'total', 'precio', 'amount.target']))
    if (!title || title.length < 3 || price === null || price <= 0) return null

    const city = toStr(pick(raw, ['city', 'ciudad', 'town', 'municipality', 'location.city', 'address.city'])) ?? ''
    const zone = toStr(pick(raw, ['zone', 'zona', 'barrio', 'district', 'neighborhood', 'location.zone', 'location.district', 'address.district'])) ?? ''
    let { lat, lng } = coords(raw)
    if ((lat === null || lng === null) && city) {
      const c = cityCenter(city)
      if (c) ({ lat, lng } = c)
    }

    let funded = toNumber(pick(raw, ['funded', 'raised', 'fundedAmount', 'currentAmount', 'amount.raised']))
    if (funded === null) {
      const pct = toNumber(pick(raw, ['fundedPct', 'progress', 'fundingProgress', 'percentFunded']))
      funded = pct !== null ? (clamp(pct, 0, 100) / 100) * price : 0
    }
    funded = clamp(funded, 0, price)

    const y = toNumber(pick(raw, ['yield', 'annualReturn', 'rentalYield', 'roi', 'rentabilidad', 'returns.annual', 'returns.yield']))
    const opRaw = (toStr(pick(raw, ['operation', 'operacion', 'type', 'category', 'kind'])) ?? '').toLowerCase()
    const operation: Operation = /alquil|rent|lease/.test(opRaw) ? 'alquiler' : 'compraventa'
    const aRaw = (toStr(pick(raw, ['asset', 'assetType', 'propertyType', 'tipo'])) ?? '').toLowerCase()
    const asset: AssetType = /local|retail|comerc/.test(aRaw) ? 'local' : /gara|park/.test(aRaw) ? 'garaje' : /edific|building/.test(aRaw) ? 'edificio' : 'vivienda'

    const id = toStr(pick(raw, ['id', 'uuid', 'ref', 'slug', 'code'])) ?? `h-${hash(title + city + zone)}`
    return {
      id,
      title,
      city,
      zone,
      postalCode: toStr(pick(raw, ['postalCode', 'zip', 'cp', 'postcode', 'address.zip'])) ?? '',
      lat,
      lng,
      operation,
      asset,
      price: Math.round(price),
      funded: Math.round(funded),
      minInvestment: clamp(toNumber(pick(raw, ['minInvestment', 'minTicket', 'minimum', 'minAmount'])) ?? 50, 1, 100000),
      yield: clamp(y ?? 6, 0, 30),
      emoji: toStr(pick(raw, ['emoji', 'icon'])) ?? (asset === 'local' ? '🏪' : asset === 'garaje' ? '🅿️' : asset === 'edificio' ? '🏢' : '🏠'),
      description: toStr(pick(raw, ['description', 'descripcion', 'summary', 'desc'])) ?? '',
      source,
    }
  } catch {
    return null
  }
}

// ───────────── Adaptadores por formato de payload → lista de registros crudos ─────────────
export type AdapterId = 'list' | 'geojson' | 'keyed'

const LIST_KEYS = ['data', 'items', 'results', 'properties', 'records', 'inmuebles', 'projects', 'listings']

function listAdapter(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (isObj(payload)) {
    for (const k of LIST_KEYS) {
      const v = payload[k]
      if (Array.isArray(v)) return v
      if (isObj(v)) {
        const nested = listAdapter(v)
        if (nested.length) return nested
      }
    }
  }
  return []
}
function geojsonAdapter(payload: unknown): unknown[] {
  if (!isObj(payload) || !Array.isArray(payload.features)) return []
  return payload.features.map((f) => (isObj(f) ? { ...(isObj(f.properties) ? f.properties : {}), geometry: f.geometry } : null))
}
function keyedAdapter(payload: unknown): unknown[] {
  if (!isObj(payload)) return []
  const inner = LIST_KEYS.map((k) => payload[k]).find(isObj) ?? payload
  return isObj(inner) ? Object.entries(inner).map(([k, v]) => (isObj(v) ? { id: k, ...v } : null)) : []
}

export const ADAPTERS: Record<AdapterId, (payload: unknown) => unknown[]> = {
  list: listAdapter,
  geojson: geojsonAdapter,
  keyed: keyedAdapter,
}

/** Aplica el adaptador (con red de seguridad: si no encuentra nada, prueba los demás). */
export function extractRecords(payload: unknown, preferred: AdapterId): unknown[] {
  try {
    const first = ADAPTERS[preferred](payload)
    if (first.length) return first
    for (const id of Object.keys(ADAPTERS) as AdapterId[]) {
      if (id === preferred) continue
      const r = ADAPTERS[id](payload)
      if (r.length) return r
    }
  } catch {
    /* payload inesperado */
  }
  return []
}
