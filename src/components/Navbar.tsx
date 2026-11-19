import { useState } from 'react'
import { Building2, Menu, X } from 'lucide-react'
import { LANGUAGES, type UiLang } from '../i18n/languages'
import { useI18n } from '../i18n'
import { Button } from './ui'

export function Logo({ dark }: { dark?: boolean }) {
  return (
    <a href="#top" aria-label="NexoLadrillo" className="flex items-center gap-2 font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-2 text-white">
        <Building2 size={18} aria-hidden />
      </span>
      <span className={dark ? 'text-white' : 'text-slate-900'}>
        Nexo<span className="text-brand-2">Ladrillo</span>
      </span>
    </a>
  )
}

export default function Navbar() {
  const { m, lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const links = [
    ['#invertir', m.nav.invest],
    ['#como-funciona', m.nav.how],
    ['#por-que', m.nav.why],
    ['#portfolio', m.nav.portfolio],
    ['#simulador', m.nav.sim],
    ['#faq', m.nav.faq],
    ['#contacto', m.nav.contact],
  ]
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <nav aria-label={m.a11y.nav} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <ul className="hidden items-center gap-5 text-sm font-medium text-slate-600 xl:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="rounded px-1 py-2 transition-colors hover:text-brand">{label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="ui-lang">{m.a11y.langLabel}</label>
          <select id="ui-lang" value={lang} onChange={(e) => setLang(e.target.value as UiLang)} className="min-h-11 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-800">
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
            ))}
          </select>
          <a href="#invertir" className="hidden sm:block"><Button tabIndex={-1}>{m.nav.cta}</Button></a>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-lg border border-slate-300 xl:hidden" aria-label={open ? m.a11y.menuClose : m.a11y.menuOpen} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-4 xl:hidden">
          <ul className="flex flex-col py-2">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-slate-700">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
