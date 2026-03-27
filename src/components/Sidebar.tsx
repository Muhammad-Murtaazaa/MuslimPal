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
        className={`fixed top-0 left-0 h-full w-72 bg-[#FCFCF9]/95 dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-emerald-900/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-emerald-900/10 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F766E] mb-0.5">Navigation</p>
            <h2 className="text-lg font-bold text-emerald-950 dark:text-gray-100">MuslimPal</h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-emerald-700/70 hover:text-emerald-900 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                    ? 'bg-emerald-100 text-emerald-900'
                    : 'text-emerald-900/75 hover:bg-emerald-50 hover:text-emerald-950 dark:hover:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <Icon size={18} className={active ? 'text-[#0F766E]' : ''} />
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-emerald-900/10 dark:border-gray-800">
          <p className="text-xs text-center text-emerald-900/60 dark:text-gray-500">
            Built for prayer, learning, and mindful living.
          </p>
        </div>
      </div>
    </>
  )
}

export default Sidebar
