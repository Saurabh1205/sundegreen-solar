"use client"
import { useState } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !phone || !message) {
      setError('Please fill in all fields.')
      return
    }

    setSending(true)
    setError('')

    // Simulate sending message
    setTimeout(() => {
      setSending(false)
      setSuccess(true)
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setTimeout(() => setSuccess(false), 5000)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-600 text-gray-700 mb-2">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-600 text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-600 text-gray-700 mb-2">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          className="w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-600 text-gray-700 mb-2">Your Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your solar requirements..."
          className="w-full"
          rows={4}
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
          ✓ Message sent successfully! We will get back to you shortly.
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={sending}
          className="btn-base btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Sending Message...' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
