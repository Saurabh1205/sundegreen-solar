'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Testimonial } from '../types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function TestimonialsClient({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-green-50 to-white">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block badge badge-green mb-4">Testimonials</div>
          <h2 className="text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied customers who&apos;ve switched to solar energy.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.id} variants={cardVariants}>
              <div className="card-base h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 flex-grow italic">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 relative">
                      <Image src={t.image} alt={t.name} width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-600">{t.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats below */}
        <motion.div
          className="mt-16 pt-16 border-t border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-3 gap-8 text-center max-w-2xl mx-auto">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-green-600 mb-2">12,000+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-green-600 mb-2">4.8/5</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-green-600 mb-2">98%</p>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
