export type Operation = 'compraventa' | 'alquiler'
export type AssetType = 'vivienda' | 'local' | 'garaje' | 'edificio'

export interface Property {
  id: string
  title: string
  city: string
  zone: string
  postalCode: string
  lat: number | null
  lng: number | null
  operation: Operation
  asset: AssetType
  /** Importe total objetivo de la operación (EUR). */
  price: number
  /** Importe ya financiado (EUR), 0..price. */
  funded: number
  /** Inversión mínima por inversor (EUR). */
  minInvestment: number
  /** Rentabilidad anual estimada (%). */
  yield: number
  emoji: string
  description: string
  /** Id del conector que aportó el registro. */
  source: string
}

export type SourceKind = 'remote' | 'backup' | 'generator'

export interface SourceReport {
  id: string
  label: string
  kind: SourceKind
  ok: boolean
  skipped: boolean
  count: number
  rejected: number
  ms: number
  error?: string
}

export type GatewayMode = 'live' | 'backup' | 'cache' | 'generated'

export interface GatewayResult {
  properties: Property[]
  reports: SourceReport[]
  mode: GatewayMode
  at: number
}
