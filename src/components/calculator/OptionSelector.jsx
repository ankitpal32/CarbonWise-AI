export default function OptionSelector({ label, options, value, onChange, columns = 3, name = 'option-group' }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    5: 'grid-cols-2 sm:grid-cols-5',
  }[columns] || 'grid-cols-1 sm:grid-cols-3'

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="field-label mb-3">{label}</legend>
      <div className={`grid ${gridCols} gap-2.5`} role="radiogroup" aria-label={label}>
        {options.map((opt) => {
          const selected = value === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              onClick={() => onChange(opt.id)}
              className={`group flex flex-col items-center justify-between gap-1.5 rounded-xl border p-3.5 text-center transition-all duration-150 focus-visible:ring-2 focus-visible:ring-moss-400 ${
                selected
                  ? 'border-moss-500/60 bg-moss-500/10 ring-1 ring-moss-500/30'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]'
              }`}
            >
              {opt.icon && (
                <span className={`transition-colors ${selected ? 'text-moss-400' : 'text-bark-400 group-hover:text-bark-200'}`}>
                  {opt.icon}
                </span>
              )}
              <span className={`text-sm font-semibold ${selected ? 'text-moss-300' : 'text-bark-200'}`}>
                {opt.label}
              </span>
              <span className="font-mono text-[11px] text-moss-400/90 font-medium">
                {opt.kg !== undefined ? `${opt.kg.toFixed(1)} kg` : ''}
              </span>
              {opt.blurb && (
                <span className="text-[11px] leading-tight text-bark-400/80 line-clamp-2">{opt.blurb}</span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
