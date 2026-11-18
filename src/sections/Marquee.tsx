import { MARQUEE_PLATFORMS } from '../services/translationEngineMock'

export default function Marquee() {
  const items = [...MARQUEE_PLATFORMS, ...MARQUEE_PLATFORMS]
  return (
    <section aria-label="Plataformas compatibles" className="border-y border-slate-200 bg-white py-8">
      <p className="mb-5 text-center text-sm font-medium text-slate-600">Compatible con las plataformas que ya usas</p>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee gap-10">
          {items.map((p, i) => (
            <li
              key={i}
              aria-hidden={i >= MARQUEE_PLATFORMS.length}
              className="whitespace-nowrap text-2xl font-bold tracking-tight text-slate-500"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
