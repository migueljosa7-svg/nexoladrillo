import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, PiggyBank } from 'lucide-react'
import { PLANS, annualSavings, effectiveMonthly, fmtEur } from '../services/translationEngineMock'
import { Button, Reveal, SectionHead, rise } from '../components/ui'

export default function Pricing({ onSignup }: { onSignup: (plan: string) => void }) {
  const [annual, setAnnual] = useState(true)
  const [calc, setCalc] = useState('pro')
  const cp = PLANS.find((p) => p.id === calc)!
  const save = annualSavings(cp, annual)

  return (
    <section id="precios" className="bg-white py-20 sm:py-28">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="Nosotros vs. Weglot"
          title={<>Un <span className="grad-text">10 % más barato</span> en todos los planes</>}
          sub="Más palabras incluidas y sin límites artificiales. Con facturación anual, 2 meses gratis adicionales."
        />
        <motion.div variants={rise} className="mb-10 flex items-center justify-center gap-3" role="group" aria-label="Frecuencia de facturación">
          <span className={`text-sm font-semibold ${!annual ? 'text-slate-900' : 'text-slate-600'}`}>Mensual</span>
          <button
            role="switch"
            aria-checked={annual}
            aria-label="Facturación anual"
            onClick={() => setAnnual((a) => !a)}
            className={`relative h-8 w-14 rounded-full transition-colors ${annual ? 'bg-brand' : 'bg-slate-400'}`}
          >
            <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow ${annual ? 'right-1' : 'left-1'}`} />
          </button>
          <span className={`text-sm font-semibold ${annual ? 'text-slate-900' : 'text-slate-600'}`}>
            Anual <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">2 meses gratis</span>
          </span>
        </motion.div>

        <motion.ul variants={rise} className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {PLANS.map((p) => {
            const price = effectiveMonthly(p.eur, annual)
            const wg = effectiveMonthly(p.weglot, annual)
            return (
              <motion.li
                key={p.id}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-2xl bg-white p-6 ${p.popular ? 'glow-card border-transparent shadow-xl shadow-indigo-500/15' : 'border border-slate-200'}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand to-brand-2 px-3 py-1 text-xs font-bold text-white">Más popular</span>
                )}
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="mt-1 min-h-10 text-sm text-slate-600">{p.tagline}</p>
                <p className="mt-4 text-4xl font-extrabold text-slate-900">
                  {fmtEur(price)}
                  <span className="text-sm font-medium text-slate-600"> /mes</span>
                </p>
                {p.weglot > 0 ? (
                  <p className="mt-1 text-sm text-slate-600">
                    vs <s>{fmtEur(wg)}</s> en Weglot · <b className="text-emerald-700">-10 %</b>
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-600">Gratis para siempre</p>
                )}
                <ul className="my-5 flex-1 space-y-2 text-sm text-slate-700">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.popular ? 'primary' : 'ghost'} onClick={() => onSignup(p.id)} aria-label={`Elegir plan ${p.name}`} className="w-full">
                  {p.eur === 0 ? 'Empezar gratis' : 'Prueba 14 días'}
                </Button>
              </motion.li>
            )
          })}
        </motion.ul>

        <motion.div variants={rise} className="mx-auto mt-12 max-w-3xl rounded-2xl bg-ink p-6 text-white on-dark sm:p-8">
          <h3 className="flex items-center gap-2 text-lg font-bold"><PiggyBank className="text-emerald-400" aria-hidden /> Calculadora de ahorro anual</h3>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label htmlFor="calc-plan" className="mb-1 block text-sm text-slate-300">Tu plan actual en Weglot</label>
              <select id="calc-plan" value={calc} onChange={(e) => setCalc(e.target.value)} className="min-h-11 rounded-lg bg-white px-3 text-slate-900">
                {PLANS.filter((p) => p.eur > 0).map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({fmtEur(p.weglot)}/mes)</option>
                ))}
              </select>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-slate-300">Ahorras con Nexo cada año</p>
              <motion.p key={`${calc}-${annual}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-extrabold text-emerald-400">
                {fmtEur(save)}
              </motion.p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Comparativa con precios de lista de Weglot a igual frecuencia de facturación, verificados en la fecha de publicación. Pueden variar.
          </p>
        </motion.div>
      </Reveal>
    </section>
  )
}
