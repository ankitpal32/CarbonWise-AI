import { Link } from 'react-router-dom'
import { IconLeaf } from '../common/Icons'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-carbon-950/70 text-bark-400">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/25">
              <IconLeaf className="w-4 h-4" />
            </span>
            <span className="font-display text-sm font-semibold text-bark-200">
              CarbonWise <span className="text-moss-400">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link to="/about" className="hover:text-bark-200 transition-colors">Methodology</Link>
            <Link to="/settings" className="hover:text-bark-200 transition-colors">Data & Privacy</Link>
          </div>

          <p className="text-center text-xs text-bark-400 sm:text-right">
            Local-First Architecture · No Account Required
          </p>
        </div>

        <p className="mt-4 text-center text-[11px] text-bark-400/80 sm:text-left">
          Carbon calculations are personal estimates based on published emission factors (GHG Protocol model), designed for environmental awareness rather than formal compliance auditing.
        </p>
      </div>
    </footer>
  )
}
