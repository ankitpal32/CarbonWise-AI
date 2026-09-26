<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
=======
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
import { IconLeaf, IconMenu, IconClose } from '../common/Icons'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/challenges', label: 'Challenges' },
  { to: '/about', label: 'About' },
<<<<<<< HEAD
  { to: '/settings', label: 'Settings' },
=======
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
<<<<<<< HEAD
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-carbon-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setOpen(false)}
          aria-label="CarbonWise AI Home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/25 transition-transform group-hover:scale-105">
=======

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-carbon-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-500/15 text-moss-400 ring-1 ring-moss-500/25 transition-transform group-hover:scale-105">
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
            <IconLeaf className="w-5 h-5" />
          </span>
          <span className="font-display text-lg font-semibold text-bark-200">
            CarbonWise <span className="text-moss-400">AI</span>
          </span>
        </NavLink>

<<<<<<< HEAD
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
=======
        <nav className="hidden items-center gap-1 md:flex">
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
<<<<<<< HEAD
                  isActive ? 'bg-moss-500/15 text-moss-400 font-semibold' : 'text-bark-300 hover:text-bark-100 hover:bg-white/[0.04]'
=======
                  isActive ? 'bg-moss-500/12 text-moss-400' : 'text-bark-300 hover:text-bark-200'
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
<<<<<<< HEAD
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-bark-300 md:hidden hover:bg-white/[0.05]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          aria-expanded={open}
=======
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-bark-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
        >
          {open ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
<<<<<<< HEAD
        <nav className="border-t border-white/[0.06] bg-carbon-950/95 px-4 py-3 md:hidden animate-rise" aria-label="Mobile Navigation">
=======
        <nav className="border-t border-white/[0.06] bg-carbon-950/95 px-4 py-3 md:hidden">
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
<<<<<<< HEAD
                  `rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-moss-500/15 text-moss-400 font-semibold' : 'text-bark-300 hover:bg-white/[0.04]'
=======
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-moss-500/12 text-moss-400' : 'text-bark-300 hover:bg-white/[0.04]'
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
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
