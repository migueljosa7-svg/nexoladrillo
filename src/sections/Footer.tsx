import { Logo } from '../components/Navbar'

export default function Footer() {
  return (
    <footer className="on-dark bg-ink py-12 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo dark />
          <p className="mt-3 max-w-sm text-sm text-slate-400">Inversión inmobiliaria accesible: tú inviertes, nosotros hacemos el resto.</p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-5 text-sm">
            <li><a className="hover:text-white" href="#invertir">Invertir</a></li>
            <li><a className="hover:text-white" href="#simulador">Simulador</a></li>
            <li><a className="hover:text-white" href="#faq">FAQ</a></li>
            <li><a className="hover:text-white" href="/sitemap.xml">Sitemap</a></li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-7xl px-4 text-xs text-slate-400 sm:px-6">
        © {new Date().getFullYear()} NexoLadrillo. Web de demostración con datos ficticios: no constituye asesoramiento ni oferta de inversión. Invertir conlleva riesgo de pérdida de capital.
      </p>
    </footer>
  )
}
