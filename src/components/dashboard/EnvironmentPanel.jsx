import GlassCard from '../common/GlassCard'
import { IconBolt, IconSparkles, IconLeaf } from '../common/Icons'

function StatRow({ label, value, unit }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-2.5 text-xs text-bark-300 last:border-b-0">
      <span>{label}</span>
      <span className="font-mono font-semibold text-bark-200">
        {value}
        {unit ? ` ${unit}` : ''}
      </span>
    </div>
  )
}

export default function EnvironmentPanel({
  weather,
  airQuality,
  locationInfo,
  recommendations,
  loading,
  error,
  aqiAdvice,
  locationStatus = 'fallback',
  onRequestLocation,
  isRequestingLocation = false,
}) {
  const isDefaultLocation = !locationInfo || locationInfo.isDefault || locationStatus === 'fallback' || locationStatus === 'denied'

  return (
    <GlassCard className="p-6 animate-rise">
      <div className="flex flex-col gap-5">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="section-eyebrow">Environmental Context</p>
            <h3 className="font-display text-lg font-semibold text-bark-200">
              Local Weather & Air Quality
            </h3>
          </div>
          <span className="rounded-full bg-carbon-900/80 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-moss-400 border border-moss-500/20">
            Live Feed
          </span>
        </div>

        {/* Minimal Location Context Bar */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm">📍</span>
              <span className="font-semibold text-sm text-bark-100">
                {locationInfo?.formattedName || 'Kolkata, West Bengal'}
              </span>
              {isDefaultLocation ? (
                <span className="chip text-[10px] py-0.5 px-2 text-bark-400 border-white/10 bg-white/[0.04]">
                  Default location
                </span>
              ) : (
                <span className="chip text-[10px] py-0.5 px-2 text-moss-400 border-moss-500/30 bg-moss-500/10">
                  Using your location
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-bark-400">
              {isDefaultLocation
                ? 'Regional baseline for Kolkata, West Bengal, India. Location access is completely optional.'
                : 'Using detected regional coordinates for local atmospheric context.'}
            </p>
          </div>

          {onRequestLocation && (
            <button
              type="button"
              onClick={onRequestLocation}
              disabled={isRequestingLocation}
              className="btn-secondary text-xs py-1.5 px-3.5 shrink-0"
              aria-label={isDefaultLocation ? 'Use my location to localize context' : 'Change or update detected location'}
            >
              {isRequestingLocation ? 'Updating...' : isDefaultLocation ? 'Use my location' : 'Change / Update location'}
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-8 text-center text-xs text-bark-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-moss-400" />
            Loading local environmental metrics...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-signal-warn/20 bg-signal-warn/10 p-3.5 text-xs text-signal-warn">
            {error}
          </div>
        )}

        {!loading && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Weather Card */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-bark-300">
                  <div className="flex items-center gap-2">
                    <IconBolt className="w-4 h-4 text-moss-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-bark-200">
                      Weather ({weather?.locationName || (isDefaultLocation ? 'Kolkata' : locationInfo?.city || 'Local')})
                    </span>
                  </div>
                </div>

                {weather ? (
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
                ) : (
                  <div className="mt-4 py-4 text-center text-xs text-bark-400">
                    Weather unavailable
                  </div>
                )}
              </div>

              {/* Air Quality Card */}
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-bark-300">
                  <div className="flex items-center gap-2">
                    <IconLeaf className="w-4 h-4 text-moss-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-bark-200">
                      Air Quality Index
                    </span>
                  </div>
                </div>

                {airQuality ? (
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
                ) : (
                  <div className="mt-4 py-4 text-center text-xs text-bark-400">
                    Air quality data unavailable
                  </div>
                )}
                <p className="mt-3 text-[10px] text-bark-500 leading-tight">
                  * Air quality reflects ambient regional monitoring, not an exact indoor measurement.
                </p>
              </div>
            </div>

            {/* Contextual Recommendation */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-bark-300">
                <IconSparkles className="w-4 h-4 text-lichen-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-bark-200">
                  Contextual Eco Insight
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-bark-300">
                {recommendations || aqiAdvice || 'Current conditions are favorable for low-emission outdoor commuting and active transit.'}
              </p>
            </div>
          </>
        )}
      </div>
    </GlassCard>
  )
}
