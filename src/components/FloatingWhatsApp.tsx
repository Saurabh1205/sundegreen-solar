"use client"
import { useEffect, useState, useRef } from 'react'

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([])
  const [hasNewBadge, setHasNewBadge] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const whatsappNumber = "917507771361" // Sun Degreen Solar primary office number

  // Quick prompt suggestions for solar customers
  const quickChips = [
    "☀️ Get Free Solar Quote",
    "💰 PM Surya Ghar Subsidy (₹78k)",
    "🏡 Book Free Site Survey",
    "🪙 Solar EMI & Loan Info"
  ]

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setIsVisible(true), 800)

    // Check session storage for quotes periodically or on storage event
    const checkQuote = () => {
      const stored = sessionStorage.getItem('solar_quote')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const text = `Hi Sun Degreen Solar, I generated a quote on your website and would like to proceed:
• Name: ${parsed.name || 'Customer'}
• System Size: ${parsed.suggestedKw} kW (${parsed.brand || 'Solar PV'})
• Estimated Cost: ₹${parsed.quotePrice ? parsed.quotePrice.toLocaleString() : 'N/A'}
• Monthly Bill: ${parsed.bill || 'N/A'}
• PIN Code: ${parsed.pincode || 'N/A'}`
          setMessage(text)
        } catch {
          // fallback default
          setMessage("Hi, I want to talk to a solar expert about installing solar panels at my property.")
        }
      } else {
        setMessage("Hi, I want to talk to a solar expert about installing solar panels at my property.")
      }
    }

    checkQuote()
    window.addEventListener('quote_generated', checkQuote)

    // Initial agent welcome message
    setChatHistory([
      {
        sender: 'agent',
        text: "👋 Hello! Welcome to Sun Degreen Solar.\n\nHow can we help you power your home or business with clean solar energy today? Feel free to ask about our rooftop systems, PM Surya Ghar subsidy (up to ₹78,000), or request a free site inspection!",
        time: getCurrentTime()
      }
    ])

    return () => {
      clearTimeout(timer)
      window.removeEventListener('quote_generated', checkQuote)
    }
  }, [])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasNewBadge(false)
      setTimeout(() => {
        inputRef.current?.focus()
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }, [isOpen])

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory, isOpen])

  const handleSendMessage = (textToSend?: string) => {
    const finalMsg = (textToSend || message).trim()
    if (!finalMsg) return

    const time = getCurrentTime()
    // Append to local live chat
    setChatHistory(prev => [...prev, { sender: 'user', text: finalMsg, time }])

    // Directly dispatch to WhatsApp with 7507771361
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(finalMsg)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')

    // Reset input
    setMessage('')

    // System acknowledgement
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'agent',
          text: "✅ Connecting you to WhatsApp! Our solar engineer at +91 75077 71361 is opening your chat right now.",
          time: getCurrentTime()
        }
      ])
    }, 600)
  }

  const handleChipClick = (chipText: string) => {
    setMessage(chipText)
    handleSendMessage(chipText)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end select-none font-sans">
      {/* WhatsApp Live Chat Modal Window (Matching Reference Image) */}
      {isOpen && (
        <div 
          className="mb-3 w-[92vw] max-w-[370px] sm:w-[380px] h-[520px] max-h-[82vh] bg-[#efeae2] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-emerald-900/10 animate-in fade-in zoom-in-95 duration-200 transition-all"
          style={{
            backgroundImage: "url('/whatsapp-doodle.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "280px"
          }}
        >
          {/* Header (WhatsApp Deep Green #075E54) */}
          <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3">
              {/* WhatsApp / Expert Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden shadow-inner">
                  {/* WhatsApp Brand Icon */}
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.007 14.07 1.01 11.47 1.01c-5.436 0-9.862 4.372-9.866 9.802-.001 1.962.535 3.882 1.554 5.584L2.127 22.05l5.882-1.528c1.6.87 3.39 1.33 5.24 1.332z" />
                  </svg>
                </div>
                {/* Active Online Pulse */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base leading-tight tracking-wide">WhatsApp</h3>
                  <span className="text-[10px] bg-white/20 text-emerald-100 px-1.5 py-0.5 rounded font-medium">Verified</span>
                </div>
                <p className="text-xs text-emerald-100/90 leading-tight">Sun Degreen Solar • Online</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Close WhatsApp chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages Body with Doodle Background */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
            {/* Timestamp Notice */}
            <div className="flex justify-center">
              <span className="bg-white/80 backdrop-blur-sm text-gray-500 text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm">
                Official WhatsApp Helpline • +91 75077 71361
              </span>
            </div>

            {/* Conversation Flow */}
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[85%] rounded-2xl p-3 shadow-md text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none'
                  }`}
                >
                  {/* Sender label for Agent */}
                  {msg.sender === 'agent' && idx === 0 && (
                    <div className="text-[11px] font-bold text-[#075E54] mb-1 flex items-center gap-1">
                      <span>☀️ Solar Engineering Support</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line text-[13px]">{msg.text}</p>

                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <span className="text-[#34B7F1] font-bold">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Suggestion Chips */}
            {chatHistory.length <= 2 && (
              <div className="pt-2">
                <p className="text-[11px] text-gray-600 font-semibold mb-2 px-1">Quick Inquiries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip)}
                      className="bg-white/95 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-full border border-gray-200/80 shadow-sm transition-all hover:scale-[1.02] active:scale-95 text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Bottom WhatsApp Input Bar (Matching Reference Image) */}
          <div className="bg-[#f0f2f5] p-2.5 sm:p-3 border-t border-gray-200 flex items-center gap-2">
            {/* Input field pill */}
            <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 border border-gray-200 shadow-sm focus-within:border-emerald-500 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Type a message..."
                className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
              />
            </div>

            {/* Send Button (Teal Green circle with paper airplane icon) */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!message.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all transform active:scale-90 flex-shrink-0 ${
                message.trim()
                  ? 'bg-[#128C7E] hover:bg-[#075E54] text-white hover:scale-105'
                  : 'bg-[#128C7E]/70 text-white/90 cursor-not-allowed'
              }`}
              title="Send to WhatsApp (+91 75077 71361)"
              aria-label="Send message to WhatsApp"
            >
              {/* Paper airplane send icon matching reference image */}
              <svg className="w-5 h-5 fill-current transform rotate-45 -translate-y-0.5 -translate-x-0.5" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (Talk To Solar Expert) */}
      <div className="flex flex-col items-end gap-2">
        {/* Status tooltip banner (only when chat is closed) */}
        {!isOpen && (
          <div className="bg-white text-gray-900 border border-gray-150 px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-600 flex items-center gap-2 animate-fade-in pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Response within 15 mins</span>
          </div>
        )}

        {/* The Main Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group font-600 text-sm md:text-base border border-emerald-400/20 ${
            isOpen 
              ? 'bg-gray-800 hover:bg-gray-900 text-white' 
              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
          aria-label={isOpen ? "Close live chat" : "Talk to Solar Expert on WhatsApp"}
        >
          {isOpen ? (
            /* Close icon when open */
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Close Chat</span>
            </>
          ) : (
            /* WhatsApp icon when closed */
            <>
              <div className="relative">
                <svg className="w-6 h-6 fill-current group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.007 14.07 1.01 11.47 1.01c-5.436 0-9.862 4.372-9.866 9.802-.001 1.962.535 3.882 1.554 5.584L2.127 22.05l5.882-1.528c1.6.87 3.39 1.33 5.24 1.332z" />
                </svg>

                {/* Unread badge dot */}
                {hasNewBadge && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <span>Talk To Solar Expert</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
