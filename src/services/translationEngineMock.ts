/**
 * Motor de traducción simulado + catálogo de idiomas + métricas vivas.
 * Todo es determinista/mock: sirve para que la plataforma se comporte como un SaaS real.
 */

export interface Language {
  code: string
  name: string
  native: string
  flag: string
  rtl: boolean
  currency: string
  locale: string
}

const flag = (cc: string) =>
  cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))

// code|nombre|nativo|país|moneda|rtl
const RAW = `es|Español|Español|ES|EUR
en|Inglés|English|GB|GBP
fr|Francés|Français|FR|EUR
de|Alemán|Deutsch|DE|EUR
ja|Japonés|日本語|JP|JPY
ar|Árabe|العربية|SA|SAR|1
pt|Portugués|Português|PT|EUR
it|Italiano|Italiano|IT|EUR
nl|Neerlandés|Nederlands|NL|EUR
ru|Ruso|Русский|RU|RUB
zh|Chino simplificado|简体中文|CN|CNY
zh-TW|Chino tradicional|繁體中文|TW|TWD
ko|Coreano|한국어|KR|KRW
hi|Hindi|हिन्दी|IN|INR
tr|Turco|Türkçe|TR|TRY
pl|Polaco|Polski|PL|PLN
sv|Sueco|Svenska|SE|SEK
da|Danés|Dansk|DK|DKK
fi|Finés|Suomi|FI|EUR
no|Noruego|Norsk|NO|NOK
cs|Checo|Čeština|CZ|CZK
sk|Eslovaco|Slovenčina|SK|EUR
hu|Húngaro|Magyar|HU|HUF
ro|Rumano|Română|RO|RON
bg|Búlgaro|Български|BG|BGN
el|Griego|Ελληνικά|GR|EUR
uk|Ucraniano|Українська|UA|UAH
he|Hebreo|עברית|IL|ILS|1
fa|Persa|فارسی|IR|IRR|1
ur|Urdu|اردو|PK|PKR|1
id|Indonesio|Bahasa Indonesia|ID|IDR
ms|Malayo|Bahasa Melayu|MY|MYR
th|Tailandés|ไทย|TH|THB
vi|Vietnamita|Tiếng Việt|VN|VND
fil|Filipino|Filipino|PH|PHP
bn|Bengalí|বাংলা|BD|BDT
ta|Tamil|தமிழ்|IN|INR
te|Telugu|తెలుగు|IN|INR
mr|Maratí|मराठी|IN|INR
gu|Guyaratí|ગુજરાતી|IN|INR
kn|Canarés|ಕನ್ನಡ|IN|INR
ml|Malayalam|മലയാളം|IN|INR
pa|Panyabí|ਪੰਜਾਬੀ|IN|INR
ne|Nepalí|नेपाली|NP|NPR
si|Cingalés|සිංහල|LK|LKR
km|Jemer|ខ្មែរ|KH|KHR
lo|Laosiano|ລາວ|LA|LAK
my|Birmano|မြန်မာ|MM|MMK
ka|Georgiano|ქართული|GE|GEL
hy|Armenio|Հայերեն|AM|AMD
az|Azerí|Azərbaycan|AZ|AZN
kk|Kazajo|Қазақша|KZ|KZT
uz|Uzbeko|Oʻzbek|UZ|UZS
mn|Mongol|Монгол|MN|MNT
ca|Catalán|Català|ES|EUR
eu|Euskera|Euskara|ES|EUR
gl|Gallego|Galego|ES|EUR
ga|Irlandés|Gaeilge|IE|EUR
cy|Galés|Cymraeg|GB|GBP
is|Islandés|Íslenska|IS|ISK
et|Estonio|Eesti|EE|EUR
lv|Letón|Latviešu|LV|EUR
lt|Lituano|Lietuvių|LT|EUR
sl|Esloveno|Slovenščina|SI|EUR
hr|Croata|Hrvatski|HR|EUR
sr|Serbio|Српски|RS|RSD
bs|Bosnio|Bosanski|BA|BAM
mk|Macedonio|Македонски|MK|MKD
sq|Albanés|Shqip|AL|ALL
mt|Maltés|Malti|MT|EUR
lb|Luxemburgués|Lëtzebuergesch|LU|EUR
be|Bielorruso|Беларуская|BY|BYN
af|Afrikáans|Afrikaans|ZA|ZAR
sw|Suajili|Kiswahili|KE|KES
am|Amárico|አማርኛ|ET|ETB
ha|Hausa|Hausa|NG|NGN
yo|Yoruba|Yorùbá|NG|NGN
ig|Igbo|Igbo|NG|NGN
zu|Zulú|isiZulu|ZA|ZAR
xh|Xhosa|isiXhosa|ZA|ZAR
so|Somalí|Soomaali|SO|SOS
mg|Malgache|Malagasy|MG|MGA
rw|Kinyarwanda|Kinyarwanda|RW|RWF
ps|Pastún|پښتو|AF|AFN|1
ku|Kurdo|Kurdî|IQ|IQD|1
sd|Sindhi|سنڌي|PK|PKR|1
tg|Tayiko|Тоҷикӣ|TJ|TJS
tk|Turcomano|Türkmen|TM|TMT
ky|Kirguís|Кыргызча|KG|KGS
ug|Uigur|ئۇيغۇرچە|CN|CNY|1
jv|Javanés|Basa Jawa|ID|IDR
su|Sundanés|Basa Sunda|ID|IDR
ceb|Cebuano|Cebuano|PH|PHP
haw|Hawaiano|ʻŌlelo Hawaiʻi|US|USD
mi|Maorí|Te Reo Māori|NZ|NZD
sm|Samoano|Gagana Samoa|WS|WST
to|Tongano|Lea Faka-Tonga|TO|TOP
fj|Fiyiano|Vosa Vakaviti|FJ|FJD
ht|Criollo haitiano|Kreyòl ayisyen|HT|HTG
qu|Quechua|Runasimi|PE|PEN
gn|Guaraní|Avañe'ẽ|PY|PYG
ay|Aimara|Aymar aru|BO|BOB
la|Latín|Latina|VA|EUR
eo|Esperanto|Esperanto|EU|EUR
yi|Yidis|ייִדיש|IL|ILS|1
fy|Frisón|Frysk|NL|EUR
gd|Gaélico escocés|Gàidhlig|GB|GBP
br|Bretón|Brezhoneg|FR|EUR
co|Corso|Corsu|FR|EUR
oc|Occitano|Occitan|FR|EUR
tt|Tártaro|Татарча|RU|RUB
ti|Tigriña|ትግርኛ|ER|ERN
ny|Chichewa|Chichewa|MW|MWK
sn|Shona|chiShona|ZW|ZWL
st|Sesoto|Sesotho|LS|LSL
tl|Tagalo|Tagalog|PH|PHP
dv|Maldivo|ދިވެހި|MV|MVR|1
bo|Tibetano|བོད་སྐད་|CN|CNY
ak|Akan|Akan|GH|GHS`

