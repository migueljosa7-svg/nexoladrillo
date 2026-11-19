import { useCallback, useEffect, useRef, useState } from 'react'
import { loadProperties } from './propertyGateway'
import type { GatewayResult } from './types'

export function useProperties() {
  const [result, setResult] = useState<GatewayResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [outage, setOutage] = useState(false)
  const alive = useRef(true)

  const refresh = useCallback(async (simulateOutage: boolean) => {
    setLoading(true)
    // loadProperties nunca rechaza, pero blindamos igualmente la promesa.
    const r = await loadProperties({ simulateOutage }).catch(() => null)
    if (!alive.current) return
    if (r) setResult(r)
    setLoading(false)
  }, [])

  useEffect(() => {
    alive.current = true
    void refresh(false)
    return () => {
      alive.current = false
    }
  }, [refresh])

  const toggleOutage = useCallback(
    (v: boolean) => {
      setOutage(v)
      void refresh(v)
    },
    [refresh],
  )

  return { result, loading, outage, toggleOutage, retry: () => refresh(outage) }
}
