import { UI_LANGS, type UiLang } from './config'

export interface Dict {
  navInvest: string
  navHow: string
  navPortfolio: string
  navSim: string
  navFaq: string
  navContact: string
  cta: string
  badge: string
  h1a: string
  h1b: string
  sub: string
  ctaPrimary: string
  ctaSecondary: string
  risk: string
  title: string
  description: string
}

export const DICT: Record<UiLang, Dict> = {
  es: {
    navInvest: 'Invertir', navHow: 'Cómo funciona', navPortfolio: 'Portfolio', navSim: 'Simulador', navFaq: 'FAQ', navContact: 'Contacto',
    cta: 'Ver oportunidades', badge: 'Inversión inmobiliaria desde 50 €',
    h1a: 'Invierte en inmuebles', h1b: 'cerca de ti o en cualquier ciudad.',
    sub: 'Tú inviertes, nosotros hacemos el resto: elegimos, gestionamos y alquilamos o vendemos el inmueble. Tú sigues tu rentabilidad.',
    ctaPrimary: 'Explorar inmuebles', ctaSecondary: 'Simular ganancias',
    risk: 'Invertir conlleva riesgo de pérdida de capital. Las rentabilidades son estimaciones y no están garantizadas.',
    title: 'NexoLadrillo: invierte en inmuebles desde 50 € | Busca cerca de ti',
    description: 'Invierte en alquiler y compraventa de inmuebles desde 50 €. Busca por ciudad, barrio o cerca de tu ubicación, simula tus ganancias y sigue tu portfolio.',
  },
  en: {
    navInvest: 'Invest', navHow: 'How it works', navPortfolio: 'Portfolio', navSim: 'Simulator', navFaq: 'FAQ', navContact: 'Contact',
    cta: 'See opportunities', badge: 'Real estate investing from €50',
    h1a: 'Invest in property', h1b: 'near you or in any city.',
    sub: 'You invest, we do the rest: we select, manage and rent or sell the property. You track your return.',
    ctaPrimary: 'Explore properties', ctaSecondary: 'Simulate earnings',
    risk: 'Investing involves risk of capital loss. Returns are estimates and are not guaranteed.',
    title: 'NexoLadrillo: invest in real estate from €50 | Search near you',
    description: 'Invest in rental and buy-to-sell property from €50. Search by city, neighbourhood or near your location, simulate earnings and track your portfolio.',
  },
  fr: {
    navInvest: 'Investir', navHow: 'Comment ça marche', navPortfolio: 'Portefeuille', navSim: 'Simulateur', navFaq: 'FAQ', navContact: 'Contact',
    cta: 'Voir les offres', badge: 'Investissement immobilier dès 50 €',
    h1a: 'Investissez dans l’immobilier', h1b: 'près de chez vous ou dans toute ville.',
    sub: 'Vous investissez, nous faisons le reste : nous sélectionnons, gérons et louons ou vendons le bien. Vous suivez votre rendement.',
    ctaPrimary: 'Explorer les biens', ctaSecondary: 'Simuler les gains',
    risk: 'Investir comporte un risque de perte en capital. Les rendements sont des estimations non garanties.',
    title: 'NexoLadrillo : investissez dans l’immobilier dès 50 € | Recherche à proximité',
    description: 'Investissez dans la location et la revente immobilière dès 50 €. Recherchez par ville, quartier ou près de vous, simulez vos gains et suivez votre portefeuille.',
  },
  de: {
    navInvest: 'Investieren', navHow: 'So funktioniert’s', navPortfolio: 'Portfolio', navSim: 'Simulator', navFaq: 'FAQ', navContact: 'Kontakt',
    cta: 'Angebote ansehen', badge: 'Immobilieninvestition ab 50 €',
    h1a: 'Investieren Sie in Immobilien', h1b: 'in Ihrer Nähe oder in jeder Stadt.',
    sub: 'Sie investieren, wir erledigen den Rest: Wir wählen aus, verwalten und vermieten oder verkaufen die Immobilie. Sie verfolgen Ihre Rendite.',
    ctaPrimary: 'Immobilien entdecken', ctaSecondary: 'Erträge simulieren',
    risk: 'Investieren birgt das Risiko eines Kapitalverlusts. Renditen sind Schätzungen und nicht garantiert.',
    title: 'NexoLadrillo: Immobilien-Investment ab 50 € | Suche in Ihrer Nähe',
    description: 'Investieren Sie ab 50 € in Vermietung und Verkauf von Immobilien. Suchen Sie nach Stadt, Viertel oder in Ihrer Nähe, simulieren Sie Erträge und verfolgen Sie Ihr Portfolio.',
  },
  pt: {
    navInvest: 'Investir', navHow: 'Como funciona', navPortfolio: 'Portfólio', navSim: 'Simulador', navFaq: 'FAQ', navContact: 'Contacto',
    cta: 'Ver oportunidades', badge: 'Investimento imobiliário desde 50 €',
    h1a: 'Invista em imóveis', h1b: 'perto de si ou em qualquer cidade.',
    sub: 'Você investe, nós fazemos o resto: selecionamos, gerimos e arrendamos ou vendemos o imóvel. Acompanha a sua rentabilidade.',
    ctaPrimary: 'Explorar imóveis', ctaSecondary: 'Simular ganhos',
    risk: 'Investir implica risco de perda de capital. As rentabilidades são estimativas e não são garantidas.',
    title: 'NexoLadrillo: invista em imóveis desde 50 € | Pesquise perto de si',
    description: 'Invista em arrendamento e compra e venda de imóveis desde 50 €. Pesquise por cidade, bairro ou perto de si, simule ganhos e acompanhe o seu portfólio.',
  },
  it: {
    navInvest: 'Investire', navHow: 'Come funziona', navPortfolio: 'Portafoglio', navSim: 'Simulatore', navFaq: 'FAQ', navContact: 'Contatto',
    cta: 'Vedi le opportunità', badge: 'Investimento immobiliare da 50 €',
    h1a: 'Investi in immobili', h1b: 'vicino a te o in qualsiasi città.',
    sub: 'Tu investi, noi facciamo il resto: selezioniamo, gestiamo e affittiamo o vendiamo l’immobile. Tu segui il tuo rendimento.',
    ctaPrimary: 'Esplora gli immobili', ctaSecondary: 'Simula i guadagni',
    risk: 'Investire comporta il rischio di perdita del capitale. I rendimenti sono stime non garantite.',
    title: 'NexoLadrillo: investi in immobili da 50 € | Cerca vicino a te',
    description: 'Investi in affitto e compravendita di immobili da 50 €. Cerca per città, quartiere o vicino a te, simula i guadagni e segui il tuo portafoglio.',
  },
}

export function langFromPath(path: string): UiLang {
  const seg = path.split('/').filter(Boolean)[0]
  return (UI_LANGS as readonly string[]).includes(seg) ? (seg as UiLang) : 'es'
}

export const UI_LANG_LABEL: Record<UiLang, { flag: string; name: string }> = {
  es: { flag: '🇪🇸', name: 'Español' },
  en: { flag: '🇬🇧', name: 'English' },
  fr: { flag: '🇫🇷', name: 'Français' },
  de: { flag: '🇩🇪', name: 'Deutsch' },
  pt: { flag: '🇵🇹', name: 'Português' },
  it: { flag: '🇮🇹', name: 'Italiano' },
}