export const LANGUAGES: Language[] = RAW.split('\n').map((l) => {
  const [code, name, native, cc, currency, rtl] = l.split('|')
  return { code, name, native, flag: flag(cc), rtl: rtl === '1', currency, locale: code }
})

export const LANG_BY_CODE: Record<string, Language> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l]),
)
export const getLang = (code: string) => LANG_BY_CODE[code] ?? LANG_BY_CODE.en

/** Idiomas con traducción completa en la demo del hero. */
export const DEMO_LANGS = ['es', 'en', 'fr', 'de', 'ja', 'ar'] as const
export type DemoLang = (typeof DEMO_LANGS)[number]
export const isDemoLang = (c: string): c is DemoLang => (DEMO_LANGS as readonly string[]).includes(c)

// ───────────────────────── Divisas ─────────────────────────
const FX_FROM_EUR: Record<string, number> = { EUR: 1, USD: 1.08, GBP: 0.86, JPY: 163, SAR: 4.05 }
const DEMO_CUR: Record<DemoLang, { cur: string; locale: string; symbol: string }> = {
  es: { cur: 'EUR', locale: 'es-ES', symbol: '€' },
  en: { cur: 'USD', locale: 'en-US', symbol: '$' },
  fr: { cur: 'EUR', locale: 'fr-FR', symbol: '€' },
  de: { cur: 'EUR', locale: 'de-DE', symbol: '€' },
  ja: { cur: 'JPY', locale: 'ja-JP', symbol: '¥' },
  ar: { cur: 'SAR', locale: 'ar-SA', symbol: 'ر.س' },
}
export const currencySymbol = (lang: DemoLang) => DEMO_CUR[lang].symbol

