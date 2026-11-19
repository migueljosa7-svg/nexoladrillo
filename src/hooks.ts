import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

/** Favoritos persistidos en localStorage (a prueba de almacenamiento bloqueado). */
export function useFavorites() {
  const KEY = 'nexoladrillo.favs.v1'
  const [favs, setFavs] = useState<string[]>(() => {
    try {
      const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
      return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
    } catch {
      return []
    }
  })
  const toggle = useCallback((id: string) => {
    setFavs((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        /* sin almacenamiento */
      }
      return next
    })
  }, [])
  return { favs, toggle }
}

/** Contador animado que arranca al entrar en pantalla. */
export function useCountUp(target: number, duration = 1.6) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, target, { duration, ease: 'easeOut', onUpdate: (x) => setV(x) })
    return () => c.stop()
  }, [inView, target, duration])
  return { ref, value: v }
}
