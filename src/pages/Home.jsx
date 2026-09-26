import PageLayout from '../components/layout/PageLayout'
import LocationHero from '../components/home/LocationHero'
import GlassCard from '../components/common/GlassCard'
import { IconTarget, IconAward, IconSparkles } from '../components/common/Icons'

const FEATURES = [
  {
    icon: IconTarget,
    title: 'Calculate your footprint',
    desc: 'Answer four quick daily habit questions to get an instant carbon score in kg CO₂e with impact categorization.',
  },
  {
    icon: IconSparkles,
    title: 'Targeted reduction planner',
    desc: 'Identify your largest emission category and get concrete daily swaps tailored to your choices.',
  },
  {
    icon: IconAward,
    title: 'Challenges & active streaks',
    desc: 'Complete real-life eco challenges, build daily tracking streaks, and unlock achievement badges.',
  },
]

export default function Home() {
  return (
    <PageLayout>
      {/* Location-First Onboarding Hero */}
      <LocationHero />

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <GlassCard key={f.title} className="animate-rise p-6" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-moss-500/12 text-moss-400 ring-1 ring-moss-500/20">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-bark-200">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bark-400">{f.desc}</p>
              </GlassCard>
            )
          })}
        </div>
      </section>

      {/* Why it matters strip */}
      <section className="border-t border-white/[0.06] bg-carbon-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
          <Stat value="4" label="Daily inputs to calculate your footprint" />
          <Stat value="6" label="Eco challenges to form sustainable habits" />
          <Stat value="0" label="Accounts, passwords, or tracking databases" />
        </div>
      </section>
    </PageLayout>
  )
}

function Stat({ value, label }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-display text-3xl font-semibold text-moss-400">{value}</p>
      <p className="mt-1 text-sm text-bark-400">{label}</p>
    </div>
  )
}
