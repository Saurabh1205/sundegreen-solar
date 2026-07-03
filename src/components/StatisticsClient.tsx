"use client"
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import type { StatCard } from '../types'

function AnimatedCounter({ from = 0, to, duration = 2 }: { from?: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref)

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = (currentTime - startTime) / (duration * 1000)
      if (progress < 1) {
        setCount(Math.floor(from + (to - from) * progress))
        requestAnimationFrame(animate)
      } else {
        setCount(to)
      }
    }
    requestAnimationFrame(animate)
  }, [isInView, from, to, duration])

  return <span ref={ref}>{count}</span>
}

export default function StatisticsClient({ stats }: { stats: StatCard[] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="section-bg-light py-12 md:py-20">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block badge badge-green mb-4">Impact &amp; Achievement</div>
          <h2 className="text-gray-900 mb-4">Proven Track Record</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Years of experience delivering premium solar solutions to thousands of satisfied customers.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="text-center">
              <div className="card-base !p-4 md:!p-8">
                <div className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4">{stat.icon}</div>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-600">
                    <AnimatedCounter to={stat.value} />
                  </span>
                  {stat.suffix && <span className="text-xl md:text-2xl font-bold text-green-600">{stat.suffix}</span>}
                </div>
                <p className="text-gray-600 font-500 text-sm md:text-base">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