export function formatPrice(eur: number, lang: DemoLang): string {
  const cfg = DEMO_CUR[lang]
  const v = eur * (FX_FROM_EUR[cfg.cur] ?? 1)
  return new Intl.NumberFormat(cfg.locale, {
    style: 'currency',
    currency: cfg.cur,
    maximumFractionDigits: cfg.cur === 'JPY' ? 0 : 2,
  }).format(v)
}

// ───────────────────────── Sitios de demostración ─────────────────────────
export interface SiteContent {
  nav: string[]
  badge: string
  title: string
  sub: string
  cta: string
  itemsTitle: string
  items: { name: string; eur: number; emoji: string }[]
  trust: string
}
export interface SiteDef {
  host: string
  brand: string
  tint: string
  content: Record<DemoLang, SiteContent>
}

type Cp = Omit<SiteContent, 'items'> & { names: [string, string, string] }
const mk = (
  eur: [number, number, number],
  emojis: [string, string, string],
  c: Record<DemoLang, Cp>,
): Record<DemoLang, SiteContent> => {
  const out = {} as Record<DemoLang, SiteContent>
  for (const k of DEMO_LANGS) {
    const { names, ...rest } = c[k]
    out[k] = { ...rest, items: names.map((name, i) => ({ name, eur: eur[i], emoji: emojis[i] })) }
  }
  return out
}

const SHOP = mk([49.9, 89, 129], ['🧥', '👟', '👜'], {
  es: { nav: ['Novedades', 'Mujer', 'Hombre', 'Ofertas'], badge: 'Envío gratis', title: 'Moda sostenible para cada día', sub: 'Colección otoño: prendas duraderas, hechas en Europa.', cta: 'Comprar ahora', itemsTitle: 'Más vendidos', names: ['Abrigo de lana', 'Zapatillas urbanas', 'Bolso de piel'], trust: '30 días para devoluciones' },
  en: { nav: ['New in', 'Women', 'Men', 'Sale'], badge: 'Free shipping', title: 'Sustainable fashion for every day', sub: 'Autumn collection: durable pieces, made in Europe.', cta: 'Shop now', itemsTitle: 'Best sellers', names: ['Wool coat', 'Urban sneakers', 'Leather bag'], trust: '30-day returns' },
  fr: { nav: ['Nouveautés', 'Femme', 'Homme', 'Soldes'], badge: 'Livraison offerte', title: 'La mode durable au quotidien', sub: "Collection d'automne : pièces durables, fabriquées en Europe.", cta: 'Acheter maintenant', itemsTitle: 'Meilleures ventes', names: ['Manteau en laine', 'Baskets urbaines', 'Sac en cuir'], trust: 'Retours sous 30 jours' },
  de: { nav: ['Neuheiten', 'Damen', 'Herren', 'Sale'], badge: 'Gratis Versand', title: 'Nachhaltige Mode für jeden Tag', sub: 'Herbstkollektion: langlebige Stücke, hergestellt in Europa.', cta: 'Jetzt kaufen', itemsTitle: 'Bestseller', names: ['Wollmantel', 'Urbane Sneaker', 'Ledertasche'], trust: '30 Tage Rückgaberecht' },
  ja: { nav: ['新着', 'レディース', 'メンズ', 'セール'], badge: '送料無料', title: '毎日着られるサステナブルファッション', sub: '秋コレクション：ヨーロッパ製の長く使えるアイテム。', cta: '今すぐ購入', itemsTitle: '人気ランキング', names: ['ウールコート', 'アーバンスニーカー', 'レザーバッグ'], trust: '30日間返品可能' },
  ar: { nav: ['وصل حديثاً', 'نساء', 'رجال', 'تخفيضات'], badge: 'شحن مجاني', title: 'أزياء مستدامة لكل يوم', sub: 'مجموعة الخريف: قطع متينة صُنعت في أوروبا.', cta: 'تسوّق الآن', itemsTitle: 'الأكثر مبيعاً', names: ['معطف صوف', 'حذاء رياضي حضري', 'حقيبة جلدية'], trust: 'إرجاع خلال 30 يوماً' },
})

