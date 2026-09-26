import GlassCard from '../common/GlassCard'
import { IconSprout, IconLeaf, IconTree } from '../common/Icons'

const ICONS = { sprout: IconSprout, leaf: IconLeaf, tree: IconTree }

export default function BadgeCard({ badge, points, unlocked }) {
  const Icon = ICONS[badge.icon] || IconLeaf
  const progress = Math.min(100, (points / Math.max(badge.minPoints, 1)) * 100)

  return (
    <GlassCard
      className={`flex flex-col items-center p-6 text-center transition-all duration-300 ${
        unlocked ? 'border-lichen-500/30' : 'opacity-60'
      }`}
    >
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ${
          unlocked
            ? 'bg-lichen-500/15 text-lichen-400 ring-lichen-500/30 shadow-glow-moss'
            : 'bg-white/[0.04] text-bark-400 ring-white/10'
        }`}
      >
        <Icon className="w-8 h-8" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-bark-200">{badge.name}</h3>
      <p className="mt-1 text-xs text-bark-400">{badge.desc}</p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-bark-400">
        {badge.minPoints === 0 ? 'Unlocked from the start' : `Requires ${badge.minPoints} pts`}
      </p>
      {!unlocked && badge.minPoints > 0 && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-moss-500/60 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </GlassCard>
  )
}
