import { ReactNode } from 'react'

type GlassCardProps = {
  title?: string
  icon?: ReactNode
  className?: string
  children: ReactNode
}

export default function GlassCard({ title, icon, className = '', children }: GlassCardProps) {
  return (
    <article
      className={`pal-card shadow-[0_10px_30px_rgba(1,26,20,0.12)] dark:shadow-[0_20px_45px_rgba(1,26,20,0.52)] ${className}`}
    >
      {(title || icon) && (
        <header className="flex items-center gap-2 border-b border-emerald-900/10 px-5 py-4 dark:border-pal-sage/20">
          {icon}
          {title ? <h3 className="font-semibold text-emerald-950 dark:text-pal-gold">{title}</h3> : null}
        </header>
      )}
      <div className="px-5 py-4">{children}</div>
    </article>
  )
}
