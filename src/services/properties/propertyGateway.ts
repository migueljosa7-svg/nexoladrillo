import { extractRecords, normalizeProperty } from './adapters'
import { CONNECTORS, type Connector } from './connectors'
import type { GatewayMode, GatewayResult, Property, SourceReport } from './types'

const CACHE_KEY = 'nexoladrillo.properties.v1'
const MIN_BEFORE_GENERATOR = 6

function readCache(): Property[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return []
    const arr: unknown = JSON.parse(raw)
    return Array.isArray(arr) ? arr.map((r) => normalizeProperty(r, 'cache')).filter((p): p is Property => p !== null) : []
  } catch {
    return []
  }
}
function writeCache(list: Property[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list))
  } catch {
    /* almacenamiento no disponible */
  }
}

async function runConnector(c: Connector, signal: AbortSignal, simulateOutage: boolean): Promise<{ report: SourceReport; items: Property[] }> {
  const base = { id: c.id, label: c.label, kind: c.kind }
  if (c.disabled) return { report: { ...base, ok: false, skipped: true, count: 0, rejected: 0, ms: 0 }, items: [] }
  const t0 = performance.now()
  try {
    const payload = await c.load({ signal, simulateOutage })
    const records = extractRecords(payload, c.adapter)
    const items = records.map((r) => normalizeProperty(r, c.id)).filter((p): p is Property => p !== null)
    if (!records.length) throw new Error('Respuesta sin registros')
    return {
      report: { ...base, ok: items.length > 0, skipped: false, count: items.length, rejected: records.length - items.length, ms: Math.round(performance.now() - t0) },
      items,
    }
  } catch (e) {
    return {
      report: { ...base, ok: false, skipped: false, count: 0, rejected: 0, ms: Math.round(performance.now() - t0), error: e instanceof Error ? e.message : 'Fallo desconocido' },
      items: [],
    }
  }
}

/**
 * Orquesta todas las fuentes en paralelo (allSettled-style: cada conector captura sus propios fallos),
 * fusiona por prioridad sin duplicados y degrada a caché → generador. Nunca lanza ni escribe en consola.
 */
export async function loadProperties(opts: { simulateOutage?: boolean } = {}): Promise<GatewayResult> {
  const ctrl = new AbortController()
  const simulateOutage = !!opts.simulateOutage
  const primary = CONNECTORS.filter((c) => c.kind !== 'generator')
  const settled = await Promise.allSettled(primary.map((c) => runConnector(c, ctrl.signal, simulateOutage)))

  const reports: SourceReport[] = []
  const merged = new Map<string, Property>()
  const seenKeys = new Set<string>()
  const add = (items: Property[]) => {
    for (const p of items) {
      const key = `${p.title.toLowerCase()}|${p.city.toLowerCase()}`
      if (merged.has(p.id) || seenKeys.has(key)) continue
      merged.set(p.id, p)
      seenKeys.add(key)
    }
  }

  settled.forEach((s, i) => {
    if (s.status === 'fulfilled') {
      reports.push(s.value.report)
      add(s.value.items)
    } else {
      const c = primary[i]
      reports.push({ id: c.id, label: c.label, kind: c.kind, ok: false, skipped: false, count: 0, rejected: 0, ms: 0, error: 'Fallo inesperado' })
    }
  })

  const hasRemote = reports.some((r) => r.kind === 'remote' && r.ok)
  const hasBackup = reports.some((r) => r.kind === 'backup' && r.ok)
  let mode: GatewayMode = hasRemote ? 'live' : 'backup'

  if (merged.size < MIN_BEFORE_GENERATOR) {
    const cached = readCache()
    if (cached.length) {
      add(cached)
      mode = 'cache'
    }
  }
  const gen = CONNECTORS.find((c) => c.kind === 'generator')
  if (gen) {
    if (merged.size < MIN_BEFORE_GENERATOR) {
      const r = await runConnector(gen, ctrl.signal, simulateOutage)
      reports.push(r.report)
      add(r.items)
      if (!hasRemote && !hasBackup && mode !== 'cache') mode = 'generated'
    } else {
      reports.push({ id: gen.id, label: gen.label, kind: gen.kind, ok: false, skipped: true, count: 0, rejected: 0, ms: 0 })
    }
  }

  const properties = [...merged.values()]
  if (hasRemote || hasBackup) writeCache(properties)
  return { properties, reports, mode, at: Date.now() }
}
