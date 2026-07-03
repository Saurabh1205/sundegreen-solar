'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CalculatorSection({ isSubpage = false }: { isSubpage?: boolean }) {
  const [monthlyBill, setMonthlyBill] = useState(3000)
  const [results, setResults] = useState({
    systemSize: 0,
    installationCost: 0,
    subsidy: 0,
    annualSavings: 0,
    twentyFiveSavings: 0,
    paybackPeriod: 0,
  })

  useEffect(() => {
    // Simple calculation logic
    const systemSize = monthlyBill / 150 // Rough estimate: 150 per kW per month
    const costPerKW = 80000 // ₹80,000 per kW
    const installationCost = systemSize * costPerKW
    const subsidy = installationCost * 0.4 // 40% subsidy
    const netCost = installationCost - subsidy
    const annualSavings = monthlyBill * 12 * 0.9 // 90% savings
    const paybackPeriod = netCost / annualSavings

    setResults({
      systemSize: Math.round(systemSize * 10) / 10,
      installationCost: Math.round(installationCost),
      subsidy: Math.round(subsidy),
      annualSavings: Math.round(annualSavings),
      twentyFiveSavings: Math.round(annualSavings * 25),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    })
  }, [monthlyBill])

  return (
    <section className={isSubpage ? "pt-24 pb-12 md:pt-28 md:pb-20 bg-gradient-to-b from-white via-green-50/50 to-white" : "py-12 md:py-20 bg-gradient-to-b from-white via-green-50 to-white"}>
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block badge badge-green mb-4">Calculate Your Savings</div>
          <h2 className="text-gray-900 mb-4">Solar Savings Calculator</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find out exactly how much you can save with solar energy.
          </p>
        </motion.div>

        {/* Calculator */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="glass p-5 md:p-8 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Enter Your Details</h3>

              {/* Bill Range */}
              <div className="mb-8">
                <label className="block text-sm font-600 text-gray-700 mb-4">
                  Monthly Electricity Bill
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">₹{monthlyBill.toLocaleString()}</span>
                    <span className="text-sm text-gray-600">per month</span>
                  </div>
                </div>
              </div>

              {/* Quick Selection */}
              <div className="space-y-2">
                <p className="text-xs font-600 text-gray-600 uppercase tracking-wide">Quick Select</p>
                <div className="grid grid-cols-2 gap-2">
                  {[1500, 3000, 5000, 8000].map((value) => (
                    <button
                      key={value}
                      onClick={() => setMonthlyBill(value)}
                      className={`py-2 px-3 rounded-lg text-sm font-600 transition-all ${monthlyBill === value
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      ₹{value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <ResultCard
                label="Recommended System Size"
                value={`${results.systemSize} kW`}
                icon="🔋"
              />
              <ResultCard
                label="Estimated Installation Cost"
                value={`₹${results.installationCost.toLocaleString()}`}
                icon="💰"
              />
              <ResultCard
                label="Government Subsidy"
                value={`₹${results.subsidy.toLocaleString()}`}
                icon="🎁"
                highlight="success"
              />
              <ResultCard
                label="Annual Savings"
                value={`₹${results.annualSavings.toLocaleString()}`}
                icon="📈"
                highlight="success"
              />
              <ResultCard
                label="25-Year Total Savings"
                value={`₹${results.twentyFiveSavings.toLocaleString()}`}
                icon="🏆"
                highlight="primary"
              />
              <ResultCard
                label="Payback Period"
                value={`${results.paybackPeriod} years`}
                icon="⏱️"
              />
            </div>
          </div>

          {/* CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 mb-6">
              Ready to start saving? Get a personalized quote from our experts.
            </p>
            <Link href="/quote" className="btn-base btn-primary">
              Get Free Quote Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function ResultCard({
  label,
  value,
  icon,
  highlight = '',
}: {
  label: string
  value: string
  icon: string
  highlight?: string
}) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${highlight === 'success'
        ? 'bg-green-50 border-green-200'
        : highlight === 'primary'
          ? 'bg-blue-50 border-blue-200'
          : 'bg-white border-gray-200'
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-xl md:text-2xl font-bold ${highlight === 'success' ? 'text-green-600' : highlight === 'primary' ? 'text-blue-600' : 'text-gray-900'
            }`}>
            {value}
          </p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}
