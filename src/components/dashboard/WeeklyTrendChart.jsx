import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import GlassCard from '../common/GlassCard'

function formatDay(dateStr) {
<<<<<<< HEAD
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
  } catch {
    return dateStr
  }
=======
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short' })
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-carbon-900/95 px-3 py-2 text-xs shadow-glass">
      <p className="font-medium text-bark-300">{label}</p>
<<<<<<< HEAD
      <p className="mt-0.5 font-mono text-moss-400">{(payload[0].value || 0).toFixed(1)} kg CO₂e</p>
=======
      <p className="mt-0.5 font-mono text-moss-400">{payload[0].value.toFixed(1)} kg CO₂e</p>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
    </div>
  )
}

<<<<<<< HEAD
export default function WeeklyTrendChart({ history = [] }) {
  const safeHistory = Array.isArray(history) ? history : []
  const last7 = safeHistory
    .slice(-7)
    .filter((h) => h && typeof h.score === 'number')
    .map((h) => ({
      date: formatDay(h.date),
      score: h.score,
    }))
=======
export default function WeeklyTrendChart({ history }) {
  const last7 = history.slice(-7).map((h) => ({
    date: formatDay(h.date),
    score: h.score,
  }))
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882

  const hasData = last7.length > 0

  return (
    <GlassCard className="p-6">
      <p className="section-eyebrow">Weekly Trend</p>
<<<<<<< HEAD
      <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Emissions history</h3>

      <div className="mt-4 h-64 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3fc47e" stopOpacity={0.4} />
=======
      <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Your last 7 days</h3>

      <div className="mt-5 h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3fc47e" stopOpacity={0.35} />
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
                  <stop offset="100%" stopColor="#3fc47e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.3)"
<<<<<<< HEAD
                tick={{ fill: '#a89d8c', fontSize: 11 }}
=======
                tick={{ fill: '#a89d8c', fontSize: 12 }}
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
<<<<<<< HEAD
                tick={{ fill: '#a89d8c', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={36}
=======
                tick={{ fill: '#a89d8c', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={32}
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3fc47e"
                strokeWidth={2.5}
                fill="url(#trendFill)"
<<<<<<< HEAD
                dot={{ fill: '#3fc47e', r: 3.5, strokeWidth: 0 }}
=======
                dot={{ fill: '#3fc47e', r: 3, strokeWidth: 0 }}
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
<<<<<<< HEAD
          <div className="flex h-full flex-col items-center justify-center text-center p-6 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <p className="text-sm font-medium text-bark-300">No carbon history yet.</p>
            <p className="mt-1 max-w-xs text-xs text-bark-400">
              Complete your first carbon check above to see your 7-day trend.
=======
          <div className="flex h-full items-center justify-center text-center">
            <p className="max-w-xs text-sm text-bark-400">
              Log your first day on the Dashboard to start seeing your trend here.
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
