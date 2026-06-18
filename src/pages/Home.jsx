import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import GlassCard from '../components/common/GlassCard'
import { IconLeaf, IconTarget, IconAward, IconSparkles, IconChevronRight } from '../components/common/Icons'

const FEATURES = [
  {
    icon: IconTarget,
    title: 'Calculate your footprint',
    desc: 'Answer four quick questions about your day and get an instant carbon score with a clear impact rating.',
  },
  {
    icon: IconSparkles,
    title: 'Personalized recommendations',
    desc: 'Get specific, actionable suggestions tied to your actual choices — not generic eco-tips.',
  },
  {
    icon: IconAward,
    title: 'Challenges and badges',
    desc: 'Complete eco challenges, earn points, and unlock badges from Green Beginner to Sustainability Champion.',
  },
]

export default function Home() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-canopy-glow" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="section-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5">
              <IconLeaf className="w-3.5 h-3.5" />
              Daily carbon awareness, made simple
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-bark-200 sm:text-5xl">
              Know your footprint.{' '}
              <span className="text-gradient-moss">Shrink it, one day at a time.</span>
            </h1>
            <p className="mt-5 text-base text-bark-300 sm:text-lg">
              CarbonWise AI turns your daily habits into a simple carbon score and clear steps to lower it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/dashboard" className="btn-primary px-6 py-3 text-base">
                Calculate My Footprint
                <IconChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/challenges" className="btn-secondary px-6 py-3 text-base">
                Explore Challenges
              </Link>
            </div>
            <p className="mt-5 text-xs text-bark-400">
              No sign-up. No tracking. Everything stays on your device.
            </p>
          </div>
        </div>
      </section>

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
          <Stat value="4" label="Daily inputs to track your footprint" />
          <Stat value="6" label="Eco challenges to build better habits" />
          <Stat value="3" label="Achievement tiers to unlock" />
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
