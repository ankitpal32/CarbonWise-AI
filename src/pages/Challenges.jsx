import PageLayout from '../components/layout/PageLayout'
import ChallengeCard from '../components/challenges/ChallengeCard'
import ChallengeProgress from '../components/challenges/ChallengeProgress'
import BadgeCard from '../components/achievements/BadgeCard'
import { useCarbonData } from '../hooks/useCarbonData'
import { CHALLENGES, BADGES } from '../data/carbonData'

export default function Challenges() {
<<<<<<< HEAD
  const { completed, points, currentStreak, toggleChallenge } = useCarbonData()
=======
  const { completed, points, toggleChallenge } = useCarbonData()
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
  const completedCount = CHALLENGES.filter((c) => completed[c.id]).length

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <p className="section-eyebrow">Eco Challenges</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-bark-200 sm:text-4xl">
            Build Habits, Earn Points
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bark-400">
<<<<<<< HEAD
            Mark a challenge done whenever you complete it in real life. Points add up toward unlocking
            achievement badges and building your active streaks.
=======
            Mark a challenge done whenever you complete it in Real Life. Points add up toward your
            Achievement Badges below.
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          </p>
        </header>

        <div className="mb-8">
<<<<<<< HEAD
          <ChallengeProgress
            completedCount={completedCount}
            totalCount={CHALLENGES.length}
            points={points}
            currentStreak={currentStreak}
          />
=======
          <ChallengeProgress completedCount={completedCount} totalCount={CHALLENGES.length} points={points} />
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CHALLENGES.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
<<<<<<< HEAD
              completed={Boolean(completed[challenge.id])}
=======
              completed={!!completed[challenge.id]}
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
              onToggle={toggleChallenge}
            />
          ))}
        </div>

        <section className="mt-14">
          <header className="mb-6">
            <p className="section-eyebrow">Achievements</p>
<<<<<<< HEAD
            <h2 className="mt-1 font-display text-2xl font-semibold text-bark-200">Your Badges</h2>
=======
            <h2 className="mt-1 font-display text-2xl font-semibold text-bark-200">Your badges</h2>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
            <p className="mt-2 max-w-2xl text-sm text-bark-400">
              Badges unlock automatically as your total points grow.
            </p>
          </header>
          <div className="grid gap-5 sm:grid-cols-3">
            {BADGES.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} points={points} unlocked={points >= badge.minPoints} />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
