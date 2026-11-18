import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { computeRoi, fmtEur } from '../services/translationEngineMock'
import { Button, Reveal, SectionHead, rise } from '../components/ui'

function Slider({
  id, label, value, min, max, step, onChange, display,
}: { id: string; label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; display: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">{label}</label>
        <output htmlFor={id} className="text-lg font-bold text-brand">{display}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="h-2 w-full cursor-pointer" />
    </div>
  )
}

export default function RoiCalculator({ onSignup }: { onSignup: () => void }) {
  const [visits, setVisits] = useState(20000)
  const [ticket, setTicket] = useState(60)
  const [languages, setLanguages] = useState(3)
  const r = useMemo(() => computeRoi({ visits, ticket, languages }), [visits, ticket, languages])
  const nf = (n: number) => n.toLocaleString('es-ES')

  return (
    <section id="roi" className="bg-snow py-20 sm:py-28">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Calculadora de ROI SEO"
          title={<>Cuánto tráfico internacional <span className="grad-text">te estás perdiendo</span></>}
          sub="Mueve los sliders y estima el crecimiento orgánico y la facturación extra con SEO multilingüe automático."
        />
        <motion.div variants={rise} className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
            <Slider id="visits" label="Visitas mensuales" value={visits} min={1000} max={500000} step={1000} onChange={setVisits} display={nf(visits)} />
            <Slider id="ticket" label="Ticket medio" value={ticket} min={5} max={1000} step={5} onChange={setTicket} display={`${ticket} €`} />
            <Slider id="langs" label="Idiomas nuevos" value={languages} min={1} max={10} step={1} onChange={setLanguages} display={String(languages)} />
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800"><TrendingUp size={16} aria-hidden /> Tráfico internacional estimado</p>
              <p className="mt-1 text-4xl font-extrabold text-emerald-700">+{r.upliftPct}%</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-600">Visitas extra / año</dt><dd className="text-lg font-bold">{nf(r.extraVisits12)}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-600">Facturación extra</dt><dd className="text-lg font-bold text-emerald-700">{fmtEur(r.extraRevenue12)}</dd></div>
            </dl>
            <Button onClick={onSignup} className="w-full">Conseguir este crecimiento</Button>
            <p className="text-xs text-slate-600">Estimación orientativa: supone una conversión del 2 % y la curva de indexación habitual. Los resultados reales dependen de tu sector y contenido.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <h3 className="mb-4 font-semibold text-slate-900">Visitas orgánicas mensuales: antes vs. con Nexo (12 meses)</h3>
            <div className="h-80 w-full" role="img" aria-label={`Gráfico: las visitas mensuales pasan de ${nf(visits)} a ${nf(visits + r.monthlyExtraEnd)} en 12 meses con Nexo Translate`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={r.series} margin={{ left: 0, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="gN" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} width={44} />
                  <Tooltip formatter={(v) => nf(Number(v))} />
                  <Legend />
                  <Area type="monotone" dataKey="actual" name="Sin traducir" stroke="#64748B" fill="#E2E8F0" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="conNexo" name="Con Nexo" stroke="#4F46E5" strokeWidth={3} fill="url(#gN)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}
