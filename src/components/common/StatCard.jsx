import GlassCard from './GlassCard'

export default function StatCard({ label, value, unit, icon, accent = 'moss', trend }) {
  const accentClasses = {
    moss: 'text-moss-400 bg-moss-500/10 border-moss-500/20',
    lichen: 'text-lichen-400 bg-lichen-500/10 border-lichen-500/20',
    warn: 'text-signal-warn bg-signal-warn/10 border-signal-warn/20',
    bad: 'text-signal-bad bg-signal-bad/10 border-signal-bad/20',
  }[accent]

  return (
    <GlassCard className="p-5 animate-rise">
      <div className="flex items-start justify-between">
        <span className="field-label">{label}</span>
        {icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accentClasses}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-semibold text-bark-200">{value}</span>
        {unit && <span className="text-sm text-bark-400">{unit}</span>}
      </div>
      {trend && <div className="mt-2 text-xs text-bark-400">{trend}</div>}
    </GlassCard>
  )
}
