import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { langFromPath } from './i18n'
import { langPath, type UiLang } from './config'
import type { Property } from './services/properties/types'
import SeoHead from './components/SeoHead'
import Navbar from './components/Navbar'
import InvestModal from './components/InvestModal'
import Hero from './sections/Hero'
import Catalog from './sections/Catalog'
import HowItWorks from './sections/HowItWorks'
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

// Secciones con Recharts: carga diferida
const PortfolioDemo = lazy(() => import('./sections/PortfolioDemo'))
const Simulator = lazy(() => import('./sections/Simulator'))

export default function App() {
  const [lang, setLang] = useState<UiLang>(() => langFromPath(window.location.pathname))
  const [invest, setInvest] = useState<Property | null>(null)

  useEffect(() => {
    const onPop = () => setLang(langFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const changeLang = useCallback((l: UiLang) => {
    setLang(l)
    window.history.pushState({}, '', langPath(l) + window.location.hash)
  }, [])

  return (
    <>
      <SeoHead lang={lang} />
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        Saltar al contenido
      </a>
      <Navbar lang={lang} onLang={changeLang} />
      <main id="contenido">
        <Hero lang={lang} />
        <Catalog onInvest={setInvest} />
        <HowItWorks />
        <Suspense fallback={<div className="h-96" aria-hidden />}>
          <PortfolioDemo />
          <Simulator />
        </Suspense>
        <Faq />
        <Contact />
      </main>
      <Footer />
      <InvestModal property={invest} onClose={() => setInvest(null)} />
    </>
  )
}
