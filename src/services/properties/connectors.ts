import type { AdapterId } from './adapters'
import { BASE, CORRUPT, shapeA, shapeB, shapeC, shapeGeo } from './seed'
import type { SourceKind } from './types'

export interface Connector {
  id: string
  label: string
  kind: SourceKind
  adapter: AdapterId
  /** Devuelve el payload crudo. Puede lanzar: el orquestador lo captura. */
  load: (ctx: { signal: AbortSignal; simulateOutage: boolean }) => Promise<unknown>
  /** Si es true no se intenta (p. ej. URL no configurada). */
  disabled?: boolean
}

const TIMEOUT_MS = 3500

/** fetch con timeout y validación estricta; todos los fallos se convierten en Error con mensaje claro. */
export async function fetchJson(url: string, outer: AbortSignal): Promise<unknown> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  const onOuter = () => ctrl.abort()
  outer.addEventListener('abort', onOuter)
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(res.status === 429 ? 'Límite de peticiones (429)' : `HTTP ${res.status}`)
    const type = res.headers.get('content-type') ?? ''
    const text = await res.text()
    if (/text\/html/i.test(type) || text.trimStart().startsWith('<')) throw new Error('Respuesta no JSON (HTML)')
    try {
      return JSON.parse(text)
    } catch {
      throw new Error('JSON inválido')
    }
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') throw new Error('Tiempo de espera agotado')
    if (e instanceof TypeError) throw new Error('Red/CORS no disponible')
    throw e instanceof Error ? e : new Error('Error desconocido')
  } finally {
    clearTimeout(timer)
    outer.removeEventListener('abort', onOuter)
  }
}

const remote = (id: string, label: string, url: string, adapter: AdapterId = 'list'): Connector => ({
  id, label, kind: 'remote', adapter, disabled: !url,
  load: async ({ signal, simulateOutage }) => {
    if (simulateOutage) throw new Error('Caída simulada')
    return fetchJson(url, signal)
  },
})

/** URLs opcionales de APIs JSON propias: VITE_PROPERTY_API_URLS="https://a/api,https://b/api,https://c/api" */
const ENV_URLS = String(import.meta.env?.VITE_PROPERTY_API_URLS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

type Shape = 'A' | 'B' | 'C' | 'geo'
const shapeOf = (s: Shape, rows: typeof BASE) => {
  const fn: Record<'A' | 'B' | 'C', (x: (typeof BASE)[number]) => unknown> = { A: shapeA, B: shapeB, C: shapeC }
  if (s === 'geo') return { type: 'FeatureCollection', features: [...rows.map(shapeGeo), null] }
  return { data: [...rows.map(fn[s]), ...CORRUPT] }
}

const backup = (id: string, label: string, shape: Shape, pick: (p: (typeof BASE)[number]) => boolean): Connector => ({
  id, label, kind: 'backup', adapter: shape === 'geo' ? 'geojson' : 'list',
  load: async () => shapeOf(shape, BASE.filter(pick)),
})

/** Cadena priorizada: remotos → respaldos por zona → respaldos por operación → generador. */
export const CONNECTORS: Connector[] = [
  remote('api-1', 'API JSON configurable #1', ENV_URLS[0] ?? ''),
  remote('api-2', 'API JSON configurable #2', ENV_URLS[1] ?? ''),
  remote('api-3', 'API JSON configurable #3', ENV_URLS[2] ?? ''),
  remote('catalog-primary', 'Catálogo remoto principal', '/data/catalog-primary.json'),
  remote('catalog-secondary', 'Catálogo remoto GeoJSON', '/data/catalog-secondary.json', 'geojson'),
  backup('zona-zaragoza', 'Respaldo zona Aragón', 'A', (p) => ['Zaragoza', 'Utebo', 'Cuarte de Huerva'].includes(p.city)),
  backup('zona-madrid', 'Respaldo zona Madrid', 'B', (p) => p.city === 'Madrid'),
  backup('zona-barcelona', 'Respaldo zona Cataluña', 'C', (p) => p.city === 'Barcelona'),
  backup('zona-valencia', 'Respaldo zona Valencia', 'geo', (p) => p.city === 'Valencia'),
  backup('zona-malaga', 'Respaldo zona Málaga', 'A', (p) => p.city === 'Málaga'),
  backup('zona-sevilla', 'Respaldo zona Sevilla', 'B', (p) => p.city === 'Sevilla'),
  backup('zona-norte', 'Respaldo zona Norte', 'C', (p) => p.city === 'Bilbao'),
  backup('zona-islas', 'Respaldo Islas', 'geo', (p) => ['Palma', 'Las Palmas'].includes(p.city)),
  backup('op-alquiler', 'Proyectos de Alquiler', 'A', (p) => p.op === 'alquiler'),
  backup('op-compraventa', 'Proyectos de Compra y venta', 'B', (p) => p.op === 'compraventa'),
  {
    id: 'generador-local', label: 'Generador de respaldo local', kind: 'generator', adapter: 'list',
    load: async () => ({
      data: BASE.slice(0, 8).map((x, i) => ({ ...shapeA(x), id: `gen-${i}`, title: `${x.title} (muestra)` })),
    }),
  },
]
