import type { Property } from '../services/properties/types'
import { interpolate } from './index'
import type { Messages } from './locales/es'

/** Título localizado: "{tipo} en {zona/ciudad}". Los nombres propios de lugar no se traducen. */
export function propertyTitle(p: Property, m: Messages): string {
  const place = p.zone && p.city && p.zone !== p.city ? `${p.zone}, ${p.city}` : p.zone || p.city || 'España'
  return interpolate(m.placeFmt, { asset: m.assets[p.asset], place })
}
export const propertyPlace = (p: Property) =>
  p.zone && p.city && p.zone !== p.city ? `${p.zone}, ${p.city}` : p.zone || p.city || 'España'
