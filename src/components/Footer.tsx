import Link from 'next/link'
import Image from 'next/image'
import { getSiteConfig } from '../lib/firestore'
import ScrollToTopButton from './ScrollToTopButton'

export default async function Footer() {
  const currentYear = new Date().getFullYear()
  const config = await getSiteConfig()
  const phone = config.phone ?? '+91 98765 43210'
  const email = config.email ?? 'info@sundegreen.com'
  const address = config.address ?? 'Mumbai, India'
  const tagline = config.footerTagline ?? 'Empowering India with clean, sustainable solar energy solutions for homes, businesses, and industries.'

  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Main Footer */}
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="mb-5 inline-block bg-white rounded-xl px-3 py-2">
                <Image
                  src="/sundegreen_logo.png"
                  alt="Sun Degreen Solar - Clean Energy. Greener Future."
                  width={180}
                  height={56}
                  className="object-contain"
                  style={{ maxHeight: 56 }}
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{tagline}</p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition text-sm font-600" title="Facebook">f</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition text-sm font-600" title="Twitter">𝕏</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition text-sm font-600" title="LinkedIn">in</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition text-sm" title="Instagram">📷</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-green-400 transition">Home</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-green-400 transition">Services</Link></li>
                <li><Link href="/projects" className="text-gray-400 hover:text-green-400 transition">Projects</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-green-400 transition">About Us</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-green-400 transition">Blog</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Residential Solar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Commercial Solar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Industrial Solar</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">Solar Panels</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition">AMC Services</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">📞</span>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-600">{phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">📧</span>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-600 break-all">{email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">📍</span>
                  <div>
                    <p className="text-gray-400 text-sm">Address</p>
                    <p className="text-white font-600">{address}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Sun Degreen Solar. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-green-400 transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </footer>
  )
}
