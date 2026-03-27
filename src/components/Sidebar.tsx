'use client'

import { usePathname, useRouter } from 'next/navigation'
import { X, LayoutDashboard, GraduationCap, HandCoins, BookOpen, Compass, HeartHandshake, CalendarDays } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, matchPrefix: false },
  { label: 'AI Scholar', path: '/scholar', icon: GraduationCap, matchPrefix: false },
  { label: 'Zakat', path: '/zakat', icon: HandCoins, matchPrefix: false },
  { label: 'Quran Reader', path: '/read', icon: BookOpen, matchPrefix: true },
  { label: 'Prayer Times & Qibla', path: '/pray-times-master', icon: Compass, matchPrefix: false },
  { label: 'Hijri Calendar', path: '/hijri-calendar', icon: CalendarDays, matchPrefix: false },
  { label: 'Dua Collection', path: '/dua', icon: HeartHandshake, matchPrefix: false },
]

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const currentPath = pathname ?? ''

  const handleNavigation = (path: string) => {
    router.push(path)
    toggleSidebar()
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-72 transform flex-col border-r border-emerald-900/10 bg-[#FCFCF9]/95 shadow-2xl transition-transform duration-300 ease-in-out dark:border-pal-sage/20 dark:bg-pal-bg/98 dark:shadow-[0_20px_45px_rgba(1,26,20,0.62)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-emerald-900/10 p-5 dark:border-pal-sage/20">
          <div>
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-[#0F766E] dark:text-pal-gold">Navigation</p>
            <h2 className="text-lg font-bold text-emerald-950 dark:text-pal-mint">MuslimPal</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 text-emerald-700/70 transition-colors hover:bg-emerald-50 hover:text-emerald-900 dark:text-pal-sage dark:hover:bg-pal-surface dark:hover:text-pal-gold"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon, matchPrefix }) => {
            const active = matchPrefix ? currentPath.startsWith(path) : currentPath === path
            return (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-pal-surface dark:text-pal-mint dark:ring-1 dark:ring-pal-sage/25'
                    : 'text-emerald-900/75 hover:bg-emerald-50 hover:text-emerald-950 dark:text-pal-body dark:hover:bg-pal-surface/80 dark:hover:text-pal-mint'
                }`}
              >
                <Icon size={18} className={active ? 'text-[#0F766E] dark:text-pal-gold' : ''} />
                {label}
                {active && (
                  <span className="ml-auto h-2.5 w-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_0_4px_rgba(212,175,55,0.18)]" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-emerald-900/10 p-4 dark:border-pal-sage/20">
          <p className="text-center text-xs text-emerald-900/60 dark:text-pal-sage">
            Built for prayer, learning, and mindful living.
          </p>
        </div>
      </div>
    </>
  )
}

export default Sidebar
