import { useCountUp } from '../hooks'
import { useI18n } from '../i18n'

function Stat({ value, prefix = '', suffix = '', decimals = 0, label }: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }) {
  const { ref, value: v } = useCountUp(value)
  const { num } = useI18n()
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold tabular-nums text-white sm:text-4xl">
        <span ref={ref}>{prefix}{num(v, decimals).replace(/^-0$/, '0')}{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  )
}

export default function StatsBand() {
  const { m } = useI18n()
  const L = m.stats.labels
  return (
    <section aria-label={m.stats.eyebrow} className="on-dark bg-gradient-to-r from-ink via-ink-2 to-indigo-950 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-8 text-center text-xl font-bold text-white sm:text-2xl">{m.stats.title}</h2>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <Stat value={4.6} decimals={1} suffix=" M€" label={L[0]} />
          <Stat value={170} prefix="+" label={L[1]} />
          <Stat value={12400} prefix="+" label={L[2]} />
          <Stat value={8.2} decimals={1} suffix=" %" label={L[3]} />
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">{m.stats.note}</p>
      </div>
    </section>
  )
}
