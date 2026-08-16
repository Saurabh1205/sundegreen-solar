"use client"
import { useEffect, useState } from 'react'

export default function FloatingWhatsApp() {
  const [quoteDetails, setQuoteDetails] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setIsVisible(true), 1000)

    // Check session storage for quotes periodically or on storage event
    const checkQuote = () => {
      const stored = sessionStorage.getItem('solar_quote')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const text = `Hi, I'm interested in solar installation. Here are my quote details:
- Name: ${parsed.name}
- System Size: ${parsed.suggestedKw} kW
- Estimated Price: ₹${parsed.quotePrice.toLocaleString()}
- Monthly Bill: ${parsed.bill}
- PIN Code: ${parsed.pincode}`
          setQuoteDetails(encodeURIComponent(text))
        } catch (e) {
          // ignore parsing error
        }
      } else {
        setQuoteDetails(encodeURIComponent("Hi, I want to talk to a solar expert about installing solar panels at my property."))
      }
    }

    checkQuote()
    // Listen for custom events when a new quote is generated
    window.addEventListener('quote_generated', checkQuote)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('quote_generated', checkQuote)
    }
  }, [])

  if (!isVisible) return null

  const whatsappNumber = "917507771361" // Company office mobile number
  const href = `https://wa.me/${whatsappNumber}?text=${quoteDetails || encodeURIComponent("Hi, I want to talk to a solar expert.")}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-sans select-none animate-bounce-subtle">
      {/* Tooltip / Status tag */}
      <div className="bg-white text-gray-900 border border-gray-150 px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-600 flex items-center gap-1.5 animate-fade-in pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Response within 15 mins</span>
      </div>

      {/* Floating Button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group font-600 text-sm md:text-base border border-emerald-400/20"
      >
        {/* WhatsApp Icon */}
        <svg className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.007 14.07 1.01 11.47 1.01c-5.436 0-9.862 4.372-9.866 9.802-.001 1.962.535 3.882 1.554 5.584L2.127 22.05l5.882-1.528c1.6.87 3.39 1.33 5.24 1.332z" />
        </svg>
        <span>Talk To Solar Expert</span>
      </a>
    </div>
  )
}
