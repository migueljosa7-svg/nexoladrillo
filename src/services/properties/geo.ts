export interface Place {
  name: string
  kind: 'ciudad' | 'zona'
  city: string
  lat: number
  lng: number
  aliases?: string[]
}

export const PLACES: Place[] = [
  { name: 'Zaragoza', kind: 'ciudad', city: 'Zaragoza', lat: 41.6488, lng: -0.8891 },
  { name: 'Madrid', kind: 'ciudad', city: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Valencia', kind: 'ciudad', city: 'Valencia', lat: 39.4699, lng: -0.3763 },
  { name: 'Málaga', kind: 'ciudad', city: 'Málaga', lat: 36.7213, lng: -4.4214 },
  { name: 'Sevilla', kind: 'ciudad', city: 'Sevilla', lat: 37.3891, lng: -5.9845 },
  { name: 'Barcelona', kind: 'ciudad', city: 'Barcelona', lat: 41.3874, lng: 2.1686 },
  { name: 'Bilbao', kind: 'ciudad', city: 'Bilbao', lat: 43.263, lng: -2.935 },
  { name: 'Palma', kind: 'ciudad', city: 'Palma', lat: 39.5696, lng: 2.6502, aliases: ['mallorca', 'palma de mallorca'] },
  { name: 'Las Palmas', kind: 'ciudad', city: 'Las Palmas', lat: 28.1235, lng: -15.4363, aliases: ['gran canaria'] },
  { name: 'Alicante', kind: 'ciudad', city: 'Alicante', lat: 38.3452, lng: -0.481 },
  { name: 'Granada', kind: 'ciudad', city: 'Granada', lat: 37.1773, lng: -3.5986 },
  { name: 'Huesca', kind: 'ciudad', city: 'Huesca', lat: 42.1401, lng: -0.4089 },
  { name: 'Utebo', kind: 'ciudad', city: 'Zaragoza', lat: 41.7125, lng: -1.0036 },
  { name: 'Cuarte de Huerva', kind: 'ciudad', city: 'Zaragoza', lat: 41.6139, lng: -0.9319 },
  { name: 'Delicias', kind: 'zona', city: 'Zaragoza', lat: 41.6525, lng: -0.9125 },
  { name: 'Actur', kind: 'zona', city: 'Zaragoza', lat: 41.676, lng: -0.898 },
  { name: 'Salamanca', kind: 'zona', city: 'Madrid', lat: 40.4268, lng: -3.6805 },
  { name: 'Chamberí', kind: 'zona', city: 'Madrid', lat: 40.435, lng: -3.704 },
  { name: 'Carabanchel', kind: 'zona', city: 'Madrid', lat: 40.3856, lng: -3.7291 },
  { name: 'Ruzafa', kind: 'zona', city: 'Valencia', lat: 39.4614, lng: -0.3735 },
  { name: 'Benimaclet', kind: 'zona', city: 'Valencia', lat: 39.4906, lng: -0.3612 },
  { name: 'Soho', kind: 'zona', city: 'Málaga', lat: 36.7158, lng: -4.429 },
  { name: 'Teatinos', kind: 'zona', city: 'Málaga', lat: 36.7187, lng: -4.4693 },
  { name: 'Triana', kind: 'zona', city: 'Sevilla', lat: 37.3825, lng: -6.0036 },
  { name: 'Nervión', kind: 'zona', city: 'Sevilla', lat: 37.3829, lng: -5.9718 },
  { name: 'Eixample', kind: 'zona', city: 'Barcelona', lat: 41.3926, lng: 2.162, aliases: ['ensanche'] },
  { name: 'Gràcia', kind: 'zona', city: 'Barcelona', lat: 41.4036, lng: 2.157 },
  { name: 'Poblenou', kind: 'zona', city: 'Barcelona', lat: 41.4036, lng: 2.2004 },
  { name: 'Indautxu', kind: 'zona', city: 'Bilbao', lat: 43.2602, lng: -2.9345 },
]

/** Prefijo de código postal (2 dígitos) → capital de provincia. */
const POSTAL_PREFIX: Record<string, string> = {
  '50': 'Zaragoza', '28': 'Madrid', '46': 'Valencia', '29': 'Málaga', '41': 'Sevilla',
  '08': 'Barcelona', '48': 'Bilbao', '07': 'Palma', '35': 'Las Palmas', '03': 'Alicante',
  '18': 'Granada', '22': 'Huesca',
}

export const QUICK_CITIES = ['Zaragoza', 'Madrid', 'Valencia', 'Málaga', 'Sevilla', 'Barcelona']

export const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export interface ResolvedPlace {
  label: string
  lat: number
  lng: number
}

/** Resuelve texto libre (ciudad, barrio, CP) a coordenadas aproximadas. Nunca lanza. */
export function resolvePlace(query: string): ResolvedPlace | null {
  const q = norm(query)
  if (!q) return null
  if (/^\d{5}$/.test(q)) {
    const city = POSTAL_PREFIX[q.slice(0, 2)]
    const p = PLACES.find((x) => x.name === city)
    return p ? { label: `CP ${q} (${p.name})`, lat: p.lat, lng: p.lng } : null
  }
  const match =
    PLACES.find((p) => norm(p.name) === q || p.aliases?.some((a) => norm(a) === q)) ??
    PLACES.find((p) => norm(p.name).startsWith(q) && q.length >= 3) ??
    PLACES.find((p) => (norm(p.name).includes(q) || p.aliases?.some((a) => norm(a).includes(q))) && q.length >= 3)
  return match ? { label: match.kind === 'zona' ? `${match.name}, ${match.city}` : match.name, lat: match.lat, lng: match.lng } : null
}

export const cityCenter = (city: string): { lat: number; lng: number } | null => {
  const p = PLACES.find((x) => norm(x.name) === norm(city))
  return p ? { lat: p.lat, lng: p.lng } : null
}

/** Distancia en km entre dos coordenadas (fórmula de Haversine). */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}

export const fmtKm = (km: number) =>
  km < 1 ? 'a menos de 1 km' : `a ${km.toLocaleString('es-ES', { maximumFractionDigits: km < 10 ? 1 : 0 })} km`
