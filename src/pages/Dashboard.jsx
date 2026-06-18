import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import CalculatorForm from '../components/calculator/CalculatorForm'
import ResultPanel from '../components/calculator/ResultPanel'
import StatCard from '../components/common/StatCard'
import WeeklyTrendChart from '../components/dashboard/WeeklyTrendChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'
import EnvironmentPanel from '../components/dashboard/EnvironmentPanel'
import AICoachPanel from '../components/coach/AICoachPanel'
import { useCarbonData } from '../hooks/useCarbonData'
import { useEnvData } from '../hooks/useEnvData'
import { IconTarget, IconTrendUp, IconTrendDown, IconAward } from '../components/common/Icons'

export default function Dashboard() {
  const { history, today, impact, points, badge, lastInput, submitToday } = useCarbonData()
  const [coachOpen, setCoachOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleSubmit = (inputs) => {
    submitToday(inputs)
    setEditing(false)
  }

  const weeklyAvg =
    history.length > 0
      ? +(history.slice(-7).reduce((sum, h) => sum + h.score, 0) / Math.min(history.length, 7)).toFixed(1)
      : 0

  const yesterday = history.length >= 2 ? history[history.length - 2] : null
  const delta = today && yesterday ? +(today.score - yesterday.score).toFixed(1) : null

  const { weather, airQuality, recommendations, loading, error, hasPermission, aqiAdvice } =
    useEnvData({ carbonScore: today?.score ?? 0, impactLabel: today ? impact?.label ?? '' : '' })

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8">
          <p className="section-eyebrow">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-bark-200 sm:text-4xl">
            Today's Footprint, at a Glance
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-bark-400">
            Log today's habits below to update your score, see your weekly trend, and get
            recommendations tailored to your choices.
          </p>
        </header>

        {/* Stat row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's Score"
            value={today ? today.score.toFixed(1) : '—'}
            unit="kg CO₂e"
            icon={<IconTarget className="w-4 h-4" />}
            accent="moss"
          />
          <StatCard
            label="7-Day Average"
            value={weeklyAvg || '—'}
            unit={weeklyAvg ? 'kg CO₂e' : ''}
            icon={<IconTrendUp className="w-4 h-4" />}
            accent="lichen"
          />
          <StatCard
            label="vs. Yesterday"
            value={delta !== null ? `${delta > 0 ? '+' : ''}${delta}` : '—'}
            unit={delta !== null ? 'kg CO₂e' : ''}
            icon={delta !== null && delta > 0 ? <IconTrendUp className="w-4 h-4" /> : <IconTrendDown className="w-4 h-4" />}
            accent={delta !== null && delta > 0 ? 'warn' : 'moss'}
          />
          <StatCard
            label="Impact Level"
            value={impact ? impact.label.replace(' Impact', '') : '—'}
            icon={<IconAward className="w-4 h-4" />}
            accent={impact?.id === 'low' ? 'moss' : impact?.id === 'moderate' ? 'lichen' : impact?.id === 'high' ? 'warn' : 'bad'}
            trend={`${badge.name} · ${points} pts`}
          />
        </div>

        {/* Calculator or results */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-bark-200">
              {today && !editing ? "Today's log" : "Log today's habits"}
            </h2>
            {today && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm font-medium text-bark-400 underline-offset-2 hover:text-moss-400 hover:underline"
              >
                Edit today's entry
              </button>
            )}
          </div>
          {today && !editing ? (
            <ResultPanel entry={today} onOpenCoach={() => setCoachOpen(true)} />
          ) : (
            <CalculatorForm initialValues={today?.inputs || lastInput} onSubmit={handleSubmit} />
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyTrendChart history={history} />
          <CategoryBreakdownChart breakdown={today?.breakdown} />
        </div>

        <div className="mt-6">
          <EnvironmentPanel
            weather={weather}
            airQuality={airQuality}
            recommendations={recommendations}
            loading={loading}
            error={!hasPermission ? 'Location permission is required to show live environmental data.' : error}
            aqiAdvice={aqiAdvice}
          />
        </div>
      </div>

      <AICoachPanel open={coachOpen} onClose={() => setCoachOpen(false)} entry={today} />
    </PageLayout>
  )
}
