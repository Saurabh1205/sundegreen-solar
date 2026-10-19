import './globals.css'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import { localBusinessSchema, faqSchema, websiteSchema } from '../lib/schema'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sundegreensolar.in'),
  title: {
    default: 'Sun Degreen Solar | Best Rooftop Solar Panel Installation in Maharashtra',
    template: '%s | Sun Degreen Solar'
  },
  description:
    'Cut electricity bills by up to 90% with PM Surya Ghar subsidy (up to ₹78,000). Certified residential, commercial & industrial rooftop solar panel installation in Nagpur & Maharashtra. Call +91 75077 71361.',
  keywords: [
    'solar panel installation nagpur',
    'solar company in maharashtra',
    'rooftop solar panels for home',
    'pm surya ghar subsidy eligibility',
    '3kw solar system price with subsidy',
    'commercial solar plant installation',
    'solar panel installers near me',
    'solar water pump price maharashtra',
    'tata power solar panel',
    'waaree mono perc solar panels',
    'zero cost solar emi loan',
    'solar epc contractor maharashtra',
    'sundegreen solar nagpur'
  ],
  authors: [{ name: 'Sun Degreen Solar', url: 'https://www.sundegreensolar.in' }],
  creator: 'Sun Degreen Solar',
  publisher: 'Sun Degreen Solar',
  formatDetection: {
    telephone: true,
    address: true,
    email: true
  },
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.sundegreensolar.in',
    title: 'Sun Degreen Solar | Best Rooftop Solar Panel Installation in Maharashtra',
    description:
      'Save up to 90% on electricity bills with PM Surya Ghar subsidy (up to ₹78,000). Certified rooftop solar installation for homes & businesses. Call +91 75077 71361.',
    siteName: 'Sun Degreen Solar',
    images: [
      {
        url: '/sundegreen_logo.png',
        width: 1200,
        height: 630,
        alt: 'Sun Degreen Solar - Clean Energy. Greener Future.'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sun Degreen Solar | Clean Energy. Greener Future.',
    description:
      'Save up to 90% on electricity bills with PM Surya Ghar subsidy (up to ₹78,000). Call +91 75077 71361.',
    images: ['/sundegreen_logo.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  },
  manifest: '/site.webmanifest',
  other: {
    'geo.region': 'IN-MH',
    'geo.placename': 'Nagpur',
    'geo.position': '21.1458;79.0882',
    'ICBM': '21.1458, 79.0882'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Schema.org Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <FloatingWhatsApp />
        <Footer />
      </body>
    </html>
  )
}