const DENTAL = mk([60, 150, 390], ['🦷', '✨', '😁'], {
  es: { nav: ['Tratamientos', 'Equipo', 'Casos', 'Contacto'], badge: 'Primera visita gratis', title: 'Tu sonrisa, en manos expertas', sub: 'Odontología sin dolor, con tecnología 3D y cita en 24 horas.', cta: 'Pedir cita', itemsTitle: 'Tratamientos populares', names: ['Limpieza dental', 'Blanqueamiento', 'Ortodoncia invisible'], trust: 'Más de 12.000 pacientes felices' },
  en: { nav: ['Treatments', 'Team', 'Cases', 'Contact'], badge: 'Free first visit', title: 'Your smile in expert hands', sub: 'Pain-free dentistry with 3D technology and appointments within 24 hours.', cta: 'Book appointment', itemsTitle: 'Popular treatments', names: ['Dental cleaning', 'Teeth whitening', 'Invisible braces'], trust: 'Over 12,000 happy patients' },
  fr: { nav: ['Soins', 'Équipe', 'Cas', 'Contact'], badge: 'Première visite offerte', title: 'Votre sourire entre de bonnes mains', sub: 'Dentisterie sans douleur, technologie 3D et rendez-vous sous 24 h.', cta: 'Prendre rendez-vous', itemsTitle: 'Soins populaires', names: ['Détartrage', 'Blanchiment', 'Orthodontie invisible'], trust: 'Plus de 12 000 patients satisfaits' },
  de: { nav: ['Behandlungen', 'Team', 'Fälle', 'Kontakt'], badge: 'Erster Besuch gratis', title: 'Ihr Lächeln in guten Händen', sub: 'Schmerzfreie Zahnmedizin mit 3D-Technologie und Termin innerhalb von 24 Stunden.', cta: 'Termin buchen', itemsTitle: 'Beliebte Behandlungen', names: ['Zahnreinigung', 'Zahnaufhellung', 'Unsichtbare Zahnspange'], trust: 'Über 12.000 zufriedene Patienten' },
  ja: { nav: ['診療内容', 'スタッフ', '症例', 'お問い合わせ'], badge: '初回無料', title: 'あなたの笑顔を専門医に', sub: '3D技術による痛みの少ない治療。24時間以内にご予約可能。', cta: '予約する', itemsTitle: '人気の治療', names: ['歯のクリーニング', 'ホワイトニング', '目立たない矯正'], trust: '1万2千人以上の患者様にご満足' },
  ar: { nav: ['العلاجات', 'الفريق', 'الحالات', 'اتصل بنا'], badge: 'الزيارة الأولى مجانية', title: 'ابتسامتك بين أيدٍ خبيرة', sub: 'طب أسنان بلا ألم بتقنية ثلاثية الأبعاد وموعد خلال 24 ساعة.', cta: 'احجز موعداً', itemsTitle: 'علاجات شائعة', names: ['تنظيف الأسنان', 'تبييض الأسنان', 'تقويم شفاف'], trust: 'أكثر من 12,000 مريض سعيد' },
})

