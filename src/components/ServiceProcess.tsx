'use client'
import { motion } from 'framer-motion'

interface ProcessStep {
  number: string
  title: string
  description: string
  icon: string
  detail: string
}

const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Free Consultation',
    description: 'Custom energy bill analysis & projected savings estimation.',
    icon: '📞',
    detail: 'We evaluate your historical power usage, shade constraints, and target budget to deliver a clean feasibility report.'
  },
  {
    number: '02',
    title: 'Site Survey',
    description: 'Detailed drone layout mapping & roof structure analysis.',
    icon: '📐',
    detail: 'Our engineers audit your site using 3D shadow mapping to design a structures blueprint maximizing solar irradiance.'
  },
  {
    number: '03',
    title: 'Engineering (EPC)',
    description: 'Custom electrical schematic layout design & approval liaison.',
    icon: '💻',
    detail: 'We compile structural calculations and submit application plans to the local electricity board (DISCOM) for net-metering approvals.'
  },
  {
    number: '04',
    title: 'Installation',
    description: 'Precision mounting & wiring by certified engineering staff.',
    icon: '⚡',
    detail: 'Deploying tier-1 solar modules, safety components, dual-surge protection boxes, and high-efficiency standard string inverters.'
  },
  {
    number: '05',
    title: 'Net Metering',
    description: 'DISCOM grid synchronization & double-way meter commissioning.',
    icon: '🔄',
    detail: 'We coordinate the final physical inspection by DISCOM authorities to set up your net meter, feeding surplus solar power back to the grid.'
  },
  {
    number: '06',
    title: 'Lifetime AMC Support',
    description: 'Active digital generation tracking & cleaning services.',
    icon: '🛡️',
    detail: 'Gain access to mobile remote monitoring apps, active support channels, quarterly physical audits, and chemical module washes.'
  }
]

export default function ServiceProcess() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <section className="py-12 md:py-20 bg-white border-t border-gray-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block badge badge-green mb-4">Our Methodology</div>
          <h2 className="text-gray-900 mb-4">Seamless Project Execution Flow</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            From initial site auditing to securing government approvals and lifetime maintenance, we take care of everything.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {processSteps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={stepVariants}
              className="card-base relative group p-8 flex flex-col hover:border-green-500 transition duration-300"
            >
              {/* Number Badge */}
              <span className="absolute top-6 right-8 text-4xl font-extrabold text-gray-100 group-hover:text-green-500/10 transition-colors select-none">
                {step.number}
              </span>
              
              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl bg-green-50 p-3 rounded-xl text-green-600 font-bold border border-green-100/50">
                  {step.icon}
                </span>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition">
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-700 font-600 text-sm mb-3">
                {step.description}
              </p>
              
              <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                {step.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
