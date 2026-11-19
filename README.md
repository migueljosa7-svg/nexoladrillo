# NexoLadrillo

Plataforma de demostración de inversión inmobiliaria (datos ficticios). Vite + React + TypeScript + Tailwind v4 + Framer Motion + Recharts + Leaflet.

## Idiomas
Configuración en `src/i18n/languages.ts`; textos en `src/i18n/locales/<code>.ts` (el tipo `Messages` de `es.ts` obliga a que no falte ninguna clave).
Para añadir un idioma: entrada en `languages.ts` → crear `locales/<code>.ts` → registrarlo en `src/i18n/index.tsx` (`LOCALES`) → añadirlo a `public/sitemap.xml`.

## Datos de inmuebles
`src/services/properties/`: 16 conectores (`connectors.ts`), adaptadores y `normalizeProperty` (`adapters.ts`) y orquestador con caché/fallback (`propertyGateway.ts`).
APIs abiertas usadas: Photon (OpenStreetMap) y Zippopotam.us para geocodificar; teselas de OpenStreetMap para el mapa. Opcional: `VITE_PROPERTY_API_URLS="https://a/api,https://b/api"`.

## Scripts
`npm run dev` · `npm run build`