const SAAS = mk([29, 79, 249], ['⚡', '📊', '🛡️'], {
  es: { nav: ['Producto', 'Precios', 'Clientes', 'Docs'], badge: 'Prueba 14 días', title: 'Automatiza tu facturación B2B', sub: 'Concilia pagos, envía recordatorios y cobra un 40 % más rápido.', cta: 'Empezar gratis', itemsTitle: 'Planes', names: ['Básico', 'Equipo', 'Corporativo'], trust: 'Cumple RGPD y SOC 2' },
  en: { nav: ['Product', 'Pricing', 'Customers', 'Docs'], badge: '14-day trial', title: 'Automate your B2B billing', sub: 'Reconcile payments, send reminders and get paid 40% faster.', cta: 'Start for free', itemsTitle: 'Plans', names: ['Basic', 'Team', 'Enterprise'], trust: 'GDPR and SOC 2 compliant' },
  fr: { nav: ['Produit', 'Tarifs', 'Clients', 'Docs'], badge: 'Essai 14 jours', title: 'Automatisez votre facturation B2B', sub: 'Rapprochez les paiements, envoyez des relances et encaissez 40 % plus vite.', cta: 'Commencer gratuitement', itemsTitle: 'Offres', names: ['Essentiel', 'Équipe', 'Entreprise'], trust: 'Conforme RGPD et SOC 2' },
  de: { nav: ['Produkt', 'Preise', 'Kunden', 'Doku'], badge: '14 Tage testen', title: 'Automatisieren Sie Ihre B2B-Abrechnung', sub: 'Zahlungen abgleichen, Erinnerungen senden und 40 % schneller bezahlt werden.', cta: 'Kostenlos starten', itemsTitle: 'Tarife', names: ['Basis', 'Team', 'Unternehmen'], trust: 'DSGVO- und SOC-2-konform' },
  ja: { nav: ['製品', '料金', '導入事例', 'ドキュメント'], badge: '14日間無料', title: 'B2B請求業務を自動化', sub: '入金消込、督促送信、回収を40%高速化。', cta: '無料で始める', itemsTitle: 'プラン', names: ['ベーシック', 'チーム', 'エンタープライズ'], trust: 'GDPR・SOC 2準拠' },
  ar: { nav: ['المنتج', 'الأسعار', 'العملاء', 'الوثائق'], badge: 'تجربة 14 يوماً', title: 'أتمتة فواتير الشركات', sub: 'طابق المدفوعات وأرسل التذكيرات واحصل على أموالك أسرع بنسبة 40٪.', cta: 'ابدأ مجاناً', itemsTitle: 'الخطط', names: ['الأساسية', 'الفريق', 'المؤسسات'], trust: 'متوافق مع GDPR وSOC 2' },
})

export const DEMO_SITES: SiteDef[] = [
  { host: 'tienda-ropa.es', brand: 'Tienda Ropa', tint: '#F59E0B', content: SHOP },
  { host: 'clinica-dental.com', brand: 'Clínica Dental', tint: '#06B6D4', content: DENTAL },
  { host: 'saas-b2b.io', brand: 'SaaS B2B', tint: '#4F46E5', content: SAAS },
]

