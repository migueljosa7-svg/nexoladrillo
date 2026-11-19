import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import type { Property } from './services/properties/types'
import { useI18n } from './i18n'
import SeoHead from './components/SeoHead'
import Navbar from './components/Navbar'
import PropertyDetail from './components/PropertyDetail'
import Hero from './sections/Hero'
import Catalog from './sections/Catalog'
import StatsBand from './sections/StatsBand'
import HowItWorks from './sections/HowItWorks'
import Why from './sections/Why'
import Types from './sections/Types'
import Trust from './sections/Trust'
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

// Secciones con Recharts: carga diferida
const PortfolioDemo = lazy(() => import('./sections/PortfolioDemo'))
const Simulator = lazy(() => import('./sections/Simulator'))

function ScrollUi({ label }: { label: string }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-brand via-brand-2 to-emerald" />
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={label}
            className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white shadow-lg shadow-indigo-500/30"
          >
            <ArrowUp size={20} aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  const { m } = useI18n()
  const [detail, setDetail] = useState<Property | null>(null)

  return (
    <>
      <SeoHead />
      <ScrollUi label={m.a11y.top} />
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        {m.a11y.skip}
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Catalog onOpen={setDetail} />
        <StatsBand />
        <HowItWorks />
        <Why />
        <Types />
        <Suspense fallback={<div className="h-96" aria-hidden />}>
          <PortfolioDemo />
          <Simulator />
        </Suspense>
        <Trust />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <PropertyDetail property={detail} onClose={() => setDetail(null)} />
    </>
  )
}
