import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlassCard from '../common/GlassCard'
import { IconLeaf, IconChevronRight, IconSparkles } from '../common/Icons'
import { useEnvData } from '../../hooks/useEnvData'

export default function LocationHero() {
  const navigate = useNavigate()
  const [requested, setRequested] = useState(false)
  const { weather, airQuality, locationInfo, loading, locationStatus, requestLocation } = useEnvData({ autoRequest: false })

  const handleUseLocation = async () => {
    setRequested(true)
    await requestLocation()
  }

  const isResolved = locationStatus === 'resolved' || (locationInfo && !locationInfo.isDefault)
  const isDeniedOrFailed = locationStatus === 'denied' || locationStatus === 'fallback'

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-canopy-glow pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-1.5 shadow-sm">
            <IconLeaf className="w-3.5 h-3.5 text-moss-400" />
            CarbonWise AI · Private & Local-First
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-bark-100 sm:text-5xl lg:text-6xl">
            Understand your estimated carbon footprint.{' '}
            <span className="text-gradient-moss block mt-1">Make practical changes. Track your progress.</span>
          </h1>

          <p className="mt-4 text-sm text-bark-300 sm:text-base max-w-2xl mx-auto leading-relaxed">
            Personalized daily carbon estimates, local weather context, and actionable habit swaps with zero sign-ups or tracking databases.
          </p>

          {/* Location & Onboarding Card */}
          <div className="mt-8 mx-auto max-w-xl">
            <GlassCard className="p-6 sm:p-7 border-moss-500/25">
              {!requested && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-moss-400">
                    <span className="flex h-2 w-2 rounded-full bg-moss-400 animate-pulse" />
                    Environmental Context
                  </div>

                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-bark-400">Active baseline:</span>
                      <span className="chip text-[10px] py-0 px-2 text-bark-300 border-white/10 bg-white/[0.04]">
                        Default location
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-sm text-bark-100">
                      {locationInfo?.formattedName || 'Kolkata, West Bengal'}
                    </p>
                    <p className="mt-1 text-[11px] text-bark-400">
                      Indian CEA grid baseline & regional telemetry active.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      aria-label="Use My Location to personalize weather and air quality"
                      className="btn-primary w-full sm:w-auto px-6 py-2.5 text-sm"
                    >
                      Use My Location
                    </button>
                    <Link
                      to="/dashboard"
                      className="btn-secondary w-full sm:w-auto px-6 py-2.5 text-sm"
                    >
                      Continue to Dashboard
                      <IconChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <p className="text-[11px] text-bark-400 pt-1 font-medium">
                    No account required · Geolocation is processed entirely within your browser.
                  </p>
                </div>
              )}

              {requested && loading && (
                <div className="py-6 space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <span className="h-3 w-3 animate-pulse-ring rounded-full bg-moss-400" />
                    <span className="font-display text-sm font-semibold text-bark-200">
                      Requesting browser location...
                    </span>
                  </div>
                  <p className="text-xs text-bark-400">
                    Connecting to local weather and air quality telemetry...
                  </p>
                </div>
              )}

              {requested && !loading && isResolved && (
                <div className="space-y-4 animate-rise">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <span className="font-display text-sm font-semibold text-bark-200">
                      Telemetry Ready
                    </span>
                    <span className="chip text-[10px] text-moss-400 border-moss-500/30 bg-moss-500/10">
                      Live Telemetry
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-left">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-bark-400">Location</p>
                      <p className="mt-1 font-semibold text-xs text-bark-200 truncate" title={locationInfo?.formattedName}>
                        {locationInfo?.city || 'Detected'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-bark-400">Weather</p>
                      <p className="mt-1 font-semibold text-xs text-bark-200">
                        {weather?.temperature !== null && weather?.temperature !== undefined ? `${weather?.temperature?.toFixed(0)}°C` : '—'} · {weather?.condition || 'Fair'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-bark-400">Air Quality</p>
                      <p className="mt-1 font-semibold text-xs text-moss-300">
                        {airQuality?.aqiLevel?.label || 'Moderate'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="btn-primary w-full py-2.5 text-sm"
                    >
                      <IconSparkles className="w-4 h-4" />
                      Start Carbon Check
                      <IconChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {requested && !loading && isDeniedOrFailed && (
                <div className="space-y-4 animate-rise">
                  <div className="rounded-xl border border-signal-warn/30 bg-signal-warn/10 p-3.5 text-xs text-signal-warn text-left">
                    <p className="font-semibold text-bark-200 mb-0.5">Location access unavailable.</p>
                    <p className="text-bark-300 text-[11px]">
                      CarbonWise remains on Kolkata, West Bengal (Default location) without requiring permissions.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      className="btn-secondary w-full sm:w-auto text-xs py-2 px-4"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard')}
                      className="btn-primary w-full sm:w-auto text-xs py-2 px-5"
                    >
                      Continue to Dashboard
                      <IconChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}
