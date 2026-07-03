"use client"
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function QuotePage() {
  // Lead Info States
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [pincode, setPincode] = useState('')
  const [bill, setBill] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [leadId, setLeadId] = useState<string | number | null>(null)

  // Calculated Results Stored locally to render
  const [calculatedQuote, setCalculatedQuote] = useState({
    suggestedKw: 3,
    brand: 'Waaree Mono Perc',
    quotePrice: 132000,
    monthlySavings: 2500,
    leadPriority: 'Low Priority'
  })

  // EMI Calculator States
  const [emiDuration, setEmiDuration] = useState<number>(48)

  // Inspection Booking States
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [address, setAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [inspectSending, setInspectSending] = useState(false)
  const [inspectSuccess, setInspectSuccess] = useState(false)
  const [inspectError, setInspectError] = useState('')

  // Callback States
  const [callbackRequested, setCallbackRequested] = useState(false)

  // References for scrolling
  const emiRef = useRef<HTMLDivElement>(null)
  const inspectRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name || !whatsapp || !pincode || !bill || !serviceType) {
      setError('Please fill in all required fields.')
      return
    }
    setSending(true)
    setError('')

    // Calculations based on Bill range
    let suggestedKw = 3
    let brand = 'Waaree Mono Perc'
    let baseCost = 210000
    let subsidy = 78000
    let monthlySavings = 2500
    let leadPriority = 'Low Priority'

    if (bill === 'Less than ₹1,500') {
      suggestedKw = 2
      brand = 'Adani Solar'
      baseCost = 144000
      subsidy = 60000
      monthlySavings = 1400
      leadPriority = 'Low Priority'
    } else if (bill === '₹1,500 - ₹2,500') {
      suggestedKw = 3
      brand = 'Waaree Mono Perc'
      baseCost = 210000
      subsidy = 78000
      monthlySavings = 2500
      leadPriority = 'Low Priority'
    } else if (bill === '₹2,500 - ₹4,000') {
      suggestedKw = 4
      brand = 'Waaree Mono Perc'
      baseCost = 280000
      subsidy = 78000
      monthlySavings = 4000
      leadPriority = 'High Priority'
    } else if (bill === '₹4,000 - ₹8,000') {
      suggestedKw = 6
      brand = 'Tata Power Solar'
      baseCost = 450000
      subsidy = 78000
      monthlySavings = 7200
      leadPriority = 'High Priority'
    } else if (bill === 'More than ₹8,000') {
      suggestedKw = 10
      brand = 'Tata Power Solar'
      baseCost = 750000
      subsidy = 78000
      monthlySavings = 12000
      leadPriority = 'Very High Priority'
    }

    const quotePrice = baseCost - subsidy

    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          pincode,
          bill,
          serviceType,
          message,
          suggestedKw,
          brand,
          quotePrice,
          source: 'Quote Page'
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit.')
      
      setLeadId(data.id)
      setCalculatedQuote({
        suggestedKw,
        brand,
        quotePrice,
        monthlySavings,
        leadPriority
      })

      // Store in session storage for the Floating WhatsApp button to read
      sessionStorage.setItem('solar_quote', JSON.stringify({
        name,
        whatsapp,
        pincode,
        bill,
        suggestedKw,
        quotePrice
      }))
      // Dispatch custom event to notify FloatingWhatsApp component
      window.dispatchEvent(new Event('quote_generated'))

      setSuccess(true)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Submission failed'
      setError(errMsg)
    } finally {
      setSending(false)
    }
  }

  // Handle Roof Inspection Submit
  async function handleBookInspection(e: React.FormEvent) {
    e.preventDefault()
    if (!leadId) {
      setInspectError('Invalid session. Please submit the quote form first.')
      return
    }
    if (!preferredDate || !preferredTime || !address) {
      setInspectError('Please fill in all inspection details.')
      return
    }

    setInspectSending(true)
    setInspectError('')

    try {
      const res = await fetch('/api/consultation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          inspectionDetails: {
            preferredDate,
            preferredTime,
            address,
            landmark
          }
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to book inspection.')
      setInspectSuccess(true)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Inspection booking failed'
      setInspectError(errMsg)
    } finally {
      setInspectSending(false)
    }
  }

  // EMI calculation helper using Flat rate of 9.75%
  const calculateEmi = (price: number, durationMonths: number) => {
    const annualFlatRate = 0.0975
    const years = durationMonths / 12
    const totalInterest = price * annualFlatRate * years
    const emi = (price + totalInterest) / durationMonths
    return Math.round(emi)
  }

  const activeEmi = calculateEmi(calculatedQuote.quotePrice, emiDuration)
  const netOutflow = activeEmi - calculatedQuote.monthlySavings

  // Scroll Helpers
  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // WhatsApp template link generator
  const getWhatsAppShareLink = () => {
    const text = `Hi, I just generated a Solar quote on your site:
- System Size: ${calculatedQuote.suggestedKw} kW
- Panel Brand: ${calculatedQuote.brand}
- Quote Price: ₹${calculatedQuote.quotePrice.toLocaleString()}
- Monthly Bill: ${bill}
- Lead Scoring Priority: ${calculatedQuote.leadPriority}

I'd like to proceed with booking a site survey.`
    return `https://wa.me/919876543210?text=${encodeURIComponent(text)}`
  }

  // PDF Print Trigger
  const handlePrint = () => {
    window.print()
  }

  // Register Callback
  const handleCallbackRequest = () => {
    setCallbackRequested(true)
    setTimeout(() => setCallbackRequested(false), 8000)
  }

  return (
    <main className="pt-24 md:pt-28 pb-16 md:pb-24 bg-gradient-to-b from-white via-blue-50/20 to-white min-h-screen">
      {/* Dynamic CSS styles for clean printing layout */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <div className="mb-6 no-print">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-600 text-green-600 hover:text-green-700 transition">
              ← Back to Home
            </Link>
          </div>

          {!success ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* LEFT COLUMN: Info */}
              <div className="lg:col-span-5 space-y-6 md:space-y-8">
                <div>
                  <div className="inline-block badge badge-green mb-4">Request a Quote</div>
                  <h1 className="text-gray-900 mb-4 font-extrabold leading-tight">
                    Get Your Custom Solar Quote
                  </h1>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    Provide your energy details below, and our solar specialists will prepare a customized system design and detailed savings projection for your property.
                  </p>
                </div>

                {/* What is included */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">What You Get:</h3>
                  <ul className="space-y-3.5">
                    <li className="flex items-start gap-3">
                      <span className="text-xl bg-green-50 text-green-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-100">📋</span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Tailored Solar Design</h4>
                        <p className="text-xs text-gray-600">Optimal system size calculated specifically for your roof area and energy usage.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl bg-blue-50 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">💸</span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">Cost & Subsidy Breakdown</h4>
                        <p className="text-xs text-gray-600">Clear pricing including applicable government subsidies (e.g., PM-Surya Ghar).</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-xl bg-emerald-50 text-emerald-700 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border border-emerald-100">📊</span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">25-Year ROI Statement</h4>
                        <p className="text-xs text-gray-600">A projection of your monthly utility savings and payback period timeline.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div>
                    <div className="text-xl font-bold text-gray-900">4.8★</div>
                    <div className="text-xs text-gray-600">Google Ratings</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-600">Installations Done</div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Quote Form */}
              <div className="lg:col-span-7">
                <div className="card-base bg-white shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-100 rounded-3xl relative overflow-hidden">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">Quote Request Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-600 text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-600 text-gray-700 mb-2">
                          WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-600 text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="yourname@example.com"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-600 text-gray-700 mb-2">
                          PIN Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="6-digit PIN code"
                          className="w-full"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-600 text-gray-700 mb-2">
                          Monthly Electricity Bill <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={bill}
                          onChange={(e) => setBill(e.target.value)}
                          className="w-full bg-white"
                          required
                        >
                          <option value="">Select bill range</option>
                          <option value="Less than ₹1,500">Less than ₹1,500</option>
                          <option value="₹1,500 - ₹2,500">₹1,500 - ₹2,500</option>
                          <option value="₹2,500 - ₹4,000">₹2,500 - ₹4,000</option>
                          <option value="₹4,000 - ₹8,000">₹4,000 - ₹8,000</option>
                          <option value="More than ₹8,000">More than ₹8,000</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-600 text-gray-700 mb-2">
                        Property Type / Service Interest <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full bg-white"
                        required
                      >
                        <option value="">Select option</option>
                        <option value="Residential Solar">Residential (Home/Society) Solar</option>
                        <option value="Commercial Solar">Commercial (Office/Institutional) Solar</option>
                        <option value="Industrial Solar">Industrial (Factory/Shed) Solar</option>
                        <option value="Solar Water Pump">Solar Water Pump (Agriculture)</option>
                        <option value="Battery Backup">Off-Grid Battery Backup Storage</option>
                        <option value="AMC Services">Annual Maintenance Contract (AMC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-600 text-gray-700 mb-2">
                        Additional Requirements or Comments
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Roof area, panel brands..."
                        className="w-full"
                        rows={3}
                      />
                    </div>

                    {error && (
                      <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-base btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3.5 text-base rounded-xl font-bold"
                    >
                      {sending ? 'Sending Request...' : 'Get My Free Quote'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* DYNAMIC RESULTS SCREEN (EMI & INSPECTION MODULES) */
            <div id="print-area" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT REPORT COLUMN */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Quote details report */}
                <div className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-5 flex-wrap gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Your Solar Quote Analysis</h2>
                      <p className="text-xs text-gray-500">Prepared for: {name}</p>
                    </div>
                    {/* Priority Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      calculatedQuote.leadPriority === 'Very High Priority' 
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : calculatedQuote.leadPriority === 'High Priority'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-green-50 text-green-600 border border-green-200'
                    }`}>
                      {calculatedQuote.leadPriority} Lead
                    </span>
                  </div>

                  {/* Primary Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <span className="text-xs text-gray-500 block mb-1">Suggested System</span>
                      <strong className="text-2xl font-extrabold text-gray-900">{calculatedQuote.suggestedKw} kW</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <span className="text-xs text-gray-500 block mb-1">Recommended Brand</span>
                      <strong className="text-sm font-extrabold text-gray-900 block mt-1">{calculatedQuote.brand}</strong>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <span className="text-xs text-gray-500 block mb-1">Final Price</span>
                      <strong className="text-2xl font-extrabold text-green-600">₹{calculatedQuote.quotePrice.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Pricing offset details */}
                  <div className="space-y-3.5 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Monthly Electric Bill</span>
                      <span className="font-600 text-gray-900">{bill}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Monthly Savings</span>
                      <span className="font-600 text-emerald-600">~ ₹{calculatedQuote.monthlySavings.toLocaleString()}/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Selected</span>
                      <span className="font-600 text-gray-900">{serviceType}</span>
                    </div>
                  </div>
                </div>

                {/* MODULE 5: EMI CALCULATOR */}
                <div ref={emiRef} className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl pointer-events-none"></div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span>🪙</span> Solar EMI Calculator
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">Finance your solar switch with easy monthly installations and zero upfront stress.</p>

                  <div className="space-y-6">
                    {/* Price read-only display */}
                    <div className="bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Final Price (Principal)</span>
                      <strong className="text-base text-gray-900">₹{calculatedQuote.quotePrice.toLocaleString()}</strong>
                    </div>

                    {/* EMI Duration */}
                    <div>
                      <label className="block text-sm font-600 text-gray-700 mb-3">
                        Choose Loan Tenancy (Months)
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[12, 24, 36, 48, 60].map((dur) => (
                          <button
                            key={dur}
                            onClick={() => setEmiDuration(dur)}
                            className={`py-2 text-xs md:text-sm rounded-xl font-bold transition-all border ${
                              emiDuration === dur
                                ? 'bg-green-600 border-green-600 text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {dur} Mo
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calculations Display */}
                    <div className="bg-green-50/50 border border-green-100 p-5 rounded-2xl space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="border-r border-green-100/50">
                          <span className="text-xs text-gray-500 block mb-1">Monthly EMI</span>
                          <strong className="text-xl font-black text-gray-900">₹{activeEmi.toLocaleString()}/mo</strong>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Estimated Savings</span>
                          <strong className="text-xl font-black text-green-700">₹{calculatedQuote.monthlySavings.toLocaleString()}/mo</strong>
                        </div>
                      </div>

                      {/* Net Monthly Impact */}
                      <div className="border-t border-green-200/50 pt-3 flex items-center justify-between">
                        <span className="text-sm font-500 text-gray-600">Net Monthly Outflow</span>
                        <strong className={`text-base font-bold ${netOutflow > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                          {netOutflow > 0 ? `₹${netOutflow.toLocaleString()}/month` : `₹0/month (Net Profit: ₹${Math.abs(netOutflow).toLocaleString()})`}
                        </strong>
                      </div>

                      {/* Savings Message */}
                      <div className="bg-white p-3 rounded-xl border border-green-100 text-xs text-center font-600 text-green-700">
                        ✨ Your electricity savings can offset most of your EMI.
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODULE 6: FREE ROOF INSPECTION */}
                <div ref={inspectRef} className="bg-white rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span>🏠</span> Book Free Roof Inspection
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">Schedule a physical review of your roof space to assess shading factors and structural load capacity.</p>

                  {inspectSuccess ? (
                    <motion.div
                      className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="text-3xl">✓</div>
                      <h4 className="font-bold text-sm">Roof Inspection Requested Successfully!</h4>
                      <p className="text-xs text-green-700">
                        Your appointment is booked for **{preferredDate}** during the **{preferredTime}** slot at {address}.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleBookInspection} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-600 text-gray-700 mb-2">Preferred Date</label>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-600 text-gray-700 mb-2">Preferred Time Slot</label>
                          <select
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full text-sm bg-white"
                            required
                          >
                            <option value="">Select Time Slot</option>
                            <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                            <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                            <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-600 text-gray-700 mb-2">Address</label>
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Complete installation site address..."
                          className="w-full text-sm"
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-600 text-gray-700 mb-2">Landmark (Optional)</label>
                        <input
                          type="text"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near metro station, behind bank..."
                          className="w-full text-sm"
                        />
                      </div>

                      {inspectError && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
                          {inspectError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={inspectSending}
                        className="btn-base btn-primary w-full disabled:opacity-50 py-3 rounded-xl text-sm"
                      >
                        {inspectSending ? 'Booking Inspection...' : 'Book Free Roof Inspection'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* RIGHT ACTIONS / BUTTONS TOOLBAR */}
              <div className="lg:col-span-5 space-y-6 no-print">
                <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-xl space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-3">Solar Toolbox Actions</h3>
                  
                  {/* Action checklist list */}

                  {/* 1. Get Quote On WhatsApp */}
                  <a
                    href={getWhatsAppShareLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white w-full py-3 rounded-xl text-sm font-bold shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>💬</span> Get Quote On WhatsApp
                  </a>

                  {/* 2. Download PDF */}
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-gray-800 w-full py-3 rounded-xl text-sm font-bold border border-gray-200 transition"
                  >
                    <span>📥</span> Download PDF Report
                  </button>

                  {/* 3. Schedule Roof Inspection */}
                  <button
                    onClick={() => scrollTo(inspectRef)}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-gray-800 w-full py-3 rounded-xl text-sm font-bold border border-gray-200 transition"
                  >
                    <span>📅</span> Schedule Roof Inspection
                  </button>

                  {/* 4. Calculate EMI */}
                  <button
                    onClick={() => scrollTo(emiRef)}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-gray-800 w-full py-3 rounded-xl text-sm font-bold border border-gray-200 transition"
                  >
                    <span>🪙</span> Calculate Loan EMI
                  </button>

                  {/* 5. Book Free Site Survey */}
                  <button
                    onClick={() => scrollTo(inspectRef)}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-xl text-sm font-bold shadow-md transition transform hover:-translate-y-0.5"
                  >
                    <span>🔍</span> Book Free Site Survey
                  </button>

                  {/* 6. Call Me Within 30 Minutes */}
                  <button
                    onClick={handleCallbackRequest}
                    disabled={callbackRequested}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition shadow-sm ${
                      callbackRequested 
                        ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-0.5'
                    }`}
                  >
                    {callbackRequested ? '✓ Callback Registered!' : '📞 Call Me Within 30 Minutes'}
                  </button>

                  {callbackRequested && (
                    <motion.div
                      className="text-xs text-center text-green-700 font-500 mt-2 bg-green-50 p-2 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Expert callback scheduled for WhatsApp number {whatsapp}.
                    </motion.div>
                  )}
                </div>

                {/* Small Helpful tip */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-xs text-blue-700 leading-relaxed">
                  💡 **Smart Financing Tip**: Solar installations generate high generation offset margins. Most homeowners in PIN **{pincode}** completely pay off their solar systems using monthly energy savings alone in under 4 years.
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  )
}
