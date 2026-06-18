import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import GlassCard from '../common/GlassCard'

const COLORS = ['#3fc47e', '#aed43b', '#e3b341', '#7d7464']
const LABELS = { transport: 'Transportation', electricity: 'Electricity', food: 'Food', plastic: 'Plastic' }

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="rounded-lg border border-white/10 bg-carbon-900/95 px-3 py-2 text-xs shadow-glass">
      <p className="font-medium text-bark-300">{d.name}</p>
      <p className="mt-0.5 font-mono text-moss-400">{d.value.toFixed(1)} kg CO₂e</p>
    </div>
  )
}

export default function CategoryBreakdownChart({ breakdown }) {
  const hasData = breakdown && Object.values(breakdown).some((v) => v > 0)
  const data = breakdown
    ? Object.entries(breakdown).map(([key, value]) => ({ name: LABELS[key], value }))
    : []

  return (
    <GlassCard className="p-6">
      <p className="section-eyebrow">Today's Mix</p>
      <h3 className="mt-1 font-display text-lg font-semibold text-bark-200">Category breakdown</h3>

      <div className="mt-4 h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
          <div className="flex h-full items-center justify-center text-center">
            <p className="max-w-xs text-sm text-bark-400">
              Calculate today's footprint to see your category mix.
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
