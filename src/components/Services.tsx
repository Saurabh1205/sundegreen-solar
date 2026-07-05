'use client'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Service {
  id: string
  image: string
  title: string
  description: string
  icon: string
  capacity: string
  space: string
  warranty: string
  subsidy: string
  benefits: string[]
  components: string[]
}

const services: Service[] = [
  {
    id: '1',
    image: '/residential_solar.png',
    title: 'Residential Solar',
    description: 'Custom solar solutions for homes to reduce electricity bills and increase energy independence with premium panels.',
    icon: '🏠',
    capacity: '2kW to 15kW',
    space: '80 - 100 sq. ft. per kW',
    warranty: '25 Years on Panels, 10 Years on Inverter',
    subsidy: 'Available (Up to 40% Govt. Subsidy)',
    benefits: [
      'Reduce monthly electricity bills by up to 90%',
      'Eligible for PM-Surya Ghar subsidy up to ₹78,000',
      'Increase property valuation and energy independence',
      'Low maintenance with standard net-metering support'
    ],
    components: [
      'Tier-1 Mono Perc Half-Cut Panels (Tata/Waaree/Adani)',
      'High-efficiency On-Grid Inverter (Growatt/Solis)',
      'Hot-dip galvanized mounting structures',
      'ACDB/DCDB protection boxes with dual surge protection'
    ]
  },
  {
    id: '2',
    image: '/commercial_solar.png',
    title: 'Commercial Solar',
    description: 'Scalable solar systems for businesses to lower operational costs and demonstrate sustainability commitment.',
    icon: '🏢',
    capacity: '10kW to 100kW',
    space: '70 - 90 sq. ft. per kW',
    warranty: '25 Years on Panels, 5-10 Years on Inverter',
    subsidy: 'Not direct (Accelerated Depreciation benefit available)',
    benefits: [
      'Lower corporate income tax with 40% Accelerated Depreciation',
      'Offset heavy peak-hour commercial tariffs',
      'Boost corporate social responsibility (CSR) ratings',
      'Quick ROI within 3.5 to 4 years'
    ],
    components: [
      'Bifacial / High-efficiency Mono Perc Panels',
      'Industrial String Inverters with active cooling (Sungrow/Huawei)',
      'Tailored elevated structural designs for flat roofs/carports',
      'Smart Remote Monitoring platform (active logging & diagnostics)'
    ]
  },
  {
    id: '3',
    image: '/industrial_solar.png',
    title: 'Industrial Solar',
    description: 'Heavy-duty solar installations for factories and industries with maximum efficiency and reliability.',
    icon: '🏭',
    capacity: '100kW to 1MW+',
    space: '65 - 80 sq. ft. per kW',
    warranty: '25 Years on Panels, 5 Years on Industrial Inverter',
    subsidy: 'Tax incentives & open-access compatibility',
    benefits: [
      'Hedge against future industrial power tariff hikes',
      'Substantial reduction in carbon footprint audits',
      'Utilize large factory shed roofs to generate cheap power',
      'Highly stable and low-maintenance capital investment'
    ],
    components: [
      'Tier-1 Ultra-high power Mono Perc modules (550Wp+)',
      'Central or Multi-string utility inverters',
      'Custom sheet-metal roof mounting structures with leak-proof seals',
      'SCADA based remote monitoring and grid synchronization panels'
    ]
  },
  /*
  {
    id: '4',
    image: '/solar_water_pump.png',
    title: 'Solar Water Pumps',
    description: 'Eco-friendly water pumping solutions powered by solar energy for agricultural and industrial use.',
    icon: '🚜',
    capacity: '3 HP to 10 HP',
    space: 'Requires dedicated ground space (approx 100-300 sq. ft.)',
    warranty: '25 Years on Panels, 5 Years on Pump Controller',
    subsidy: 'Available under PM-KUSUM Scheme',
    benefits: [
      'Uninterrupted day-time irrigation without depending on grid power',
      'Zero monthly running fuel cost compared to diesel engines',
      'Durable and weather-resistant agricultural pump controller',
      'Promotes micro-irrigation and highly optimized farm yields'
    ],
    components: [
      'Polycrystalline or Mono Solar Panels',
      'Submersible / Surface DC Solar Pump (CRI/Shakti/Luby)',
      'Solar Pump Controller with MPPT tracking',
      'Manual tracking ground mount structures'
    ]
  },
  {
    id: '5',
    image: '/battery_backup.png',
    title: 'Battery Backup',
    description: 'Advanced battery storage systems to ensure uninterrupted power supply during outages.',
    icon: '🔋',
    capacity: '5kWh to 50kWh',
    space: 'Wall-mounted or compact floor rack (indoor)',
    warranty: '5 to 10 Years on Lithium-ion Batteries',
    subsidy: 'No direct subsidies for storage at present',
    benefits: [
      'Seamless backup power during grid failures (zero transit lag)',
      'Store excess daytime solar generation for evening/night use',
      'Avoid expensive diesel generator usage and diesel purchasing',
      'Long lifespan (up to 6000 cycles with Lithium Ferro Phosphate)'
    ],
    components: [
      'LiFePO4 (LFP) Battery Packs (BYD/Pylontech/Custom)',
      'Hybrid Inverter with dual grid/solar input capabilities',
      'Battery Management System (BMS) with thermal protection',
      'Automatic transfer switch (ATS) sub-panels'
    ]
  },
  */
  {
    id: '6',
    image: '/amc_maintenance.png',
    title: 'AMC Services',
    description: 'Comprehensive maintenance and support services to keep your solar system performing optimally.',
    icon: '🛠️',
    capacity: 'Applicable to any size system',
    space: 'N/A (Virtual & on-site services)',
    warranty: '1 Year service contract renewal',
    subsidy: 'N/A',
    benefits: [
      'Regular cleaning and electrical parameter testing (quarterly)',
      'Thermal imaging of panels to detect micro-cracks and hot-spots',
      'Proactive alerting for inverter faults via remote monitoring checks',
      'Guaranteed quick response time during faults or grid issues'
    ],
    components: [
      'On-site cleaning kits & specialized soft-bristle solar brushes',
      'Thermal imaging camera scanning',
      'Multi-meter and clamp-meter diagnostic reviews',
      'Yearly generation health report'
    ]
  }
]

