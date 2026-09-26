import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import CalculatorForm from '../components/calculator/CalculatorForm'
import ResultPanel from '../components/calculator/ResultPanel'
import StatCard from '../components/common/StatCard'
import GlassCard from '../components/common/GlassCard'
import WeeklyTrendChart from '../components/dashboard/WeeklyTrendChart'
import CategoryBreakdownChart from '../components/dashboard/CategoryBreakdownChart'
import EnvironmentPanel from '../components/dashboard/EnvironmentPanel'
import ReductionPlanner from '../components/dashboard/ReductionPlanner'
import GoalTracker from '../components/dashboard/GoalTracker'
import AICoachPanel from '../components/coach/AICoachPanel'
import { useCarbonData } from '../hooks/useCarbonData'
import { useEnvData } from '../hooks/useEnvData'
import { getReductionPlan } from '../data/carbonData'
import { IconTarget, IconTrendUp, IconTrendDown, IconAward, IconSparkles, IconRobot, IconCheck } from '../components/common/Icons'

export default function Dashboard() {
  const {
    history,
    today,
    impact,
    points,
    badge,
    lastInput,
    goal,
    currentStreak,
    completed,
    submitToday,
    toggleChallenge,
    setPersonalGoal,
  } = useCarbonData()

  const [coachOpen, setCoachOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleSubmit = (inputs) => {
    submitToday(inputs)
    setEditing(false)
  }

  const weeklyAvg =
    history.length > 0
      ? +(history.slice(-7).reduce((sum, h) => sum + (typeof h?.score === 'number' && Number.isFinite(h.score) ? h.score : 0), 0) / Math.min(history.length, 7)).toFixed(1)
      : 0

  const yesterday = history.length >= 2 ? history[history.length - 2] : null
  const delta =
    today && yesterday && typeof today.score === 'number' && typeof yesterday.score === 'number'
      ? +(today.score - yesterday.score).toFixed(1)
      : null

  const { weather, airQuality, locationInfo, recommendations, loading, error, locationStatus, aqiAdvice, requestLocation } =
    useEnvData({ carbonScore: today?.score ?? 0, impactLabel: today ? impact?.label ?? '' : '' })

  const reductionPlan = today?.breakdown ? getReductionPlan(today.breakdown) : null
  const topAction = reductionPlan?.actions?.[0]
  const isTopActionDone = topAction ? Boolean(completed[topAction.challengeId]) : false

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Header with Location Context Strip */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-eyebrow">Personal Footprint Dashboard</p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-bark-200 sm:text-4xl">
                Your CarbonWise Overview
              </h1>
            </div>

            {/* Live Context Badge */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 backdrop-blur-md">
              <span className="text-sm">📍</span>
              <div className="text-left text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="block font-medium text-bark-200 truncate max-w-[150px] sm:max-w-[200px]">
                    {locationInfo?.formattedName || 'Kolkata, West Bengal'}
                  </span>
                  {(!locationInfo || locationInfo.isDefault) && (
                    <span className="chip text-[9px] py-0 px-1.5 text-bark-400 border-white/10 bg-white/[0.03]">
                      Default location
                    </span>
                  )}
                </div>
                <span className="block text-[10px] text-bark-400">
                  {weather && typeof weather.temperature === 'number' && Number.isFinite(weather.temperature)
                    ? `${weather.temperature.toFixed(0)}°C, ${weather.condition || 'Fair'}`
                    : 'Telemetry active'} · AQI {airQuality?.aqiLevel?.label || 'Moderate'}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-bark-400">
            Log today's habits to calculate your estimated footprint in kg CO₂e, track reductions against your goals, and receive localized guidance.
          </p>
        </header>

        {/* Stat row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Today's Score"
            value={today && typeof today.score === 'number' && Number.isFinite(today.score) ? today.score.toFixed(1) : '—'}
            unit="kg CO₂e"
            icon={<IconTarget className="w-4 h-4" />}
            accent="moss"
            trend={currentStreak > 0 ? `🔥 ${currentStreak} day streak` : 'Log today to start streak'}
          />
          <StatCard
            label="7-Day Average"
            value={weeklyAvg > 0 ? weeklyAvg.toFixed(1) : '—'}
            unit={weeklyAvg > 0 ? 'kg CO₂e' : ''}
            icon={<IconTrendUp className="w-4 h-4" />}
            accent="lichen"
            trend={history.length > 0 ? `${history.length} total logged days` : 'No history yet'}
          />
          <StatCard
            label="vs. Previous Log"
            value={delta !== null && Number.isFinite(delta) ? `${delta > 0 ? '+' : ''}${delta}` : '—'}
            unit={delta !== null ? 'kg CO₂e' : ''}
            icon={delta !== null && delta > 0 ? <IconTrendUp className="w-4 h-4" /> : <IconTrendDown className="w-4 h-4" />}
            accent={delta !== null && delta > 0 ? 'warn' : 'moss'}
            trend={delta !== null ? (delta <= 0 ? 'Estimated decrease' : 'Higher than previous') : 'Need 2+ days'}
          />
          <StatCard
            label="Impact Level"
            value={impact && impact.label ? impact.label.replace(' Impact', '') : '—'}
            icon={<IconAward className="w-4 h-4" />}
            accent={impact?.id === 'low' ? 'moss' : impact?.id === 'moderate' ? 'lichen' : impact?.id === 'high' ? 'warn' : 'bad'}
            trend={`${badge?.name || 'Green Beginner'} · ${points || 0} pts`}
          />
        </div>

        {/* Before / After Trend Banner (When 2+ days logged) */}
        {history.length >= 2 && yesterday && today && (
          <div className="mb-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs text-bark-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-bark-200">Historical Comparison:</span>
                <span>Previous estimate: <b>{yesterday.score.toFixed(1)} kg CO₂e</b></span>
                <span>→</span>
                <span>Current estimate: <b>{today.score.toFixed(1)} kg CO₂e</b></span>
              </div>
              <span className={`font-mono font-semibold ${delta <= 0 ? 'text-moss-400' : 'text-signal-warn'}`}>
                {delta <= 0 ? `▼ ${Math.abs(delta)} kg CO₂e estimated decrease` : `▲ +${delta} kg CO₂e estimated increase`}
              </span>
            </div>
          </div>
        )}

        {/* Personal Goal Tracker */}
        <div className="mb-8">
          <GoalTracker
            currentScore={today?.score || 0}
            goal={goal}
            onSaveGoal={setPersonalGoal}
          />
        </div>

        {/* Calculator or results */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-bark-200">
              {today && !editing ? "Today's footprint summary" : "Log today's habits"}
            </h2>
            {today && !editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-sm font-medium text-bark-300 underline-offset-2 hover:text-moss-400 hover:underline"
              >
                Edit today's log
              </button>
            )}
          </div>
          {today && !editing ? (
            <ResultPanel entry={today} onOpenCoach={() => setCoachOpen(true)} />
          ) : (
            <CalculatorForm initialValues={today?.inputs || lastInput} onSubmit={handleSubmit} />
          )}
        </div>

        {/* Today's Sustainability Insight (Concise AI UX) */}
        {today && reductionPlan && (
          <div className="mb-8">
            <GlassCard className="p-5 sm:p-6 border-moss-500/25 bg-moss-500/[0.04]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-moss-500/15 text-moss-400">
                      <IconRobot className="w-4 h-4" />
                    </span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-moss-400">
                      Today's Sustainability Insight
                    </span>
                  </div>
                  <p className="text-sm font-medium text-bark-100">
                    {reductionPlan.largestLabel} is currently your largest estimated category ({reductionPlan.largestValue.toFixed(1)} kg CO₂e).
                  </p>
                  {topAction && (
                    <p className="text-xs text-bark-300">
                      <b>Practical focus:</b> {topAction.text}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  {topAction?.challengeId && (
                    <button
                      type="button"
                      onClick={() => toggleChallenge(topAction.challengeId, 15)}
                      className={`btn-secondary text-xs py-2 px-3.5 ${isTopActionDone ? 'border-moss-500/40 text-moss-300 bg-moss-500/15' : ''}`}
                    >
                      {isTopActionDone ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-moss-400" /> Challenge Active
                        </>
                      ) : (
                        'Make This a Challenge'
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCoachOpen(true)}
                    className="btn-primary text-xs py-2 px-3.5 shadow-glow-moss"
                  >
                    <IconSparkles className="w-3.5 h-3.5" />
                    Ask AI Coach
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Reduction Planner */}
        {today?.breakdown && (
          <div className="mb-8">
            <ReductionPlanner
              breakdown={today.breakdown}
              completedChallenges={completed}
              onToggleChallenge={toggleChallenge}
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <WeeklyTrendChart history={history} />
          <CategoryBreakdownChart breakdown={today?.breakdown} />
        </div>

        <div className="mt-6">
          <EnvironmentPanel
            weather={weather}
            airQuality={airQuality}
            locationInfo={locationInfo}
            recommendations={recommendations}
            loading={loading}
            error={error}
            aqiAdvice={aqiAdvice}
            locationStatus={locationStatus}
            onRequestLocation={requestLocation}
            isRequestingLocation={locationStatus === 'requesting'}
          />
        </div>
      </div>

      <AICoachPanel
        open={coachOpen}
        onClose={() => setCoachOpen(false)}
        entry={today}
        weather={weather}
        airQuality={airQuality}
        locationInfo={locationInfo}
        goal={goal}
        streak={currentStreak}
        history={history}
      />
    </PageLayout>
  )
}
