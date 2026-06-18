import { getImpactLevel } from '../../data/carbonData'

export default function LeafGauge({ score, maxScore = 16, size = 220 }) {
  const level = getImpactLevel(score)
  const pct = Math.min(1, score / maxScore)
  const fillHeight = pct * 150 // leaf interior height in viewBox units

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 200 210" width={size} height={size * 1.05} className="overflow-visible">
        <defs>
          <clipPath id="leafClip">
            <path d="M100 18C58 18 24 56 24 104c0 50 34 88 76 88s76-38 76-88C176 56 142 18 100 18Z" />
          </clipPath>
          <linearGradient id="fillGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={level.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={level.color} stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* leaf outline track */}
        <path
          d="M100 18C58 18 24 56 24 104c0 50 34 88 76 88s76-38 76-88C176 56 142 18 100 18Z"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />

        {/* fill, clipped to leaf shape, rising from base */}
        <g clipPath="url(#leafClip)">
          <rect
            x="0"
            y={192 - fillHeight}
            width="200"
            height={fillHeight}
            fill="url(#fillGradient)"
            style={{ transition: 'y 0.8s cubic-bezier(0.16,1,0.3,1), height 0.8s cubic-bezier(0.16,1,0.3,1)' }}
          />
          {/* subtle wave line at the fill surface */}
          <path
            d={`M0 ${192 - fillHeight} Q50 ${188 - fillHeight} 100 ${192 - fillHeight} T200 ${192 - fillHeight}`}
            fill="none"
            stroke={level.color}
            strokeWidth="2"
            opacity="0.7"
            style={{ transition: 'd 0.8s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </g>

        {/* central vein */}
        <path d="M100 30v160" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
        <path d="M100 60 L70 80M100 90 L72 108M100 120 L74 136M100 150 L78 162" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
        <path d="M100 60 L130 80M100 90 L128 108M100 120 L126 136M100 150 L122 162" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />

        {/* stem */}
        <path d="M100 18C96 10 92 4 86 0" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>

      <div className="absolute top-[42%] flex flex-col items-center">
        <span className="font-display text-4xl font-semibold text-bark-200">{score.toFixed(1)}</span>
        <span className="text-xs text-bark-400 -mt-0.5">kg CO₂e</span>
      </div>

      <div
        className="mt-1 rounded-full px-3 py-1 text-xs font-semibold"
        style={{ color: level.color, backgroundColor: `${level.color}1A`, border: `1px solid ${level.color}33` }}
      >
        {level.label}
      </div>
    </div>
  )
}
