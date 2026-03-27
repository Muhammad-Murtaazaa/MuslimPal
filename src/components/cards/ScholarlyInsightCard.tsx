import { Lightbulb } from 'lucide-react'
import GlassCard from './GlassCard'

type ScholarlyInsightCardProps = {
  title: string
  takeaways: string[]
  answer: string
}

export default function ScholarlyInsightCard({ title, takeaways, answer }: ScholarlyInsightCardProps) {
  return (
    <GlassCard title={title} icon={<Lightbulb className="text-emerald-800" size={18} />}>
      <p className="text-sm leading-7 text-emerald-950/90">{answer}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-emerald-900/90">
        {takeaways.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ol>
      <footer className="mt-5 rounded-xl border border-emerald-900/10 bg-emerald-50/70 p-3 text-xs text-emerald-900/75">
        Citations & References: Generated educational summary. Always verify with qualified scholars and primary sources.
      </footer>
    </GlassCard>
  )
}
