import type { Metadata } from 'next'
import './globals.css'
import '../css/surah.css'
import ClientLayout from '../components/ClientLayout'

export const metadata: Metadata = {
  title: 'MuslimPal',
  description: 'Premium Islamic utility platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){document.documentElement.classList.add('dark');localStorage.setItem('theme','dark')})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
