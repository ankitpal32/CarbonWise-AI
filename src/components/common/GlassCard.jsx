import { forwardRef } from 'react'

const GlassCard = forwardRef(function GlassCard(
  { children, className = '', as = 'div', glow = false, ...props },
  ref
) {
  const Tag = as
  return (
    <Tag
      ref={ref}
      className={`glass-card ${glow ? 'shadow-glow-moss' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
})

export default GlassCard
