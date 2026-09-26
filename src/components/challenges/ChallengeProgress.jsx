import GlassCard from '../common/GlassCard'

<<<<<<< HEAD
export default function ChallengeProgress({ completedCount, totalCount, points, currentStreak = 0 }) {
=======
export default function ChallengeProgress({ completedCount, totalCount, points }) {
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
  const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <GlassCard className="p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
<<<<<<< HEAD
          <p className="section-eyebrow">Active Daily Progress</p>
          <p className="mt-1 font-display text-2xl font-semibold text-bark-200">
            {completedCount} <span className="text-base text-bark-400">/ {totalCount} completed today</span>
          </p>
        </div>
        <div className="flex items-center gap-6 text-right">
          {currentStreak > 0 && (
            <div>
              <p className="section-eyebrow">Current Streak</p>
              <p className="mt-1 font-display text-2xl font-semibold text-moss-400">
                🔥 {currentStreak} <span className="text-xs text-bark-400 font-normal">days</span>
              </p>
            </div>
          )}
          <div>
            <p className="section-eyebrow">Total Points</p>
            <p className="mt-1 font-display text-2xl font-semibold text-lichen-400">{points}</p>
          </div>
=======
          <p className="section-eyebrow">Today's progress</p>
          <p className="mt-1 font-display text-2xl font-semibold text-bark-200">
            {completedCount} <span className="text-base text-bark-400">/ {totalCount} challenges</span>
          </p>
        </div>
        <div className="text-right">
          <p className="section-eyebrow">Total points</p>
          <p className="mt-1 font-display text-2xl font-semibold text-lichen-400">{points}</p>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
        </div>
      </div>
      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss-600 via-moss-400 to-lichen-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </GlassCard>
  )
}
