import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n'
import { Reveal, SectionHead, rise } from '../components/ui'

const HOLDINGS = [
  { amount: 1500, yld: 7.4, rented: true },
  { amount: 2500, yld: 6.4, rented: true },
  { amount: 1000, yld: 11.1, rented: false },
  { amount: 1000, yld: 7.2, rented: true },
]

export default function PortfolioDemo() {
  const { m, t, eur, num } = useI18n()
  const p = m.portfolio
  const total = HOLDINGS.reduce((a, h) => a + h.amount, 0)
  const monthly = HOLDINGS.filter((h) => h.rented).reduce((a, h) => a + (h.amount * h.yld) / 100 / 12, 0)
  const data = p.months.map((mes, i) => ({ mes, rentas: Math.round(monthly * (0.94 + ((i * 7) % 5) * 0.03)) }))
  const yearly = data.reduce((a, d) => a + d.rentas, 0)

  return (
    <section id="portfolio" className="bg-white py-20 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead eyebrow={p.eyebrow} title={<>{p.title1} <span className="grad-text">{p.title2}</span></>} sub={p.sub} />
        <motion.div variants={rise} className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-slate-200 p-5">
            <dl className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">{p.invested}</dt><dd className="text-lg font-extrabold">{eur(total)}</dd></div>
              <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">{p.rentsYear}</dt><dd className="text-lg font-extrabold text-emerald-700">{eur(yearly)}</dd></div>
              <div className="rounded-xl bg-snow p-3"><dt className="text-xs text-slate-600">{p.avgYield}</dt><dd className="text-lg font-extrabold">{num((yearly / total) * 100)} %</dd></div>
            </dl>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[320px] text-sm">
                <caption className="sr-only">{p.caption}</caption>
                <thead><tr className="text-left text-xs text-slate-600"><th className="pb-2 font-semibold">{p.colProperty}</th><th className="pb-2 text-right font-semibold">{p.colAmount}</th><th className="pb-2 text-right font-semibold">{p.colStatus}</th></tr></thead>
                <tbody>
                  {HOLDINGS.map((h, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-2.5 pr-2 text-slate-800">{p.holdings[i]}</td>
                      <td className="py-2.5 text-right font-semibold">{eur(h.amount)}</td>
                      <td className="py-2.5 text-right"><span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${h.rented ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>{h.rented ? p.rented : p.renovating}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-3 font-semibold">{p.chartTitle}</h3>
            <div className="h-72" role="img" aria-label={t(p.chartAria, { n: eur(yearly) })}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="mes" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} width={40} />
                  <Tooltip formatter={(v) => eur(Number(v))} />
                  <Bar dataKey="rentas" name={p.chartLabel} fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  )
}
