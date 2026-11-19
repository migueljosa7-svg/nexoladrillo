import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { CONTACT_EMAIL, OG_LOCALE, SITE_NAME, SITE_URL, UI_LANGS, langUrl } from '../config'
import { useI18n } from '../i18n'
import { getLanguage } from '../i18n/languages'

export default function SeoHead() {
  const { m, lang } = useI18n()
  const url = langUrl(lang)

  // Elimina las etiquetas estáticas de index.html (fallback sin JS) para no duplicar con Helmet.
  useEffect(() => {
    document.querySelectorAll('[data-static-seo]').forEach((n) => n.remove())
  }, [])

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, inLanguage: lang },
    { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon-512.svg`, email: CONTACT_EMAIL },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: m.faq.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <Helmet htmlAttributes={{ lang, dir: getLanguage(lang).dir }}>
      <title>{m.meta.title}</title>
      <meta name="description" content={m.meta.description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <link rel="canonical" href={url} />
      {UI_LANGS.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={langUrl(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={langUrl('es')} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={m.meta.title} />
      <meta property="og:description" content={m.meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={OG_LOCALE(lang)} />
      {UI_LANGS.filter((l) => l !== lang).map((l) => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALE(l)} />
      ))}
      <meta property="og:image" content={`${SITE_URL}/og-image.svg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={m.meta.title} />
      <meta name="twitter:description" content={m.meta.description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.svg`} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
