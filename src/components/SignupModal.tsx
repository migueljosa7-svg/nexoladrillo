import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import { INDEX_STEPS, PLANS, PLATFORMS, fmtEur } from '../services/translationEngineMock'
import { Button } from './ui'

export default function SignupModal({ open, plan, onClose }: { open: boolean; plan: string; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [planId, setPlanId] = useState(plan)
  const [email, setEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [platform, setPlatform] = useState('wordpress')
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setPlanId(plan)
      setStep(1)
      setProgress(0)
    }
  }, [open, plan])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('input,select,button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Paso 3: instalación simulada
  useEffect(() => {
    if (step !== 3) return
    setProgress(0)
    const t = [1, 2, 3, 4].map((n) => setTimeout(() => setProgress(n), n * 800))
    const done = setTimeout(() => setStep(4), 4 * 800 + 500)
    return () => {
      t.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [step])

  const p = PLANS.find((x) => x.id === planId)!
  const emailOk = /^\S+@\S+\.\S+$/.test(email)
  const input = 'min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900'

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-title"
            initial={{ y: 30, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
          >
            <button onClick={onClose} aria-label="Cerrar" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100">
              <X size={18} aria-hidden />
            </button>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{step < 4 ? `Paso ${step} de 3` : 'Listo'}</p>

            {step === 1 && (
              <form className="mt-2 space-y-4" onSubmit={(e) => { e.preventDefault(); if (emailOk) setStep(2) }}>
                <h2 id="signup-title" className="text-2xl font-bold">Empieza tu prueba de 14 días</h2>
                <div>
                  <label htmlFor="su-plan" className="mb-1 block text-sm font-semibold">Plan</label>
                  <select id="su-plan" value={planId} onChange={(e) => setPlanId(e.target.value)} className={input}>
                    {PLANS.map((x) => <option key={x.id} value={x.id}>{x.name} — {fmtEur(x.eur)}/mes</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="su-email" className="mb-1 block text-sm font-semibold">Email de trabajo</label>
                  <input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" autoComplete="email" className={input} />
                </div>
                <Button type="submit" className="w-full" disabled={!emailOk}>Continuar</Button>
                <p className="text-center text-xs text-slate-600">Sin tarjeta. Demo simulada: no se guarda ningún dato.</p>
              </form>
            )}

            {step === 2 && (
              <form className="mt-2 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
                <h2 id="signup-title" className="text-2xl font-bold">Conecta tu web</h2>
                <div>
                  <label htmlFor="su-domain" className="mb-1 block text-sm font-semibold">Dominio</label>
                  <input id="su-domain" required value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="mi-tienda.com" className={input} />
                </div>
                <div>
                  <label htmlFor="su-plat" className="mb-1 block text-sm font-semibold">Plataforma</label>
                  <select id="su-plat" value={platform} onChange={(e) => setPlatform(e.target.value)} className={input}>
                    {PLATFORMS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
                  <Button type="submit" className="flex-1" disabled={!domain.trim()}>Instalar y traducir</Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="mt-2" aria-live="polite">
                <h2 id="signup-title" className="text-2xl font-bold">Configurando {domain}…</h2>
                <ol className="mt-5 space-y-3">
                  {['Detectando contenido', ...INDEX_STEPS.slice(0, 3)].map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-sm">
                      <span className={`grid h-6 w-6 place-items-center rounded-full ${progress > i ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                        {progress > i ? <Check size={14} aria-hidden /> : progress === i ? <Loader2 size={14} className="animate-spin" aria-hidden /> : null}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {step === 4 && (
              <div className="mt-2 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check size={32} aria-hidden />
                </motion.div>
                <h2 id="signup-title" className="mt-4 text-2xl font-bold">¡Todo listo!</h2>
                <p className="mt-2 text-slate-600">
                  {domain} está conectada con el plan <b>{p.name}</b>. Tu prueba de 14 días ha comenzado y recibirás los siguientes pasos en {email}.
                </p>
                <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">Flujo de demostración: aún no se ha creado ninguna cuenta real.</p>
                <Button onClick={onClose} className="mt-5 w-full">Cerrar</Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
