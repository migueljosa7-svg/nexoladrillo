import { useState } from 'react'
import { Check, Mail } from 'lucide-react'
import { CONTACT_EMAIL } from '../config'
import { useI18n } from '../i18n'
import { Button, Reveal, SectionHead } from '../components/ui'

export default function Contact() {
  const { m } = useI18n()
  const c = m.contact
  const [sent, setSent] = useState(false)
  const input = 'min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900'
  return (
    <section id="contacto" className="on-dark bg-gradient-to-br from-ink via-ink-2 to-indigo-950 py-20 text-white sm:py-24">
      <Reveal className="mx-auto max-w-2xl px-4 sm:px-6">
        <SectionHead dark eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
        {sent ? (
          <p role="status" className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/15 p-6 text-emerald-200"><Check aria-hidden /> {c.thanks}</p>
        ) : (
          <form className="space-y-4 rounded-2xl bg-white p-6 text-slate-900" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <div><label htmlFor="c-name" className="mb-1 block text-sm font-semibold">{c.name}</label><input id="c-name" required autoComplete="name" className={input} /></div>
            <div><label htmlFor="c-email" className="mb-1 block text-sm font-semibold">{c.email}</label><input id="c-email" type="email" required autoComplete="email" className={input} /></div>
            <div><label htmlFor="c-msg" className="mb-1 block text-sm font-semibold">{c.message}</label><textarea id="c-msg" required rows={4} className={`${input} py-2`} /></div>
            <Button type="submit" className="w-full">{c.send}</Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-600"><Mail size={14} aria-hidden /> {CONTACT_EMAIL}</p>
          </form>
        )}
      </Reveal>
    </section>
  )
}
