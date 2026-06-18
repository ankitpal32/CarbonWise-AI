export default function OptionSelector({ label, options, value, onChange, columns = 3 }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    5: 'grid-cols-2 sm:grid-cols-5',
  }[columns] || 'grid-cols-3'

  return (
    <div>
      <p className="field-label mb-3">{label}</p>
      <div className={`grid ${gridCols} gap-2.5`}>
        {options.map((opt) => {
          const selected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`group flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all duration-200 ${
                selected
                  ? 'border-moss-500/50 bg-moss-500/10 shadow-glow-moss'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
              }`}
            >
              {opt.icon && (
                <span className={`transition-colors ${selected ? 'text-moss-400' : 'text-bark-400 group-hover:text-bark-300'}`}>
                  {opt.icon}
                </span>
              )}
              <span className={`text-sm font-semibold ${selected ? 'text-moss-300' : 'text-bark-200'}`}>
                {opt.label}
              </span>
              {opt.blurb && (
                <span className="hidden text-[11px] leading-tight text-bark-400 sm:block">{opt.blurb}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
