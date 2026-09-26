import GlassCard from '../common/GlassCard'
import { IconBolt, IconSparkles, IconLeaf } from '../common/Icons'

function StatRow({ label, value, unit }) {
  return (
<<<<<<< HEAD
    <div className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-xs text-bark-300 last:border-b-0">
      <span>{label}</span>
      <span className="font-mono font-semibold text-bark-200">
        {value}
        {unit ? ` ${unit}` : ''}
      </span>
=======
    <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-bark-300 last:border-b-0">
      <span>{label}</span>
      <span className="font-semibold text-bark-200">{value}{unit ? ` ${unit}` : ''}</span>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
    </div>
  )
}

<<<<<<< HEAD
export default function EnvironmentPanel({
  weather,
  airQuality,
  recommendations,
  loading,
  error,
  aqiAdvice,
  locationStatus = 'granted',
}) {
  return (
    <GlassCard className="p-6 animate-rise">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="section-eyebrow">Local Conditions</p>
            <h3 className="font-display text-lg font-semibold text-bark-200">
              Weather & Air Quality Context
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {locationStatus === 'default' && (
              <span className="chip text-[10px] text-bark-400">
                Default Location
              </span>
            )}
            <span className="rounded-full bg-carbon-900/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-moss-400 border border-moss-500/20">
              Live Feed
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-8 text-center text-xs text-bark-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-moss-400" />
            Loading local environmental metrics...
=======
export default function EnvironmentPanel({ weather, airQuality, recommendations, loading, error, aqiAdvice }) {
  return (
    <GlassCard className="p-6 animate-rise">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow">Live Environment</p>
            <h3 className="font-display text-xl font-semibold text-bark-200">Local weather & air quality</h3>
          </div>
          <span className="rounded-full bg-carbon-900/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-bark-400">
            Real-time
          </span>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-8 text-center text-sm text-bark-400">
            Fetching weather and air quality data…
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          </div>
        )}

        {error && !loading && (
<<<<<<< HEAD
          <div className="rounded-xl border border-signal-warn/20 bg-signal-warn/10 p-3.5 text-xs text-signal-warn">
=======
          <div className="rounded-2xl border border-signal-bad/20 bg-signal-bad/10 px-4 py-4 text-sm text-signal-bad">
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
            {error}
          </div>
        )}

<<<<<<< HEAD
        {!loading && (weather || airQuality) && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-bark-300">
                  <IconBolt className="w-4 h-4 text-moss-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-bark-200">
                    Weather ({weather?.locationName || 'Local'})
                  </span>
                </div>
                <div className="mt-3 space-y-1">
                  <StatRow
                    label="Temperature"
                    value={weather?.temperature !== null && weather?.temperature !== undefined ? weather.temperature.toFixed(1) : '—'}
                    unit="°C"
                  />
                  <StatRow
                    label="Humidity"
                    value={weather?.humidity !== null && weather?.humidity !== undefined ? weather.humidity : '—'}
                    unit="%"
                  />
                  <StatRow
                    label="Wind Speed"
                    value={weather?.windSpeed !== null && weather?.windSpeed !== undefined ? weather.windSpeed.toFixed(1) : '—'}
                    unit="m/s"
                  />
                  <StatRow
                    label="Condition"
                    value={weather?.condition || 'Fair'}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-bark-300">
                  <IconLeaf className="w-4 h-4 text-moss-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-bark-200">
                    Air Quality Index
                  </span>
                </div>
                <div className="mt-3 space-y-1">
                  <StatRow
                    label="AQI Level"
                    value={airQuality?.aqiLevel?.label || 'Moderate'}
                  />
                  <StatRow
                    label="PM2.5"
                    value={airQuality?.pm25 !== null && airQuality?.pm25 !== undefined ? airQuality.pm25.toFixed(1) : '—'}
                    unit="µg/m³"
                  />
                  <StatRow
                    label="PM10"
                    value={airQuality?.pm10 !== null && airQuality?.pm10 !== undefined ? airQuality.pm10.toFixed(1) : '—'}
                    unit="µg/m³"
                  />
                  <StatRow
                    label="Ozone (O₃)"
                    value={airQuality?.o3 !== null && airQuality?.o3 !== undefined ? airQuality.o3.toFixed(1) : '—'}
                    unit="µg/m³"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-bark-300">
                <IconSparkles className="w-4 h-4 text-lichen-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-bark-200">
                  Contextual Eco Insight
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-bark-300">
                {recommendations || aqiAdvice || 'Current conditions are favorable for low-emission outdoor commuting and active transit.'}
=======
        {!loading && !error && weather && airQuality && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard className="border border-white/[0.07] p-4">
                <div className="flex items-center gap-2 text-bark-300">
                  <IconBolt className="w-4 h-4" />
                  <span className="text-sm font-semibold text-bark-200">Weather</span>
                </div>
                <div className="mt-4 space-y-3">
                  <StatRow label="Temp" value={weather.temperature?.toFixed(1) ?? '—'} unit="°C" />
                  <StatRow label="Humidity" value={weather.humidity ?? '—'} unit="%" />
                  <StatRow label="Wind" value={weather.windSpeed?.toFixed(1) ?? '—'} unit="m/s" />
                  <StatRow label="Condition" value={weather.condition || '—'} />
                </div>
              </GlassCard>

              <GlassCard className="border border-white/[0.07] p-4">
                <div className="flex items-center gap-2 text-bark-300">
                  <IconLeaf className="w-4 h-4" />
                  <span className="text-sm font-semibold text-bark-200">Air Quality</span>
                </div>
                <div className="mt-4 space-y-3">
                  <StatRow label="AQI" value={airQuality.aqi ?? '—'} />
                  <StatRow label="PM2.5" value={airQuality.pm25?.toFixed(1) ?? '—'} unit="µg/m³" />
                  <StatRow label="PM10" value={airQuality.pm10?.toFixed(1) ?? '—'} unit="µg/m³" />
                  <StatRow label="CO" value={airQuality.co?.toFixed(1) ?? '—'} unit="µg/m³" />
                  <StatRow label="NO₂" value={airQuality.no2?.toFixed(1) ?? '—'} unit="µg/m³" />
                  <StatRow label="O₃" value={airQuality.o3?.toFixed(1) ?? '—'} unit="µg/m³" />
                </div>
              </GlassCard>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 text-bark-300">
                <IconSparkles className="w-4 h-4" />
                <span className="text-sm font-semibold text-bark-200">Recommendations</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-bark-300">
                {recommendations || aqiAdvice || 'Use the live Gemini key in the AI Coach to get personalized sustainability guidance.'}
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
              </p>
            </div>
          </>
        )}
      </div>
    </GlassCard>
  )
}
