import { UI_LANGS, type UiLang } from './config'

export interface Dict {
  navDemo: string
  navIntegrations: string
  navEditor: string
  navRoi: string
  navPricing: string
  navFaq: string
  cta: string
  login: string
  badge: string
  h1a: string
  h1b: string
  sub: string
  ctaPrimary: string
  ctaSecondary: string
  noCard: string
  title: string
  description: string
  finalTitle: string
  finalSub: string
}

export const DICT: Record<UiLang, Dict> = {
  es: {
    navDemo: 'Demo', navIntegrations: 'Integraciones', navEditor: 'Editor IA', navRoi: 'Calculadora ROI', navPricing: 'Precios', navFaq: 'FAQ',
    cta: 'Prueba gratis', login: 'Acceder',
    badge: 'Un 10 % más barato que Weglot, garantizado',
    h1a: 'Traduce tu web en +110 idiomas.', h1b: 'Sin código, en 2 minutos.',
    sub: 'Nexo Translate traduce, posiciona y localiza tu web con IA. SEO multilingüe automático, editor visual y precios un 10 % por debajo de Weglot.',
    ctaPrimary: 'Empezar gratis 14 días', ctaSecondary: 'Ver precios',
    noCard: 'Sin tarjeta · Cancela cuando quieras',
    title: 'Nexo Translate: traducción web con IA y SEO multilingüe | -10 % vs Weglot',
    description: 'Traduce tu web a +110 idiomas con IA en 2 minutos y sin código. SEO multilingüe automático, glosario de marca y planes desde 0 €, un 10 % más baratos que Weglot.',
    finalTitle: 'Tu próximo cliente habla otro idioma', finalSub: 'Empieza gratis hoy y publica tu primera traducción en 2 minutos.',
  },
  en: {
    navDemo: 'Demo', navIntegrations: 'Integrations', navEditor: 'AI Editor', navRoi: 'ROI calculator', navPricing: 'Pricing', navFaq: 'FAQ',
    cta: 'Try for free', login: 'Log in',
    badge: '10% cheaper than Weglot, guaranteed',
    h1a: 'Translate your website into 110+ languages.', h1b: 'No code, in 2 minutes.',
    sub: 'Nexo Translate translates, ranks and localizes your site with AI. Automatic multilingual SEO, a visual editor and prices 10% below Weglot.',
    ctaPrimary: 'Start free for 14 days', ctaSecondary: 'See pricing',
    noCard: 'No credit card · Cancel anytime',
    title: 'Nexo Translate: AI website translation & multilingual SEO | 10% off Weglot',
    description: 'Translate your website into 110+ languages with AI in 2 minutes, no code. Automatic multilingual SEO, brand glossary and plans from €0, 10% cheaper than Weglot.',
    finalTitle: 'Your next customer speaks another language', finalSub: 'Start free today and publish your first translation in 2 minutes.',
  },
  fr: {
    navDemo: 'Démo', navIntegrations: 'Intégrations', navEditor: 'Éditeur IA', navRoi: 'Calculateur ROI', navPricing: 'Tarifs', navFaq: 'FAQ',
    cta: 'Essai gratuit', login: 'Connexion',
    badge: '10 % moins cher que Weglot, garanti',
    h1a: 'Traduisez votre site en 110+ langues.', h1b: 'Sans code, en 2 minutes.',
    sub: 'Nexo Translate traduit, référence et localise votre site avec l’IA. SEO multilingue automatique, éditeur visuel et tarifs 10 % sous Weglot.',
    ctaPrimary: 'Essai gratuit 14 jours', ctaSecondary: 'Voir les tarifs',
    noCard: 'Sans carte bancaire · Annulez à tout moment',
    title: 'Nexo Translate : traduction de site web par IA et SEO multilingue | -10 % vs Weglot',
    description: 'Traduisez votre site en 110+ langues avec l’IA en 2 minutes, sans code. SEO multilingue automatique, glossaire de marque et offres dès 0 €, 10 % moins cher que Weglot.',
    finalTitle: 'Votre prochain client parle une autre langue', finalSub: 'Commencez gratuitement et publiez votre première traduction en 2 minutes.',
  },
  de: {
    navDemo: 'Demo', navIntegrations: 'Integrationen', navEditor: 'KI-Editor', navRoi: 'ROI-Rechner', navPricing: 'Preise', navFaq: 'FAQ',
    cta: 'Kostenlos testen', login: 'Anmelden',
    badge: '10 % günstiger als Weglot – garantiert',
    h1a: 'Übersetzen Sie Ihre Website in 110+ Sprachen.', h1b: 'Ohne Code, in 2 Minuten.',
    sub: 'Nexo Translate übersetzt, rankt und lokalisiert Ihre Website mit KI. Automatisches mehrsprachiges SEO, visueller Editor und Preise 10 % unter Weglot.',
    ctaPrimary: '14 Tage kostenlos starten', ctaSecondary: 'Preise ansehen',
    noCard: 'Keine Kreditkarte · Jederzeit kündbar',
    title: 'Nexo Translate: KI-Website-Übersetzung & mehrsprachiges SEO | 10 % günstiger als Weglot',
    description: 'Übersetzen Sie Ihre Website mit KI in 2 Minuten in 110+ Sprachen – ohne Code. Automatisches Multilingual-SEO, Markenglossar und Tarife ab 0 €, 10 % günstiger als Weglot.',
    finalTitle: 'Ihr nächster Kunde spricht eine andere Sprache', finalSub: 'Starten Sie heute kostenlos und veröffentlichen Sie Ihre erste Übersetzung in 2 Minuten.',
  },
  pt: {
    navDemo: 'Demo', navIntegrations: 'Integrações', navEditor: 'Editor IA', navRoi: 'Calculadora ROI', navPricing: 'Preços', navFaq: 'FAQ',
    cta: 'Experimente grátis', login: 'Entrar',
    badge: '10 % mais barato que o Weglot, garantido',
    h1a: 'Traduza o seu site para +110 idiomas.', h1b: 'Sem código, em 2 minutos.',
    sub: 'O Nexo Translate traduz, posiciona e localiza o seu site com IA. SEO multilingue automático, editor visual e preços 10 % abaixo do Weglot.',
    ctaPrimary: 'Começar grátis 14 dias', ctaSecondary: 'Ver preços',
    noCard: 'Sem cartão · Cancele quando quiser',
    title: 'Nexo Translate: tradução de sites com IA e SEO multilingue | -10 % vs Weglot',
    description: 'Traduza o seu site para +110 idiomas com IA em 2 minutos, sem código. SEO multilingue automático, glossário de marca e planos desde 0 €, 10 % mais baratos que o Weglot.',
    finalTitle: 'O seu próximo cliente fala outro idioma', finalSub: 'Comece grátis hoje e publique a sua primeira tradução em 2 minutos.',
  },
  it: {
    navDemo: 'Demo', navIntegrations: 'Integrazioni', navEditor: 'Editor IA', navRoi: 'Calcolatore ROI', navPricing: 'Prezzi', navFaq: 'FAQ',
    cta: 'Prova gratis', login: 'Accedi',
    badge: '10 % più economico di Weglot, garantito',
    h1a: 'Traduci il tuo sito in 110+ lingue.', h1b: 'Senza codice, in 2 minuti.',
    sub: 'Nexo Translate traduce, posiziona e localizza il tuo sito con l’IA. SEO multilingua automatico, editor visuale e prezzi del 10 % sotto Weglot.',
    ctaPrimary: 'Inizia gratis per 14 giorni', ctaSecondary: 'Vedi i prezzi',
    noCard: 'Senza carta · Annulla quando vuoi',
    title: 'Nexo Translate: traduzione siti web con IA e SEO multilingua | -10 % vs Weglot',
    description: 'Traduci il tuo sito in 110+ lingue con l’IA in 2 minuti, senza codice. SEO multilingua automatico, glossario di marca e piani da 0 €, il 10 % più economici di Weglot.',
    finalTitle: 'Il tuo prossimo cliente parla un’altra lingua', finalSub: 'Inizia gratis oggi e pubblica la tua prima traduzione in 2 minuti.',
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
