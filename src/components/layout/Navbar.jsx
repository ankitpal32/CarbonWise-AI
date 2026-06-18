import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconLeaf, IconMenu, IconClose } from '../common/Icons'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-carbon-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/25 transition-transform group-hover:scale-105">
            <IconLeaf className="w-5 h-5" />
          </span>
          <span className="font-display text-lg font-semibold text-bark-200">
            CarbonWise <span className="text-moss-400">AI</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-moss-500/12 text-moss-400' : 'text-bark-300 hover:text-bark-200'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-bark-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/[0.06] bg-carbon-950/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-moss-500/12 text-moss-400' : 'text-bark-300 hover:bg-white/[0.04]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
