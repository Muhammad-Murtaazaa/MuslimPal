'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, Moon, Sun } from 'lucide-react'

interface HeaderProps {
  toggleSidebar: () => void
  toggleDarkMode: () => void
  isDarkMode: boolean
}

const Header = ({ toggleSidebar, toggleDarkMode, isDarkMode }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#FCFCF9]/85 shadow-sm backdrop-blur-md dark:border-pal-sage/20 dark:bg-pal-surface/90 dark:shadow-[0_8px_26px_rgba(1,26,20,0.55)]">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-4 md:px-6">
        <button
          onClick={toggleSidebar}
          className="mr-4 rounded-xl border border-emerald-900/15 p-2 text-emerald-900 hover:bg-emerald-50 dark:border-pal-sage/30 dark:text-pal-mint dark:hover:bg-pal-bg/65 dark:hover:text-pal-gold"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex-1">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-emerald-900/10 bg-white dark:border-pal-sage/20 dark:bg-pal-bg/85">
              <Image src="/logo.png" alt="MuslimPal logo" width={40} height={40} className="h-full w-full object-cover" priority />
            </span>
            <div>
              <p className="font-serif text-xl text-emerald-950 dark:text-pal-mint">MuslimPal</p>
              <p className="text-xs uppercase tracking-[0.12em] text-[#0F766E] dark:text-pal-sage">Islamic Utility Platform</p>
            </div>
          </Link>
        </div>

        <button
          onClick={toggleDarkMode}
          className="ml-4 rounded-xl border border-emerald-900/15 p-2 text-emerald-900 transition-colors hover:bg-emerald-50 dark:border-pal-sage/30 dark:text-pal-mint dark:hover:bg-pal-bg/65 dark:hover:text-pal-gold"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}

export default Header
