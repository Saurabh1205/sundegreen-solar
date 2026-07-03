"use client"
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const isHome = pathname === '/'
  const shouldShowSolid = !isHome || isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${shouldShowSolid
      ? 'bg-white shadow-md'
      : 'bg-transparent shadow-none'
      }`}>
      <div className="container flex items-center justify-between py-4 md:py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div className={`transition-all duration-300 ${shouldShowSolid
            ? 'bg-white rounded-xl px-2 py-1 shadow-sm'
            : ''
            }`}>
            <Image
              src="/sundegreen_logo.png"
              alt="Sun Degreen Solar - Clean Energy. Greener Future."
              width={200}
              height={64}
              style={{ minWidth: 120, maxWidth: 200, height: 'auto', maxHeight: 56 }}
              className={`object-contain transition-all duration-300 ${shouldShowSolid ? '' : 'mix-blend-screen'
                }`}
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className={`px-4 py-2 text-sm font-500 transition-colors duration-300 ${shouldShowSolid ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>Home</Link>
          <Link href="/services" className={`px-4 py-2 text-sm font-500 transition-colors duration-300 ${shouldShowSolid ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>Services</Link>
          <Link href="/calculator" className={`px-4 py-2 text-sm font-500 transition-colors duration-300 ${shouldShowSolid ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>Calculator</Link>
          <Link href="/projects" className={`px-4 py-2 text-sm font-500 transition-colors duration-300 ${shouldShowSolid ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>Projects</Link>
          <Link href="/about" className={`px-4 py-2 text-sm font-500 transition-colors duration-300 ${shouldShowSolid ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>About</Link>
          <Link href="/contact" className={`px-4 py-2 text-sm font-500 transition-colors duration-300 ${shouldShowSolid ? 'text-gray-700 hover:text-green-600' : 'text-white/90 hover:text-white'}`}>Contact</Link>
        </nav>

        {/* CTA Button & Mobile Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <Link href="/#consultation" className="btn-base btn-primary text-sm px-6 py-2.5">
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl transition-all duration-300 active:scale-95 text-gray-700 hover:bg-gray-100"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-up">
          <div className="container py-4 flex flex-col gap-1">
            <Link href="/" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/services" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition" onClick={() => setOpen(false)}>Services</Link>
            <Link href="/calculator" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition" onClick={() => setOpen(false)}>Calculator</Link>
            <Link href="/projects" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition" onClick={() => setOpen(false)}>Projects</Link>
            <Link href="/about" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/#consultation" className="btn-base btn-primary mt-2 text-center text-sm w-full" onClick={() => setOpen(false)}>Book Consultation</Link>
          </div>
        </div>
      )}
    </header>
  )
}
