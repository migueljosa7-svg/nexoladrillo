import type { AssetType } from '../services/properties/types'

const hash = (s: string) => {
  let h = 7
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/** Ilustración vectorial ligera (sin imágenes externas): 0 = fachada, 1 = interior, 2 = barrio. */
export default function PropertyArt({ id, asset, variant = 0, className = '' }: { id: string; asset: AssetType; variant?: 0 | 1 | 2; className?: string }) {
  const h = hash(id)
  const hue = h % 360
  const accent = `hsl(${hue} 70% 55%)`
  const wall = `hsl(${(hue + 20) % 360} 45% 90%)`
  const dark = `hsl(${hue} 45% 28%)`
  const uid = `a${h}${variant}`
  const floors = asset === 'edificio' ? 6 : asset === 'vivienda' ? 4 : 2
  return (
    <svg viewBox="0 0 400 240" className={className} role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${uid}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${(hue + 190) % 360} 80% 82%)`} />
          <stop offset="1" stopColor="#fff7ed" />
        </linearGradient>
      </defs>
      {variant === 0 && (
        <g>
          <rect width="400" height="240" fill={`url(#${uid}s)`} />
          <circle cx={320 + (h % 40)} cy="50" r="22" fill="#fde68a" opacity=".9" />
          <rect x="0" y="200" width="400" height="40" fill="#cbd5e1" />
          <rect x="0" y="212" width="400" height="4" fill="#fff" opacity=".6" />
          {[40, 300, 350].map((x, i) => (
            <rect key={x} x={x} y={120 - i * 12} width="40" height={80 + i * 12} fill={`hsl(${hue} 25% ${72 - i * 6}%)`} opacity=".7" />
          ))}
          {asset === 'garaje' ? (
            <g>
              <rect x="90" y="110" width="220" height="90" fill={wall} stroke={dark} strokeWidth="3" />
              <rect x="120" y="135" width="160" height="65" fill={accent} />
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="120" x2="280" y1={147 + i * 13} y2={147 + i * 13} stroke="#fff" strokeOpacity=".5" strokeWidth="3" />
              ))}
            </g>
          ) : asset === 'local' ? (
            <g>
              <rect x="70" y="100" width="260" height="100" fill={wall} stroke={dark} strokeWidth="3" />
              <path d="M60 100h280l-20-30H80z" fill={accent} />
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <rect key={i} x={80 + i * 36} y="70" width="18" height="30" fill="#fff" opacity=".35" />
              ))}
              <rect x="95" y="125" width="120" height="75" fill="#e0f2fe" stroke={dark} strokeWidth="2" />
              <rect x="240" y="125" width="55" height="75" fill={dark} />
            </g>
          ) : (
            <g>
              <rect x="110" y={200 - floors * 26 - 10} width="180" height={floors * 26 + 10} fill={wall} stroke={dark} strokeWidth="3" />
              {Array.from({ length: floors }).flatMap((_, r) =>
                [0, 1, 2].map((c) => (
                  <rect key={`${r}-${c}`} x={125 + c * 55} y={200 - floors * 26 + r * 26} width="30" height="16" rx="2" fill="#bae6fd" stroke={dark} strokeWidth="1.5" />
                )),
              )}
              <rect x="185" y="178" width="30" height="22" fill={accent} />
              <rect x="110" y={200 - floors * 26 - 16} width="180" height="8" fill={accent} />
            </g>
          )}
        </g>
      )}
      {variant === 1 && (
        <g>
          <rect width="400" height="240" fill={wall} />
          <rect y="170" width="400" height="70" fill={`hsl(${hue} 30% 78%)`} />
          <rect x="250" y="40" width="110" height="100" rx="4" fill={`url(#${uid}s)`} stroke={dark} strokeWidth="4" />
          <line x1="305" x2="305" y1="40" y2="140" stroke={dark} strokeWidth="3" />
          <rect x="40" y="130" width="150" height="55" rx="12" fill={accent} />
          <rect x="30" y="115" width="30" height="70" rx="10" fill={accent} opacity=".85" />
          <rect x="170" y="115" width="30" height="70" rx="10" fill={accent} opacity=".85" />
          <rect x="60" y="185" width="8" height="14" fill={dark} />
          <rect x="165" y="185" width="8" height="14" fill={dark} />
          <rect x="215" y="160" width="60" height="8" rx="3" fill={dark} />
          <rect x="225" y="168" width="6" height="30" fill={dark} />
          <rect x="260" y="168" width="6" height="30" fill={dark} />
          <circle cx="80" cy="60" r="18" fill="#fff" opacity=".7" />
          <rect x="60" y="60" width="40" height="3" fill={dark} opacity=".3" />
        </g>
      )}
      {variant === 2 && (
        <g>
          <rect width="400" height="240" fill="#ecfdf5" />
          {[40, 130, 220, 310].map((x) => (
            <rect key={`v${x}`} x={x} y="0" width="22" height="240" fill="#fff" />
          ))}
          {[30, 100, 170].map((y) => (
            <rect key={`h${y}`} x="0" y={y} width="400" height="18" fill="#fff" />
          ))}
          {[[60, 50], [150, 120], [240, 50], [330, 120], [60, 190], [240, 190]].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x} y={y} width="55" height="40" rx="4" fill={`hsl(${hue} 30% 82%)`} opacity=".8" />
          ))}
          <rect x="170" y="40" width="40" height="40" rx="6" fill="#bbf7d0" />
          <path d="M200 70c-14-18-26-30-26-46a26 26 0 0 1 52 0c0 16-12 28-26 46z" transform="translate(-6 40)" fill={accent} stroke="#fff" strokeWidth="3" />
          <circle cx="194" cy="82" r="8" fill="#fff" />
        </g>
      )}
    </svg>
  )
}
