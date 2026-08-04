import type {Metadata} from 'next'
import './globals.css'
import './components.css'
import {LogoSymbols} from '@/components/Logo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'MaximusLabs Tools — AI Search, GEO & SEO Tools Directory',
    template: '%s | MaximusLabs Tools',
  },
  description:
    'The tools directory that shows how much AI engines actually trust each tool. Compare AI-answer confidence, features and pricing across 50+ AI-search, SEO, analytics and attribution tools.',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <LogoSymbols />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
