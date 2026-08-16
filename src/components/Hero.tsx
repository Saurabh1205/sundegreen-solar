"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function Hero(){
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [pincode, setPincode] = useState('')
  const [bill, setBill] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    if (!name || !whatsapp || !pincode || !bill) {
      setError('Please fill all fields')
      return
    }
    setSending(true)
    setError('')
    try{
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, whatsapp, pincode, bill })
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSuccess(true)

      const cleanPhone = whatsapp.replace(/\D/g, '')
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
      const text = `☀️ Welcome ${name} to Sundegreen Solar! ☀️\n\nThank you for reaching out. Your rooftop solar enquiry has been received:\n• Customer Name: ${name}\n• PIN Code: ${pincode}\n• Monthly Bill: ₹${bill}\n\n🌐 Official Website: https://www.sundegreensolar.in\n📞 Customer Care: +91 75077 71361`
      
      const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`
      setTimeout(() => {
        try {
          window.open(waUrl, '_blank')
        } catch (e) {
          // ignore
        }
      }, 600)

      setName('')
      setWhatsapp('')
      setPincode('')
      setBill('')
      setTimeout(() => setSuccess(false), 6000)
    }catch(err: unknown){
      const errMsg = err instanceof Error ? err.message : 'Submission failed'
      setError(errMsg)
    }finally{
      setSending(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <section id="consultation" className="py-10 md:py-20 bg-gradient-to-b from-white via-blue-50 to-white flex items-center">
      <div className="container w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start md:items-center">
          {/* LEFT SIDE */}
          <motion.div
            className="space-y-6 md:space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Section heading for the form */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Book Your Free Solar Consultation</h2>
              <p className="text-sm sm:text-base text-gray-600">Get a personalised quote in 2 minutes. Zero obligation.</p>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">★★★★★</span>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">4.8</div>
                  <div className="text-xs text-gray-600">Google Ratings</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">500+</div>
                  <div className="text-xs text-gray-600">Installations</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🔋</span>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">10+ MW</div>
                  <div className="text-xs text-gray-600">Installed</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">25 Year</div>
                  <div className="text-xs text-gray-600">Warranty</div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/quote" className="btn-base btn-primary text-center">
                Get Free Quote
              </Link>
              <Link href="/calculator" className="btn-base btn-secondary text-center">
                Calculate Savings
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Consultation Card */}
          <motion.div
            className="relative"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Background decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-20 -right-40 w-60 h-60 bg-blue-100 rounded-full blur-3xl opacity-20"></div>

            {/* Consultation Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-5 sm:p-8 border border-gray-100">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Book Free Consultation
                  </h3>
                  <p className="text-gray-600">
                    Get expert advice on your solar solution in just 2 minutes.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      placeholder="6-digit PIN code"
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Monthly Bill */}
                  <div>
                    <label className="block text-sm font-600 text-gray-700 mb-2">
                      Monthly Electricity Bill <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bill}
                      onChange={e => setBill(e.target.value)}
                      className="w-full"
                      required
                    >
                      <option value="">Select your bill range</option>
                      <option value="Less than ₹1500">Less than ₹1500</option>
                      <option value="₹1500 - ₹2500">₹1500 - ₹2500</option>
                      <option value="₹2500 - ₹4000">₹2500 - ₹4000</option>
                      <option value="₹4000 - ₹8000">₹4000 - ₹8000</option>
                      <option value="More than ₹8000">More than ₹8000</option>
                    </select>
                  </div>

                  {/* Status Messages */}
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                      ✓ Thanks! We&apos;ll contact you shortly.
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-base btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Book Free Consultation'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. No spam, just solar solutions.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
