import { fetchJson } from './connectors'
import { resolvePlace, type ResolvedPlace } from './geo'

/**
 * Geocodificación en cascada y a prueba de fallos:
 *  1) Gazetteer local (instantáneo, sin red).
 *  2) Zippopotam.us para códigos postales españoles (API pública con CORS).
 *  3) Photon (komoot, sobre datos de OpenStreetMap) para cualquier otro lugar (API pública con CORS).
 * Cualquier error de red devuelve null/[]; nunca lanza.
 */
const sig = () => new AbortController().signal

export interface Suggestion {
  label: string
  lat: number
  lng: number
}

const asObj = (v: unknown): Record<string, unknown> | null => (typeof v === 'object' && v !== null ? (v as Record<string, unknown>) : null)

async function zippo(cp: string): Promise<ResolvedPlace | null> {
  try {
    const data = asObj(await fetchJson(`https://api.zippopotam.us/es/${encodeURIComponent(cp)}`, sig()))
    const place = Array.isArray(data?.places) ? asObj(data.places[0]) : null
    const lat = Number(place?.latitude)
    const lng = Number(place?.longitude)
    if (!place || !Number.isFinite(lat) || !Number.isFinite(lng)) return null
    return { label: `CP ${cp} (${String(place['place name'] ?? '')})`, lat, lng }
  } catch {
    return null
  }
}

export async function photonSearch(q: string, limit = 5): Promise<Suggestion[]> {
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=${limit + 5}&lang=en&osm_tag=place`
    const data = asObj(await fetchJson(url, sig()))
    const feats = Array.isArray(data?.features) ? data.features : []
    const out: Suggestion[] = []
    for (const f of feats) {
      const o = asObj(f)
      const props = asObj(o?.properties)
      const coords = asObj(o?.geometry)?.coordinates
      if (!props || !Array.isArray(coords) || String(props.countrycode ?? '').toUpperCase() !== 'ES') continue
      const lng = Number(coords[0])
      const lat = Number(coords[1])
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !props.name) continue
      const label = [props.name, props.state].filter((x, i, a) => x && a.indexOf(x) === i).join(', ')
      if (!out.some((s) => s.label === label)) out.push({ label, lat, lng })
      if (out.length >= limit) break
    }
    return out
  } catch {
    return []
  }
}

export async function geocode(query: string): Promise<ResolvedPlace | null> {
  const local = resolvePlace(query)
  if (local) return local
  const q = query.trim()
  if (q.length < 3) return null
  if (/^\d{5}$/.test(q)) {
    const z = await zippo(q)
    if (z) return z
  }
  const [first] = await photonSearch(q, 1)
  return first ?? null
}
