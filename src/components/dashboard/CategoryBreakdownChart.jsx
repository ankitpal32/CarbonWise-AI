import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GlassCard from '../common/GlassCard'

const COLORS = ['#3fc47e', '#aed43b', '#e3b341', '#7d7464']
const LABELS = {
  transport: 'Transportation',
  electricity: 'Electricity',
  food: 'Food',
  plastic: 'Plastic',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-white/10 bg-carbon-900/95 px-3 py-2 text-xs shadow-glass">
      <p className="font-medium text-bark-300">{d.name}</p>
      <p className="mt-0.5 font-mono text-moss-400">{(d.value || 0).toFixed(1)} kg CO₂e</p>
    </div>
  )
}

export default function CategoryBreakdownChart({ breakdown }) {
  const hasData =
    breakdown &&
    typeof breakdown === 'object' &&
    Object.values(breakdown).some((v) => typeof v === 'number' && v > 0)

  const data = hasData
    ? Object.entries(breakdown).map(([key, value]) => ({
        name: LABELS[key] || key,
        value: typeof value === 'number' ? value : 0,
      }))
    : []

  return (
    <GlassCard className="p-6">
      <p className="section-eyebrow">Today's Mix</p>
      <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Category breakdown</h3>

      <div className="mt-4 h-64 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
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
          <div className="flex h-full flex-col items-center justify-center text-center p-6 rounded-xl border border-white/[0.04] bg-white/[0.01]">
            <p className="text-sm font-medium text-bark-300">No category breakdown yet.</p>
            <p className="mt-1 max-w-xs text-xs text-bark-400">
              Calculate today's footprint to see your emission proportions by category.
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
