'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const reasons = [
  {
    icon: '✓',
    title: 'Certified Engineers',
    description: 'Our team consists of certified solar engineers with years of industry experience.'
  },
  {
    icon: '⚡',
    title: 'Fast Installation',
    description: 'Quick and hassle-free installation process with minimal disruption to your daily life.'
  },
  {
    icon: '🔋',
    title: 'High Efficiency Panels',
    description: 'Premium quality solar panels with up to 22% efficiency for maximum energy generation.'
  },
  {
    icon: '🛡️',
    title: '25 Year Warranty',
    description: 'Industry-leading warranty coverage for panels and performance guarantee.'
  },
]

export default function WhyChooseUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-blue-50">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block badge badge-blue mb-4">Why Choose Us</div>
          <h2 className="text-gray-900 mb-4">Why Sun Degreen Solar?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We deliver quality, reliability, and customer satisfaction in every project.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reasons.map((reason, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <div className="flex gap-4 p-6 rounded-xl hover:bg-green-50 transition-all duration-300">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl text-green-600 font-bold">
                    {reason.icon}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-6">
            Ready to switch to clean, affordable solar energy?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#consultation" className="btn-base btn-primary">
              Get Your Free Consultation
            </Link>
            <Link href="/contact" className="btn-base btn-outline">
              Request Site Survey
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