export function normalizeHost(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[/?#].*$/, '')
}

/** Resuelve la URL escrita por el usuario a una plantilla de demo + marca. */
export function resolveSite(input: string): { site: SiteDef; host: string; custom: boolean } {
  const host = normalizeHost(input) || DEMO_SITES[0].host
  const known = DEMO_SITES.find((s) => s.host === host)
  if (known) return { site: known, host, custom: false }
  const label = host.split('.')[0] || 'tu-web'
  const brand = label.charAt(0).toUpperCase() + label.slice(1)
  return { site: { ...DEMO_SITES[2], host, brand, tint: '#7C3AED' }, host, custom: true }
}

/** Devuelve la URL traducida: tuweb.com → en.tuweb.com */
export function localizedHost(host: string, lang: string, sourceLang = 'es'): string {
  return lang === sourceLang ? host : `${lang}.${host}`
}

export const INDEX_STEPS = [
  'Subdominio y etiquetas hreflang generados',
  'Sitemap multilingüe enviado a Google',
  'Googlebot rastreando la versión traducida',
  'Página indexada y visible en Google',
]

// ───────────────────────── Motor contextual (editor) ─────────────────────────
export type EditorLang = 'en' | 'fr' | 'de'
export interface Segment {
  id: string
  source: string
  neural: Record<EditorLang, string>
  contextual: Record<EditorLang, string>
}
/** ⟦B⟧ = marca. El motor neural base la traduce; el contextual la respeta si está en el glosario. */
export const EDITOR_SEGMENTS: Segment[] = [
  {
    id: 'h',
    source: 'Con ⟦B⟧ lanzas tu tienda al mundo hoy',
    neural: {
      en: 'With Node you throw your shop to the world today',
      fr: 'Avec Nœud, vous jetez votre boutique au monde aujourd’hui',
      de: 'Mit Knoten werfen Sie Ihren Laden heute in die Welt',
    },
    contextual: {
      en: 'Launch your store worldwide today with ⟦B⟧',
      fr: 'Lancez votre boutique à l’international dès aujourd’hui avec ⟦B⟧',
      de: 'Bringen Sie Ihren Shop heute mit ⟦B⟧ auf den Weltmarkt',
    },
  },
  {
    id: 'p',
    source: 'Cierra más ventas con checkout local en cada país',
    neural: {
      en: 'Close more sales with local checkout in each country',
      fr: 'Fermez plus de ventes avec caisse locale dans chaque pays',
      de: 'Schließen Sie mehr Verkäufe mit lokaler Kasse in jedem Land',
    },
    contextual: {
      en: 'Win more orders with a local checkout in every market',
      fr: 'Concrétisez plus de commandes grâce à un paiement local sur chaque marché',
      de: 'Gewinnen Sie mehr Bestellungen mit lokalem Checkout in jedem Markt',
    },
  },
  {
    id: 'c',
    source: 'Empieza gratis, sin tarjeta',
    neural: {
      en: 'Start free, without card',
      fr: 'Commencez libre, sans carte',
      de: 'Beginnen Sie frei, ohne Karte',
    },
    contextual: {
      en: 'Start free — no credit card needed',
      fr: 'Essayez gratuitement, sans carte bancaire',
      de: 'Kostenlos starten – ohne Kreditkarte',
    },
  },
  {
    id: 'f',
    source: 'Envíos a toda Europa en 48 h',
    neural: {
      en: 'Shipments to all Europe in 48 h',
      fr: 'Envois à toute l’Europe en 48 h',
      de: 'Sendungen nach ganz Europa in 48 Std.',
    },
    contextual: {
      en: 'Delivery across Europe in 48 hours',
      fr: 'Livraison dans toute l’Europe en 48 h',
      de: 'Lieferung in ganz Europa innerhalb von 48 Stunden',
    },
  },
]
export const BRAND_NEURAL: Record<EditorLang, string> = { en: 'Node', fr: 'Nœud', de: 'Knoten' }

export function renderSegment(text: string, brand: string): string {
  return text.replace(/⟦B⟧/g, brand)
}

/** Simula latencia de red del motor. */
export function translateAsync(lang: string, ms = 650): Promise<string> {
  return new Promise((r) => setTimeout(() => r(lang), ms))
}

// ───────────────────────── ROI SEO ─────────────────────────
export interface RoiInput {
  visits: number
  ticket: number
  languages: number
}
export interface RoiPoint {
  month: string
  actual: number
  conNexo: number
}
const MONTHS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12']

export function computeRoi({ visits, ticket, languages }: RoiInput) {
  const upliftPct = Math.round(180 + ((Math.min(Math.max(languages, 1), 10) - 1) / 9) * 160) // 180 % → 340 %
  const conv = 0.02
  const series: RoiPoint[] = MONTHS.map((month, i) => {
    const ramp = 1 / (1 + Math.exp(-(i - 4.5) * 0.75)) // curva S de indexación
    const extra = visits * (upliftPct / 100) * ramp
    return { month, actual: Math.round(visits), conNexo: Math.round(visits + extra) }
  })
  const extraVisits12 = series.reduce((a, p) => a + (p.conNexo - p.actual), 0)
  const extraRevenue12 = Math.round(extraVisits12 * conv * ticket)
  const last = series[series.length - 1]
  return { upliftPct, series, extraVisits12, extraRevenue12, monthlyExtraEnd: last.conNexo - last.actual }
}

// ───────────────────────── Planes y precios ─────────────────────────
export interface Plan {
  id: string
  name: string
  eur: number
  weglot: number
  tagline: string
  features: string[]
  popular?: boolean
}
export const PLANS: Plan[] = [
  { id: 'free', name: 'Free', eur: 0, weglot: 0, tagline: 'Ideal para probar gratis, sin tarjeta', features: ['Hasta 2.500 palabras', '1 idioma', 'Sin tarjeta de crédito', 'Traducción neuronal base'] },
  { id: 'starter', name: 'Starter', eur: 13.5, weglot: 15, tagline: 'Para webs que empiezan a internacionalizarse', features: ['Hasta 15.000 palabras', '1 idioma extra', 'SEO multilingüe automático', 'Certificado SSL incluido'] },
  { id: 'business', name: 'Business', eur: 26.1, weglot: 29, tagline: 'Para negocios con tráfico internacional', features: ['Hasta 60.000 palabras', '3 idiomas', 'Glosario IA de marca', 'Redirección automática por país'] },
  { id: 'pro', name: 'Pro', eur: 71.1, weglot: 79, tagline: 'Para equipos que viven de su web', features: ['Hasta 250.000 palabras', '5 idiomas', 'Editor visual colaborativo', 'Estadísticas de visitas por idioma'], popular: true },
  { id: 'enterprise', name: 'Enterprise', eur: 269, weglot: 299, tagline: 'Escala global sin límites artificiales', features: ['+1.000.000 palabras', 'Idiomas ilimitados', 'API dedicada', 'Soporte prioritario 24/7'] },
]

/** Precio mensual efectivo. Anual = 10 meses pagados (2 gratis). */
export const effectiveMonthly = (eur: number, annual: boolean) => (annual ? (eur * 10) / 12 : eur)
export const fmtEur = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n)