export default function Services({ isSubpage = false }: { isSubpage?: boolean }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <section className={isSubpage ? "pt-24 pb-12 md:pt-28 md:pb-20 bg-white" : "py-12 md:py-20 bg-white"}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block badge badge-green mb-4">Our Services</div>
          <h2 className="text-gray-900 mb-4">Complete Solar Solutions</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From residential to industrial, we offer comprehensive solar energy solutions tailored to your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="card-base group h-full flex flex-col p-6 cursor-pointer"
            >
              {/* Image */}
              <div className="w-full h-52 rounded-xl overflow-hidden mb-6 bg-sky-50 border border-gray-100 relative">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={400}
                  height={208}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 right-3 text-2xl bg-white/95 backdrop-blur shadow-md px-2.5 py-1.5 rounded-lg border border-gray-100">
                  {service.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition">
                {service.title}
              </h3>
              <p className="text-green-600 text-xs font-semibold mb-3">Capacity: {service.capacity}</p>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed flex-grow text-sm sm:text-base">
                {service.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-6 flex items-center gap-2 text-green-600 font-600 text-sm">
                <span>Learn more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="relative h-48 bg-sky-50 flex-shrink-0">
                <Image
                  src={selectedService.image}
                  alt={selectedService.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 rounded-full flex items-center justify-center transition border border-white/20"
                  aria-label="Close modal"
                >
                  ✕
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl bg-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-green-400/30">
                    {selectedService.icon}
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">{selectedService.title}</h2>
                    <p className="text-green-300 text-xs sm:text-sm font-semibold">{selectedService.capacity} capacity</p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-700 text-gray-400 uppercase tracking-wider mb-2">Overview</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{selectedService.description}</p>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">Required Space</span>
                    <strong className="text-gray-900">{selectedService.space}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Subsidy Scheme</span>
                    <strong className="text-gray-900">{selectedService.subsidy}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-xs">Standard Warranty</span>
                    <strong className="text-gray-900">{selectedService.warranty}</strong>
                  </div>
                </div>

                {/* Key Benefits */}
                <div>
                  <h3 className="text-sm font-700 text-gray-400 uppercase tracking-wider mb-3">Key Benefits</h3>
                  <ul className="space-y-2.5">
                    {selectedService.benefits.map((benefit, i) => (
                      <li key={i} className="flex gap-2.5 items-start text-sm sm:text-base text-gray-700">
                        <span className="text-green-600 font-bold mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Primary Components */}
                <div>
                  <h3 className="text-sm font-700 text-gray-400 uppercase tracking-wider mb-3">Standard Components</h3>
                  <ul className="space-y-2.5">
                    {selectedService.components.map((component, i) => (
                      <li key={i} className="flex gap-2.5 items-start text-sm sm:text-base text-gray-700">
                        <span className="text-green-500 mt-0.5">⚙️</span>
                        <span>{component}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 flex-shrink-0">
                <button
                  onClick={() => setSelectedService(null)}
                  className="btn-base bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex-1 py-3 text-sm font-600 rounded-xl"
                >
                  Close
                </button>
                <Link
                  href="/quote"
                  onClick={() => setSelectedService(null)}
                  className="btn-base btn-primary flex-1 py-3 text-sm font-600 rounded-xl text-center"
                >
                  Get Quote
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
