import { motion } from 'framer-motion'
import { Coins, KeyRound, LineChart, Search } from 'lucide-react'
import { Reveal, SectionHead, rise } from '../components/ui'

const STEPS = [
  [Search, 'Elige un inmueble', 'Filtra por ciudad, cercanía, rentabilidad o tipo de proyecto y revisa los datos.'],
  [Coins, 'Tú inviertes', 'Participa desde 50 € junto a otros inversores, sin hipotecas ni papeleo.'],
  [KeyRound, 'Nosotros hacemos el resto', 'Adquirimos, reformamos, alquilamos o vendemos y gestionamos el día a día.'],
  [LineChart, 'Sigues tu rentabilidad', 'Consulta tu portfolio y recibe el reparto de rentas o el beneficio de la venta.'],
] as const

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="on-dark bg-ink py-20 text-white sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead dark eyebrow="Cómo funciona" title={<>Tú inviertes, <span className="grad-text-light">nosotros hacemos el resto</span></>} />
        <motion.ol variants={rise} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([Icon, t, s], i) => (
            <li key={t} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="absolute right-4 top-4 text-4xl font-black text-white/10" aria-hidden>{i + 1}</span>
              <Icon className="mb-4 text-emerald-400" size={26} aria-hidden />
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-slate-300">{s}</p>
            </li>
          ))}
        </motion.ol>
      </Reveal>
    </section>
  )
}
