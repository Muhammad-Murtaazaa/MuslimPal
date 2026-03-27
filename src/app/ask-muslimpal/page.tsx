import AskMuslimPalSidebar from '@/components/AskMuslimPalSidebar'

export default function AskMuslimPalPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="rounded-2xl border border-emerald-900/15 bg-white/70 p-5 backdrop-blur-md">
        <h1 className="font-serif text-3xl text-emerald-950">Ask MuslimPal</h1>
        <p className="mt-2 text-sm text-emerald-900/75">
          Dedicated chat window for Islamic educational guidance.
        </p>
      </header>
      <AskMuslimPalSidebar fullPage />
    </div>
  )
}
