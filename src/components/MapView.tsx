import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Property } from '../services/properties/types'

export interface MapItem {
  p: Property
  title: string
}

/** Mapa OpenStreetMap con marcadores divIcon (sin imágenes de marcador de Leaflet). */
export default function MapView({
  items, center, onSelect, ariaLabel,
}: { items: MapItem[]; center: { lat: number; lng: number } | null; onSelect: (p: Property) => void; ariaLabel: string }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!el.current || map.current) return
    const m = L.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView([40.2, -3.7], 6)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    return () => {
      m.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    const m = map.current
    const g = layer.current
    if (!m || !g) return
    g.clearLayers()
    const pts: L.LatLngExpression[] = []
    for (const { p, title } of items) {
      if (p.lat === null || p.lng === null) continue
      const icon = L.divIcon({
        className: '',
        html: `<span class="nx-pin">${p.yield.toLocaleString('es-ES', { maximumFractionDigits: 1 })}%</span>`,
        iconSize: [52, 28],
        iconAnchor: [26, 28],
      })
      const mk = L.marker([p.lat, p.lng], { icon, title, keyboard: true, alt: title })
      mk.on('click', () => onSelect(p))
      mk.addTo(g)
      pts.push([p.lat, p.lng])
    }
    if (center) {
      L.circleMarker([center.lat, center.lng], { radius: 8, color: '#fff', weight: 3, fillColor: '#4F46E5', fillOpacity: 1 }).addTo(g)
      pts.push([center.lat, center.lng])
    }
    if (pts.length) m.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 13 })
  }, [items, center, onSelect])

  return <div ref={el} role="region" aria-label={ariaLabel} className="z-0 h-[480px] w-full overflow-hidden rounded-2xl border border-slate-200" />
}
