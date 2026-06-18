import GlassCard from '../common/GlassCard'
import { IconBolt, IconSparkles, IconLeaf } from '../common/Icons'

function StatRow({ label, value, unit }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-3 text-sm text-bark-300 last:border-b-0">
      <span>{label}</span>
      <span className="font-semibold text-bark-200">{value}{unit ? ` ${unit}` : ''}</span>
    </div>
  )
}

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
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-signal-bad/20 bg-signal-bad/10 px-4 py-4 text-sm text-signal-bad">
            {error}
          </div>
        )}

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
              </p>
            </div>
          </>
        )}
      </div>
    </GlassCard>
  )
}
