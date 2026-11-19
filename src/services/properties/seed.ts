/**
 * Catálogo de demostración (datos ficticios). Se expone en distintos formatos "crudos"
 * para que los conectores de respaldo ejerciten los adaptadores como lo harían fuentes reales.
 */
type Base = {
  id: string; title: string; city: string; zone: string; pc: string; lat: number; lng: number
  op: 'compraventa' | 'alquiler'; asset: 'vivienda' | 'local' | 'garaje' | 'edificio'
  price: number; pct: number; min: number; yld: number; emoji: string; desc: string
}

const b = (
  id: string, title: string, city: string, zone: string, pc: string, lat: number, lng: number,
  op: Base['op'], asset: Base['asset'], price: number, pct: number, min: number, yld: number, emoji: string, desc: string,
): Base => ({ id, title, city, zone, pc, lat, lng, op, asset, price, pct, min, yld, emoji, desc })

export const BASE: Base[] = [
  b('zgz-01', 'Piso reformado en Delicias', 'Zaragoza', 'Delicias', '50009', 41.6531, -0.9098, 'alquiler', 'vivienda', 168000, 72, 50, 7.4, '🏠', 'Vivienda de 3 habitaciones junto a la estación, con inquilino y contrato de 3 años.'),
  b('zgz-02', 'Local comercial en Actur', 'Zaragoza', 'Actur', '50018', 41.6772, -0.8965, 'alquiler', 'local', 245000, 38, 100, 8.1, '🏪', 'Local de 90 m² junto al centro comercial, arrendado a cadena de alimentación.'),
  b('zgz-03', 'Reforma y venta en Casco Antiguo', 'Zaragoza', 'Casco Antiguo', '50003', 41.6561, -0.8773, 'compraventa', 'vivienda', 210000, 55, 100, 11.5, '🔨', 'Compra, reforma integral y venta en 10 meses. Rentabilidad estimada no garantizada.'),
  b('zgz-04', 'Plaza de garaje en Universidad', 'Zaragoza', 'Universidad', '50009', 41.6419, -0.9005, 'alquiler', 'garaje', 24000, 91, 25, 5.6, '🅿️', 'Plaza doble alquilada a largo plazo a trabajadores del hospital.'),
  b('utb-01', 'Adosado en Utebo', 'Utebo', 'Centro', '50180', 41.7131, -1.0042, 'compraventa', 'vivienda', 189000, 24, 100, 9.8, '🏡', 'Adosado con jardín para reforma ligera y venta a familias.'),
  b('cuh-01', 'Piso con terraza en Cuarte', 'Cuarte de Huerva', 'Centro', '50410', 41.6141, -0.9327, 'alquiler', 'vivienda', 142000, 63, 50, 6.9, '🌇', 'Piso con terraza y garaje, alquiler de media estancia.'),
  b('mad-01', 'Piso en Chamberí', 'Madrid', 'Chamberí', '28010', 40.4358, -3.7046, 'alquiler', 'vivienda', 385000, 81, 100, 5.9, '🏙️', 'Vivienda de 2 habitaciones, alquiler estable a profesionales.'),
  b('mad-02', 'Reforma en Carabanchel', 'Madrid', 'Carabanchel', '28025', 40.3849, -3.7285, 'compraventa', 'vivienda', 232000, 47, 100, 12.2, '🔨', 'Compra, reforma y venta de piso de 85 m² cerca de metro.'),
  b('mad-03', 'Local en Salamanca', 'Madrid', 'Salamanca', '28006', 40.4271, -3.6812, 'alquiler', 'local', 520000, 29, 250, 6.4, '🏬', 'Local a pie de calle en eje comercial, inquilino de moda.'),
  b('vlc-01', 'Apartamento en Ruzafa', 'Valencia', 'Ruzafa', '46006', 39.4619, -0.3741, 'alquiler', 'vivienda', 198000, 68, 50, 7.2, '🌆', 'Apartamento turístico licenciado de 1 habitación.'),
  b('vlc-02', 'Edificio en Benimaclet', 'Valencia', 'Benimaclet', '46020', 39.4911, -0.3608, 'compraventa', 'edificio', 640000, 33, 250, 10.6, '🏢', 'Edificio de 6 viviendas para rehabilitar y vender por unidades.'),
  b('agp-01', 'Estudio en el Soho', 'Málaga', 'Soho', '29002', 36.7161, -4.4287, 'alquiler', 'vivienda', 176000, 77, 50, 7.8, '🌴', 'Estudio reformado para alquiler de media estancia a nómadas digitales.'),
  b('agp-02', 'Piso en Teatinos', 'Málaga', 'Teatinos', '29010', 36.7192, -4.4688, 'compraventa', 'vivienda', 205000, 41, 100, 10.9, '🔨', 'Piso cerca de la universidad, reforma y venta.'),
  b('svq-01', 'Piso en Triana', 'Sevilla', 'Triana', '41010', 37.3829, -6.0031, 'alquiler', 'vivienda', 224000, 59, 100, 6.8, '🏘️', 'Vivienda con patio en pleno barrio de Triana.'),
  b('svq-02', 'Local en Nervión', 'Sevilla', 'Nervión', '41005', 37.3834, -5.9722, 'alquiler', 'local', 310000, 18, 100, 7.5, '🏪', 'Local de 120 m² cerca del estadio, arrendado a clínica.'),
  b('bcn-01', 'Piso en el Eixample', 'Barcelona', 'Eixample', '08009', 41.3926, 2.1625, 'alquiler', 'vivienda', 460000, 86, 250, 5.7, '🏛️', 'Finca regia con vivienda de 3 habitaciones y alquiler estable.'),
  b('bcn-02', 'Reforma en Gràcia', 'Barcelona', 'Gràcia', '08012', 41.4041, 2.1566, 'compraventa', 'vivienda', 340000, 52, 250, 11.1, '🔨', 'Compra, reforma y venta de piso luminoso.'),
  b('bcn-03', 'Local en Poblenou', 'Barcelona', 'Poblenou', '08018', 41.4031, 2.2001, 'alquiler', 'local', 295000, 12, 100, 7.9, '🏬', 'Local para coworking y estudio creativo.'),
  b('bio-01', 'Piso en Indautxu', 'Bilbao', 'Indautxu', '48011', 43.2606, -2.9339, 'alquiler', 'vivienda', 275000, 66, 100, 6.2, '🏞️', 'Vivienda reformada junto al centro de Bilbao.'),
  b('pmi-01', 'Apartamento en Palma', 'Palma', 'Santa Catalina', '07012', 39.5718, 2.6341, 'alquiler', 'vivienda', 330000, 44, 100, 6.6, '⛵', 'Apartamento a 5 minutos del puerto, alquiler de temporada.'),
  b('lpa-01', 'Piso en Las Palmas', 'Las Palmas', 'Las Canteras', '35010', 28.1403, -15.4348, 'alquiler', 'vivienda', 189000, 71, 50, 7.0, '🌊', 'Piso a 200 m de la playa, alta demanda todo el año.'),
]

