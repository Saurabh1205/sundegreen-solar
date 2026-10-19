import { ReactNode } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Instant Rooftop Solar Quote & Subsidy Assessment',
  description:
    'Generate a customized solar quotation, calculate net cost after PM Surya Ghar subsidy (up to ₹78,000), check low-interest EMI, and book a free solar survey with Sun Degreen Solar.'
}

export default function QuoteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
