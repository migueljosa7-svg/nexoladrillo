import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useI18n } from '../i18n'
import { Reveal, SectionHead, rise } from '../components/ui'

function Range({ id, label, v, min, max, step, set, out }: { id: string; label: string; v: number; min: number; max: number; step: number; set: (n: number) => void; out: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">{label}</label>
        <output htmlFor={id} className="text-lg font-bold text-brand">{out}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(+e.target.value)} className="h-2 w-full cursor-pointer" />
    </div>
  )
}

export default function Simulator() {
  const { m, t, eur, num } = useI18n()
  const s = m.sim
  const [amount, setAmount] = useState(5000)
  const [years, setYears] = useState(5)
  const [yld, setYld] = useState(7)
  const [reinvest, setReinvest] = useState(true)

  const data = useMemo(() => {
    const rows = []
    for (let y = 0; y <= years; y++) {
      rows.push({ anio: t(s.year, { n: y }), capital: amount, total: Math.round(reinvest ? amount * (1 + yld / 100) ** y : amount + amount * (yld / 100) * y) })
    }
    return rows
  }, [amount, years, yld, reinvest, s.year, t])
  const end = data[data.length - 1].total

  return (
    <section id="simulador" className="bg-snow py-20 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={s.eyebrow} title={<>{s.title1} <span className="grad-text">{s.title2}</span></>} sub={s.sub} />
        <motion.div variants={rise} className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
            <Range id="sim-amount" label={s.amount} v={amount} min={50} max={50000} step={50} set={setAmount} out={eur(amount)} />
            <Range id="sim-years" label={s.term} v={years} min={1} max={15} step={1} set={setYears} out={t(years === 1 ? s.yearsOne : s.yearsMany, { n: years })} />
            <Range id="sim-yield" label={s.yield} v={yld} min={3} max={12} step={0.5} set={setYld} out={`${num(yld)} %`} />
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-slate-800">
              <input type="checkbox" checked={reinvest} onChange={(e) => setReinvest(e.target.checked)} className="h-5 w-5" /> {s.reinvest}
            </label>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">{s.gain}</p>
              <motion.p key={end} initial={{ scale: 0.95, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-extrabold text-emerald-700">{eur(end - amount)}</motion.p>
              <p className="text-sm text-emerald-900">{t(s.final, { n: eur(end) })}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <div className="h-80" role="img" aria-label={t(s.chartAria, { a: eur(amount), b: eur(end), y: years })}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="anio" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} width={56} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip formatter={(v) => eur(Number(v))} />
                  <Legend />
                  <Area type="monotone" dataKey="capital" name={s.capital} stroke="#64748B" fill="#E2E8F0" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="total" name={s.withYield} stroke="#059669" strokeWidth={3} fill="url(#gS)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}