/** Ahorro anual frente a Weglot con la misma frecuencia de facturación. */
export function annualSavings(plan: Plan, annual: boolean) {
  const months = annual ? 10 : 12
  return Math.round((plan.weglot - plan.eur) * months * 100) / 100
}

// ───────────────────────── Métricas vivas (simuladas) ─────────────────────────
export interface LiveMetrics {
  customers: number
  words: number
  sites: number
}
export const BASE_METRICS: LiveMetrics = { customers: 18420, words: 4_812_345_678, sites: 31870 }
export function tickMetrics(m: LiveMetrics): LiveMetrics {
  return {
    words: m.words + Math.floor(800 + Math.random() * 4200),
    customers: m.customers + (Math.random() < 0.18 ? 1 : 0),
    sites: m.sites + (Math.random() < 0.3 ? 1 : 0),
  }
}

// ───────────────────────── Integraciones ─────────────────────────
export interface Platform {
  id: string
  name: string
  steps: string
  snippet: string
}
const KEY = 'nx_live_8f3a2c91'
const HTML_SNIPPET = `<script src="https://cdn.nexotranslate.app/v1.js"></script>\n<script>Nexo.init({ key: "${KEY}" })</script>`
const WP_SNIPPET = `wp plugin install nexo-translate --activate\nwp option update nexo_api_key ${KEY}`
export const PLATFORMS: Platform[] = [
  { id: 'wordpress', name: 'WordPress', steps: 'Plugins → Añadir nuevo → “Nexo Translate” → Activar → pega tu clave API (o usa WP-CLI).', snippet: WP_SNIPPET },
  { id: 'shopify', name: 'Shopify', steps: 'Tienda online → Temas → Editar código → theme.liquid → pega antes de </head>.', snippet: HTML_SNIPPET },
  { id: 'webflow', name: 'Webflow', steps: 'Project settings → Custom code → Head code → pega y publica.', snippet: HTML_SNIPPET },
  { id: 'wix', name: 'Wix', steps: 'Configuración → Código personalizado → Añadir en Head → Todas las páginas.', snippet: HTML_SNIPPET },
  { id: 'squarespace', name: 'Squarespace', steps: 'Settings → Advanced → Code Injection → Header → pega y guarda.', snippet: HTML_SNIPPET },
  { id: 'react', name: 'React / Next.js / Vite', steps: 'Instala el paquete y envuelve tu app con el proveedor.', snippet: `npm i @nexo/translate\n\nimport { NexoProvider } from "@nexo/translate"\n<NexoProvider apiKey="${KEY}"><App /></NexoProvider>` },
  { id: 'woocommerce', name: 'WooCommerce', steps: 'Instala el plugin: detecta WooCommerce y traduce checkout, emails y moneda.', snippet: WP_SNIPPET },
  { id: 'html', name: 'HTML puro', steps: 'Pega estas 2 líneas antes de </head> en tu index.html.', snippet: HTML_SNIPPET },
]
export const MARQUEE_PLATFORMS = [
  'Shopify', 'WordPress', 'Webflow', 'React', 'Next.js', 'WooCommerce', 'Wix', 'Magento', 'Squarespace', 'PrestaShop',
]
