'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function TopBanner() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('consultation')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative w-full min-h-[520px] h-[60vh] md:h-[70vh] lg:h-[88vh] overflow-hidden bg-sky-50">
      {/* Banner Image */}
      <a href="#consultation" onClick={handleClick} className="block w-full h-full group relative">
        <Image
          src="/banner.png"
          alt="Sun Degreen Solar Banner - Your Journey to Clean Energy Starts Here"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </a>

      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="container px-5 sm:px-6">
          <motion.div
            className="max-w-2xl w-full md:pt-20 lg:pt-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 backdrop-blur-sm text-green-300 text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span>☀️</span>
              India&apos;s Trusted Solar Partner
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-white font-bold leading-tight mb-3 sm:mb-5 drop-shadow-lg text-[1.6rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Power Your Future With{' '}
              <span className="text-green-400">Clean Solar Energy</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-white/90 text-sm sm:text-base md:text-xl leading-relaxed drop-shadow-md max-w-xl"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Reduce electricity bills by up to 90% with high-efficiency solar systems for homes, businesses and industries.
            </motion.p>

            {/* CTA Hint */}
            <motion.div
              className="flex mt-5 sm:mt-8 items-center gap-2 text-white/80 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <span className="animate-bounce inline-block">👇</span>
              <span>Click to book your free consultation</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
