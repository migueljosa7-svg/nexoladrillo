import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion'
import { Reveal, SectionHead, rise } from '../components/ui'

const HOLDINGS = [
  { name: 'Piso en Delicias, Zaragoza', amount: 1500, yld: 7.4, status: 'Alquilado' },
  { name: 'Local en Salamanca, Madrid', amount: 2500, yld: 6.4, status: 'Alquilado' },
  { name: 'Reforma en Gràcia, Barcelona', amount: 1000, yld: 11.1, status: 'En reforma' },
  { name: 'Apartamento en Ruzafa, Valencia', amount: 1000, yld: 7.2, status: 'Alquilado' },
]
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export default function PortfolioDemo() {
  const total = HOLDINGS.reduce((a, h) => a + h.amount, 0)
  const monthly = HOLDINGS.filter((h) => h.status === 'Alquilado').reduce((a, h) => a + (h.amount * h.yld) / 100 / 12, 0)
  const data = MONTHS.map((m, i) => ({ mes: m, rentas: Math.round(monthly * (0.94 + ((i * 7) % 5) * 0.03)) }))
  const yearly = data.reduce((a, d) => a + d.rentas, 0)

  return (
    <section id="portfolio" className="bg-white py-20 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow="Portfolio demo" title={<>Así se ve <span className="grad-text">tu cartera</span></>} sub="Ejemplo con datos ficticios para que veas cómo seguirías tus inversiones." />
        <motion.div variants={rise} className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 p-5">
            <dl className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">Invertido</dt><dd className="text-lg font-extrabold">{eur(total)}</dd></div>
              <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">Rentas / año</dt><dd className="text-lg font-extrabold text-emerald-700">{eur(yearly)}</dd></div>
              <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">Rent. media</dt><dd className="text-lg font-extrabold">{((yearly / total) * 100).toFixed(1).replace('.', ',')} %</dd></div>
            </dl>
            <table className="mt-5 w-full text-sm">
              <caption className="sr-only">Inversiones del portfolio demo</caption>
              <thead><tr className="text-left text-xs text-slate-600"><th className="pb-2 font-semibold">Inmueble</th><th className="pb-2 text-right font-semibold">Importe</th><th className="pb-2 text-right font-semibold">Estado</th></tr></thead>
              <tbody>
                {HOLDINGS.map((h) => (
                  <tr key={h.name} className="border-t border-slate-100">
                    <td className="py-2.5 pr-2 text-slate-800">{h.name}</td>
                    <td className="py-2.5 text-right font-semibold">{eur(h.amount)}</td>
                    <td className="py-2.5 text-right"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${h.status === 'Alquilado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-3 font-semibold">Rentas mensuales estimadas (demo)</h3>
            <div className="h-72" role="img" aria-label={`Gráfico de barras de rentas mensuales estimadas, total anual ${eur(yearly)}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="mes" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} width={40} />
                  <Tooltip formatter={(v) => eur(Number(v))} />
                  <Bar dataKey="rentas" name="Rentas" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}