const kind = (o: Base['op']) => (o === 'alquiler' ? 'Rent' : 'Sale')

/** Formato A: nombres planos en español/inglés mixto. */
export const shapeA = (x: Base) => ({
  id: x.id, title: x.title, city: x.city, zone: x.zone, postalCode: x.pc, lat: x.lat, lng: x.lng,
  operation: x.op, asset: x.asset, price: x.price, funded: Math.round((x.price * x.pct) / 100),
  minInvestment: x.min, yield: x.yld, emoji: x.emoji, description: x.desc,
})
/** Formato B: importes como texto con símbolo, coordenadas anidadas. */
export const shapeB = (x: Base) => ({
  uuid: x.id, name: x.title, ciudad: x.city, barrio: x.zone, zip: x.pc,
  coordinates: { lat: x.lat, lng: x.lng }, category: kind(x.op), propertyType: x.asset,
  targetAmount: `${x.price.toLocaleString('de-DE')} €`, raised: `${Math.round((x.price * x.pct) / 100).toLocaleString('de-DE')} €`,
  annualReturn: `${String(x.yld).replace('.', ',')} %`, minAmount: x.min, summary: x.desc,
})
/** Formato C: todo anidado, progreso en %, rentabilidad como texto. */
export const shapeC = (x: Base) => ({
  ref: x.id, propertyName: x.title,
  location: { city: x.city, district: x.zone, latitude: String(x.lat), longitude: String(x.lng) },
  address: { zip: x.pc }, operacion: x.op, tipo: x.asset, fundingGoal: x.price, progress: x.pct,
  returns: { annual: `${x.yld}%` }, minTicket: x.min, desc: x.desc,
})
/** Formato GeoJSON. */
export const shapeGeo = (x: Base) => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [x.lng, x.lat] },
  properties: { id: x.id, title: x.title, city: x.city, zone: x.zone, operation: x.op, asset: x.asset, price: x.price, fundedPct: x.pct, minInvestment: x.min, yield: x.yld, description: x.desc },
})

/** Registros corruptos a propósito para demostrar que se descartan en silencio. */
export const CORRUPT: unknown[] = [null, 42, 'texto', { title: 'x' }, { name: 'Sin precio', city: 'Madrid' }, { title: 'Precio negativo', price: -5 }, []]
