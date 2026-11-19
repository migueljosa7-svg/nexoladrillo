import { useState } from 'react'
import { Building2, Menu, X } from 'lucide-react'
import { UI_LANGS, type UiLang } from '../config'
import { DICT, UI_LANG_LABEL } from '../i18n'
import { Button } from './ui'

export function Logo({ dark }: { dark?: boolean }) {
  return (
    <a href="#top" aria-label="NexoLadrillo, inicio" className="flex items-center gap-2 font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-2 text-white">
        <Building2 size={18} aria-hidden />
      </span>
      <span className={dark ? 'text-white' : 'text-slate-900'}>
        Nexo<span className="text-brand-2">Ladrillo</span>
      </span>
    </a>
  )
}

export default function Navbar({ lang, onLang }: { lang: UiLang; onLang: (l: UiLang) => void }) {
  const d = DICT[lang]
  const [open, setOpen] = useState(false)
  const links = [
    ['#invertir', d.navInvest],
    ['#como-funciona', d.navHow],
    ['#portfolio', d.navPortfolio],
    ['#simulador', d.navSim],
    ['#faq', d.navFaq],
    ['#contacto', d.navContact],
  ]
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <nav aria-label="Principal" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <ul className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="rounded px-1 py-2 transition-colors hover:text-brand">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="ui-lang">Idioma de la web</label>
          <select
            id="ui-lang"
            value={lang}
            onChange={(e) => onLang(e.target.value as UiLang)}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-800"
          >
            {UI_LANGS.map((l) => (
              <option key={l} value={l}>
                {UI_LANG_LABEL[l].flag} {UI_LANG_LABEL[l].name}
              </option>
            ))}
          </select>
          <a href="#invertir" className="hidden sm:block">
            <Button tabIndex={-1}>{d.cta}</Button>
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg border border-slate-300 lg:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 lg:hidden">
          <ul className="flex flex-col py-2">
            {links.map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-slate-700">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
