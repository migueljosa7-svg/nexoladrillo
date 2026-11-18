import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { langFromPath } from './i18n'
import { langPath, type UiLang } from './config'
import SeoHead from './components/SeoHead'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import Integrations from './sections/Integrations'
import Footer from './sections/Footer'
import SignupModal from './components/SignupModal'

// Secciones pesadas (recharts, etc.) con carga diferida
const VisualEditor = lazy(() => import('./sections/VisualEditor'))
const RoiCalculator = lazy(() => import('./sections/RoiCalculator'))
const Pricing = lazy(() => import('./sections/Pricing'))
const Faq = lazy(() => import('./sections/Faq'))

export default function App() {
  const [lang, setLang] = useState<UiLang>(() => langFromPath(window.location.pathname))
  const [signup, setSignup] = useState<{ open: boolean; plan: string }>({ open: false, plan: 'starter' })

  useEffect(() => {
    const onPop = () => setLang(langFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const changeLang = useCallback((l: UiLang) => {
    setLang(l)
    window.history.pushState({}, '', langPath(l) + window.location.hash)
  }, [])

  const openSignup = useCallback((plan = 'starter') => setSignup({ open: true, plan }), [])

  return (
    <>
      <SeoHead lang={lang} />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Saltar al contenido
      </a>
      <Navbar lang={lang} onLang={changeLang} onSignup={() => openSignup()} />
      <main id="contenido">
        <Hero lang={lang} onSignup={openSignup} />
        <Marquee />
        <Integrations />
        <Suspense fallback={<div className="h-96" aria-hidden />}>
          <VisualEditor />
          <RoiCalculator onSignup={() => openSignup('pro')} />
          <Pricing onSignup={openSignup} />
          <Faq lang={lang} onSignup={() => openSignup()} />
        </Suspense>
      </main>
      <Footer />
      <SignupModal open={signup.open} plan={signup.plan} onClose={() => setSignup((s) => ({ ...s, open: false }))} />
    </>
  )
}
