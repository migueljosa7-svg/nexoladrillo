import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { AGGREGATE_RATING, CONTACT_EMAIL, OG_LOCALE, SITE_NAME, SITE_URL, UI_LANGS, langUrl, type UiLang } from '../config'
import { DICT } from '../i18n'
import { FAQ } from '../data/faq'

export default function SeoHead({ lang }: { lang: UiLang }) {
  const d = DICT[lang]
  const url = langUrl(lang)

  // Elimina las etiquetas estáticas de index.html (fallback sin JS) para no duplicar con Helmet.
  useEffect(() => {
    document.querySelectorAll('[data-static-seo]').forEach((n) => n.remove())
  }, [])

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: d.description,
      inLanguage: lang,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: AGGREGATE_RATING.ratingValue,
        ratingCount: AGGREGATE_RATING.ratingCount,
        bestRating: '5',
        worstRating: '1',
      },
      offers: [
        { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Starter', price: '13.50', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Business', price: '26.10', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Pro', price: '71.10', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Enterprise', price: '269', priceCurrency: 'EUR' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.svg`,
      email: CONTACT_EMAIL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
      name: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/og-image.svg`,
      email: CONTACT_EMAIL,
      priceRange: '€0 - €269',
      areaServed: 'Worldwide',
    },
  ]

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{d.title}</title>
      <meta name="description" content={d.description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <link rel="canonical" href={url} />
      {UI_LANGS.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={langUrl(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={langUrl('es')} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={d.title} />
      <meta property="og:description" content={d.description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={OG_LOCALE[lang]} />
      {UI_LANGS.filter((l) => l !== lang).map((l) => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALE[l]} />
      ))}
      <meta property="og:image" content={`${SITE_URL}/og-image.svg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={d.title} />
      <meta name="twitter:description" content={d.description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.svg`} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
