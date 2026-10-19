"use client"
import { useEffect, useState, useRef } from 'react'

interface ChatMessage {
  id: string
  sender: 'agent' | 'user'
  text: string
  time: string
  showWhatsAppButton?: boolean
  whatsAppText?: string
}

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [hasNewBadge, setHasNewBadge] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const whatsappNumber = "917507771361" // Sun Degreen Solar primary office number

  // Quick prompt suggestions for solar customers
  const quickChips = [
    { label: "☀️ Get Solar Quote", query: "Can you provide a solar rooftop installation quote?" },
    { label: "💰 PM Surya Ghar Subsidy", query: "How much government subsidy do I get under PM Surya Ghar?" },
    { label: "🏡 Free Site Survey", query: "I would like to book a free rooftop site inspection." },
    { label: "🪙 Solar EMI & Loans", query: "What are the zero-cost EMI and solar loan options?" }
  ]

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  // Construct target WhatsApp URL based on device
  const getWhatsAppUrl = (textToSend: string, mode: 'auto' | 'web' | 'app' = 'auto') => {
    const encoded = encodeURIComponent(textToSend)
    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (mode === 'web') {
      return `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encoded}`
    }
    if (mode === 'app') {
      return `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encoded}`
    }
    // Auto: If on desktop, redirecting directly to web.whatsapp.com prevents the intermediate "Download App" page!
    if (!isMobile) {
      return `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encoded}`
    }
    return `https://wa.me/${whatsappNumber}?text=${encoded}`
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800)

    // Check session storage for quotes
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
          setMessage("Hi, I want to talk to a solar expert about installing solar panels.")
        }
      } else {
        setMessage("Hi, I want to talk to a solar expert about installing solar panels.")
      }
    }

    checkQuote()
    window.addEventListener('quote_generated', checkQuote)

    // Initial agent welcome message
    setChatHistory([
      {
        id: 'welcome-1',
        sender: 'agent',
        text: "👋 Hello! Welcome to Sun Degreen Solar.\n\nHow can we help you power your home or business with clean solar energy today? Ask us about rooftop sizing, PM Surya Ghar subsidy (up to ₹78,000), or request a free site inspection!",
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

  // Scroll to bottom when chat updates
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory, isTyping, isOpen])

  // Intelligent local assistant response engine
  const getBotResponse = (userQuery: string): { reply: string; showWhatsApp: boolean } => {
    const q = userQuery.toLowerCase()

    if (q.includes('subsidy') || q.includes('surya ghar') || q.includes('pm')) {
      return {
        reply: "💰 Under the PM Surya Ghar Muft Bijli Yojana, residential subsidies are credited directly to your bank account:\n\n• 1 kW System: ₹30,000 Subsidy\n• 2 kW System: ₹60,000 Subsidy\n• 3 kW to 10 kW: ₹78,000 (Max Subsidy)\n\nWe handle 100% of the online DISCOM & subsidy paperwork for you!",
        showWhatsApp: true
      }
    }

    if (q.includes('quote') || q.includes('price') || q.includes('cost') || q.includes('rate')) {
      return {
        reply: "☀️ Our residential systems start at approx. ₹65,000–₹70,000 per kW (before subsidy) with top-tier Tier-1 Monocrystalline panels (Tata Power, Waaree, Adani) and high-efficiency inverters.\n\nMost homeowners recover their entire investment in under 3.5 years!",
        showWhatsApp: true
      }
    }

    if (q.includes('emi') || q.includes('loan') || q.includes('finance')) {
      return {
        reply: "🪙 We offer easy 0% down-payment and low-interest solar financing through leading banks (SBI, HDFC, Canara).\n\nEMI starts as low as ~₹1,850/month. In most cases, your electricity bill savings exceed the monthly EMI payment!",
        showWhatsApp: true
      }
    }

    if (q.includes('survey') || q.includes('visit') || q.includes('inspection') || q.includes('book')) {
      return {
        reply: "🏡 We offer 100% Free On-Site Rooftop Inspections! Our solar engineers assess your roof shadow, structure, and electrical load to design the optimal setup.\n\nSend us a quick WhatsApp message with your city/location to lock your appointment slot!",
        showWhatsApp: true
      }
    }

    // Default response
    return {
      reply: "Thank you for reaching out! Our dedicated solar engineers are online and ready to review your requirements, customize your savings estimate, and answer any questions.",
      showWhatsApp: true
    }
  }

  const handleSendMessage = (textToSend?: string) => {
    const finalMsg = (textToSend || message).trim()
    if (!finalMsg) return

    const time = getCurrentTime()
    const userMsgId = 'user-' + Date.now()

    // 1. Post user message to chat history
    setChatHistory(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: finalMsg, time }
    ])

    setMessage('')
    setIsTyping(true)

    // 2. Automated Smart Response in widget (Instant feedback without abrupt redirect!)
    setTimeout(() => {
      setIsTyping(false)
      const bot = getBotResponse(finalMsg)

      setChatHistory(prev => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          text: bot.reply,
          time: getCurrentTime(),
          showWhatsAppButton: bot.showWhatsApp,
          whatsAppText: finalMsg
        }
      ])
    }, 700)
  }

  const handleChipClick = (chipQuery: string) => {
    // Fill the input or send directly as a question inside the chat
    handleSendMessage(chipQuery)
  }

  const openWhatsAppDirect = (textToSend: string, mode: 'auto' | 'web' | 'app' = 'auto') => {
    const url = getWhatsAppUrl(textToSend, mode)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans select-none">
      {/* WhatsApp Live Chat Modal Window (Matching Reference Image) */}
      {isOpen ? (
        <div 
          className="w-[94vw] max-w-[370px] sm:w-[380px] h-[530px] max-h-[85vh] bg-[#efeae2] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-900/10 animate-in fade-in zoom-in-95 duration-200 transition-all"
          style={{
            backgroundImage: "url('/whatsapp-doodle.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "280px"
          }}
        >
          {/* Header (WhatsApp Deep Green #075E54) */}
          <div className="bg-[#075E54] text-white px-4 py-3.5 flex items-center justify-between shadow-md z-10 flex-shrink-0">
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
                <p className="text-xs text-emerald-100/90 leading-tight">Sun Degreen Solar • Typically replies in 15m</p>
              </div>
            </div>

            {/* Close Button at top-right corner of header (matching reference image) */}
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
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 scroll-smooth">
            {/* Timestamp Notice */}
            <div className="flex justify-center">
              <span className="bg-white/80 backdrop-blur-sm text-gray-500 text-[11px] font-medium px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                Official Helpline • +91 75077 71361
              </span>
            </div>

            {/* Conversation Flow */}
            {chatHistory.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`relative max-w-[88%] rounded-2xl p-3 shadow-sm text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}
                >
                  {/* Sender label for Agent */}
                  {msg.sender === 'agent' && idx === 0 && (
                    <div className="text-[11px] font-bold text-[#075E54] mb-1 flex items-center gap-1">
                      <span>☀️ Solar Support Specialist</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line text-[13px]">{msg.text}</p>

                  {/* Connect to WhatsApp Action Card (Optional Hand-off) */}
                  {msg.showWhatsAppButton && msg.whatsAppText && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col gap-1.5">
                      <p className="text-[11px] font-semibold text-gray-600">Continue with our engineer directly:</p>
                      
                      {/* One-Click Direct WhatsApp Button */}
                      <button
                        onClick={() => openWhatsAppDirect(msg.whatsAppText || '')}
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md transition-transform active:scale-95"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.007 14.07 1.01 11.47 1.01c-5.436 0-9.862 4.372-9.866 9.802-.001 1.962.535 3.882 1.554 5.584L2.127 22.05l5.882-1.528c1.6.87 3.39 1.33 5.24 1.332z" />
                        </svg>
                        <span>Chat on WhatsApp (+91 75077 71361)</span>
                      </button>

                      {/* Explicit Desktop Options (Avoids Download screen) */}
                      <div className="flex items-center justify-between px-1 text-[10px] text-gray-500">
                        <button 
                          onClick={() => openWhatsAppDirect(msg.whatsAppText || '', 'web')}
                          className="hover:underline hover:text-emerald-700 font-medium"
                        >
                          🌐 Open Web
                        </button>
                        <span>•</span>
                        <button 
                          onClick={() => openWhatsAppDirect(msg.whatsAppText || '', 'app')}
                          className="hover:underline hover:text-emerald-700 font-medium"
                        >
                          📱 Open Mobile/Desktop App
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      <span className="text-[#34B7F1] font-bold">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-sm w-fit border border-gray-100">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            {/* Quick Suggestion Chips (Interactive in-chat queries) */}
            {chatHistory.length <= 4 && (
              <div className="pt-2">
                <p className="text-[11px] text-gray-600 font-semibold mb-2 px-1">Common Questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip.query)}
                      className="bg-white/95 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 text-xs font-medium py-1.5 px-3 rounded-full border border-gray-200/80 shadow-sm transition-all hover:scale-[1.02] active:scale-95 text-left"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Bottom WhatsApp Input Bar (Matching Reference Image) */}
          <div className="bg-[#f0f2f5] p-2.5 sm:p-3 border-t border-gray-200 flex items-center gap-2 flex-shrink-0">
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

            {/* Send Button (Official WhatsApp Send Icon, Optically Centered) */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!message.trim()}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all transform active:scale-90 flex-shrink-0 ${
                message.trim()
                  ? 'bg-[#00a884] hover:bg-[#008f6f] text-white hover:scale-105'
                  : 'bg-[#00a884]/60 text-white/80 cursor-not-allowed'
              }`}
              title="Send Message"
              aria-label="Send message"
            >
              {/* Authentic WhatsApp horizontal send arrow, optically centered */}
              <svg className="w-[19px] h-[19px] fill-current translate-x-[1.5px]" viewBox="0 0 24 24">
                <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Floating Trigger Button (Visible only when chat is minimized) */
        <div className="flex flex-col items-end gap-2">
          {/* Status tooltip banner */}
          <div className="bg-white text-gray-900 border border-gray-150 px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-600 flex items-center gap-2 animate-fade-in pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Response within 15 mins</span>
          </div>

          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group font-600 text-sm md:text-base border border-emerald-400/20"
            aria-label="Talk to Solar Expert on WhatsApp"
          >
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
          </button>
        </div>
      )}
    </div>
  )
}
