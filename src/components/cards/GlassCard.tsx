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
      className={`rounded-2xl border border-emerald-900/10 bg-white/65 backdrop-blur-md shadow-[0_10px_30px_rgba(6,78,59,0.08)] ${className}`}
    >
      {(title || icon) && (
        <header className="flex items-center gap-2 border-b border-emerald-900/10 px-5 py-4">
          {icon}
          {title ? <h3 className="font-semibold text-emerald-950">{title}</h3> : null}
        </header>
      )}
      <div className="px-5 py-4">{children}</div>
    </article>
  )
}
