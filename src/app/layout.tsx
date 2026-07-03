import './globals.css'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

export const metadata = {
  title: 'Sun Degreen Solar - Power Your Future With Clean Solar Energy',
  description:
    'Professional solar panel installation solutions for homes, businesses, and industries in India.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <FloatingWhatsApp />
        <Footer />
      </body>
    </html>
  )
}
