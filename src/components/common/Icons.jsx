const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconLeaf({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 19c-1.5-6 1-13 13-14 2 9-3 14-9 14-1.4 0-2.8-.3-4-.7" />
      <path d="M6 18c2-4 4-7 9-11" />
    </svg>
  )
}

export function IconSprout({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 21v-8" />
      <path d="M12 13c-4 0-7-3-7-7 4 0 7 3 7 7Z" />
      <path d="M12 11c0-4 3-6 7-6 0 4-3 7-7 6Z" />
    </svg>
  )
}

export function IconTree({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 22v-6" />
      <path d="M12 16a5 5 0 0 1-4-8 4 4 0 0 1 3-5 4 4 0 0 1 6 1 5 5 0 0 1 3 8 5 5 0 0 1-4 4Z" />
    </svg>
  )
}

export function IconCar({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 16l1.5-5A2 2 0 0 1 6.4 9.5h11.2a2 2 0 0 1 1.9 1.5L21 16" />
      <rect x="3" y="16" width="18" height="4" rx="1" />
      <circle cx="7.5" cy="20" r="1.3" />
      <circle cx="16.5" cy="20" r="1.3" />
    </svg>
  )
}

export function IconBus({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="4" y="4" width="16" height="13" rx="2" />
      <path d="M4 11h16" />
      <circle cx="8" cy="20" r="1.3" />
      <circle cx="16" cy="20" r="1.3" />
    </svg>
  )
}

export function IconTrain({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="5" y="3" width="14" height="14" rx="3" />
      <path d="M5 11h14" />
      <path d="M9 21l-2-3M15 21l2-3" />
      <circle cx="9" cy="14" r="0.8" fill="currentColor" />
      <circle cx="15" cy="14" r="0.8" fill="currentColor" />
    </svg>
  )
}

export function IconBike({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="6" cy="17" r="3.2" />
      <circle cx="18" cy="17" r="3.2" />
      <path d="M6 17l4-8h4l3 5M9 9h3M10 17h8" />
    </svg>
  )
}

export function IconWalk({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="13" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
      <path d="M11 8l3 1 2 5-2 1.5M14 9l-1 4-4 2-1 5M11 14l-3 1.5" />
    </svg>
  )
}

export function IconBolt({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  )
}

export function IconPlate({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

export function IconBottle({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M10 2h4v3.2c0 .5.2 1 .6 1.3 1 .9 1.4 1.7 1.4 3v9.5a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V9.5c0-1.3.4-2.1 1.4-3 .4-.3.6-.8.6-1.3V2Z" />
      <path d="M10 4h4" />
    </svg>
  )
}

export function IconSparkles({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      <circle cx="12" cy="12" r="2.2" />
    </svg>
  )
}

export function IconCheck({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function IconChevronRight({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export function IconArrowRight({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function IconShieldCheck({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function IconMenu({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconClose({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconTrendUp({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  )
}

export function IconTrendDown({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M15 17h6v-6" />
    </svg>
  )
}

export function IconRobot({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="5" y="9" width="14" height="10" rx="2.5" />
      <path d="M12 4v3M9 9V7a3 3 0 0 1 6 0v2" />
      <circle cx="9.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="14" r="1" fill="currentColor" stroke="none" />
      <path d="M9 17h6" />
    </svg>
  )
}

export function IconTarget({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function IconAward({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5L7.5 21 12 18.5 16.5 21 15 13.5" />
    </svg>
  )
}
