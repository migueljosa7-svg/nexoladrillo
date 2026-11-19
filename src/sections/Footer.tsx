import { Logo } from '../components/Navbar'
import { useI18n } from '../i18n'

export default function Footer() {
  const { m } = useI18n()
  return (
    <footer className="on-dark bg-ink py-12 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo dark />
          <p className="mt-3 max-w-sm text-sm text-slate-400">{m.footer.tagline}</p>
        </div>
        <nav aria-label={m.a11y.footerNav}>
          <ul className="flex flex-wrap gap-5 text-sm">
            <li><a className="hover:text-white" href="#invertir">{m.nav.invest}</a></li>
            <li><a className="hover:text-white" href="#simulador">{m.nav.sim}</a></li>
            <li><a className="hover:text-white" href="#faq">{m.nav.faq}</a></li>
            <li><a className="hover:text-white" href="/sitemap.xml">{m.footer.sitemap}</a></li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-slate-400 sm:px-6">© {new Date().getFullYear()} NexoLadrillo. {m.footer.legal}</p>
    </footer>
  )
}
