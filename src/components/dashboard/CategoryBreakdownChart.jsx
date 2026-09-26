import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GlassCard from '../common/GlassCard'

const COLORS = ['#3fc47e', '#aed43b', '#e3b341', '#7d7464']
<<<<<<< HEAD
const LABELS = {
  transport: 'Transportation',
  electricity: 'Electricity',
  food: 'Food',
  plastic: 'Plastic',
}
=======
const LABELS = { transport: 'Transportation', electricity: 'Electricity', food: 'Food', plastic: 'Plastic' }
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-white/10 bg-carbon-900/95 px-3 py-2 text-xs shadow-glass">
      <p className="font-medium text-bark-300">{d.name}</p>
<<<<<<< HEAD
      <p className="mt-0.5 font-mono text-moss-400">{(d.value || 0).toFixed(1)} kg CO₂e</p>
=======
      <p className="mt-0.5 font-mono text-moss-400">{d.value.toFixed(1)} kg CO₂e</p>
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
    </div>
  )
}

export default function CategoryBreakdownChart({ breakdown }) {
<<<<<<< HEAD
  const hasData =
    breakdown &&
    typeof breakdown === 'object' &&
    Object.values(breakdown).some((v) => typeof v === 'number' && v > 0)

  const data = hasData
    ? Object.entries(breakdown).map(([key, value]) => ({
        name: LABELS[key] || key,
        value: typeof value === 'number' ? value : 0,
      }))
=======
  const hasData = breakdown && Object.values(breakdown).some((v) => v > 0)
  const data = breakdown
    ? Object.entries(breakdown).map(([key, value]) => ({ name: LABELS[key], value }))
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
    : []

  return (
    <GlassCard className="p-6">
      <p className="section-eyebrow">Today's Mix</p>
      <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Category breakdown</h3>

<<<<<<< HEAD
      <div className="mt-4 h-64 w-full">
=======
      <div className="mt-4 h-64">
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
<<<<<<< HEAD
                innerRadius={50}
                outerRadius={80}
=======
                innerRadius={55}
                outerRadius={85}
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((_, i) => (
<<<<<<< HEAD
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
=======
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', color: '#a89d8c' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
<<<<<<< HEAD
          <div className="flex h-full flex-col items-center justify-center text-center p-6 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <p className="text-sm font-medium text-bark-300">No category breakdown yet.</p>
            <p className="mt-1 max-w-xs text-xs text-bark-400">
              Calculate today's footprint to see your emission proportions by category.
=======
          <div className="flex h-full items-center justify-center text-center">
            <p className="max-w-xs text-sm text-bark-400">
              Calculate today's footprint to see your category mix.
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
