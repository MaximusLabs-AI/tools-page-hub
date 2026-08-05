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
    'Compare evidence coverage, editorial fit, features and pricing across AI-search, GEO, SEO, analytics and attribution tools.',
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
