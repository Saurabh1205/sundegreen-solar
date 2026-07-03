'use client'
import { useState } from 'react'
import Link from 'next/link'

interface ParameterRow {
  parameter: string
  icon: string
  residential: string
  commercial: string
  industrial: string
}

const comparisonData: ParameterRow[] = [
  {
    parameter: 'Typical System Capacity',
    icon: '⚡',
    residential: '2 kW to 15 kW',
    commercial: '10 kW to 100 kW',
    industrial: '100 kW to 1 MW+',
  },
  {
    parameter: 'Required Roof Area',
    icon: '📐',
    residential: '80 - 100 sq. ft. per kW',
    commercial: '70 - 90 sq. ft. per kW',
    industrial: '65 - 80 sq. ft. per kW',
  },
  {
    parameter: 'System Configuration',
    icon: '⚙️',
    residential: 'On-Grid or Hybrid (Battery)',
    commercial: 'On-Grid (with Net Metering)',
    industrial: 'On-Grid / HT synchronization',
  },
  {
    parameter: 'Govt. Subsidies (India)',
    icon: '🎁',
    residential: 'Available (Up to ₹78,000)',
    commercial: 'No (AD tax benefits instead)',
    industrial: 'No (Depreciation & incentives)',
  },
  {
    parameter: 'Avg. Payback Period',
    icon: '⏱️',
    residential: '3 to 4 Years',
    commercial: '3.5 to 4 Years',
    industrial: '4 to 5 Years',
  },
  {
    parameter: 'Estimated Annual ROI',
    icon: '📈',
    residential: '25% - 30%',
    commercial: '22% - 28%',
    industrial: '20% - 25%',
  },
  {
    parameter: 'Warranty Coverage',
    icon: '🛡️',
    residential: '25 Yr Panel, 10 Yr Inverter',
    commercial: '25 Yr Panel, 5-10 Yr Inverter',
    industrial: '25 Yr Panel, 5 Yr Inverter',
  }
]

export default function ServiceComparison() {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'industrial'>('residential')

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-gray-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block badge badge-green mb-4">Comparison Matrix</div>
          <h2 className="text-gray-900 mb-4 font-bold">Choose Your Solar Profile</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Compare key parameters side-by-side to find the perfect solar solution for your space and energy goals.
          </p>
        </div>

        {/* Desktop Comparison Table (SaaS Style) */}
        <div className="hidden md:block rounded-2xl border border-gray-200/80 bg-white shadow-xl max-w-5xl mx-auto relative overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left table-fixed min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-900">
                  <th className="p-6 font-bold text-sm uppercase tracking-wider text-gray-500 w-1/4 align-bottom">Parameter</th>
                  
                  {/* Residential Header */}
                  <th className="p-6 bg-green-50/20 border-x border-gray-100 w-1/4 text-center align-bottom relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-green-600" />
                    <div className="mb-2">
                      <span className="bg-green-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm inline-block">
                        Most Popular
                      </span>
                    </div>
                    <div className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
                      <span>🏠</span> Residential
                    </div>
                    <p className="text-xs text-green-700/80 font-500 mt-1">For Homes & Societies</p>
                  </th>
                  
                  {/* Commercial Header */}
                  <th className="p-6 border-r border-gray-100 w-1/4 text-center align-bottom relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600" />
                    <div className="mb-2 h-[22px] invisible" />
                    <div className="text-lg font-bold text-blue-800 flex items-center justify-center gap-2">
                      <span>🏢</span> Commercial
                    </div>
                    <p className="text-xs text-blue-700/80 font-500 mt-1">For Offices & Institutions</p>
                  </th>
                  
                  {/* Industrial Header */}
                  <th className="p-6 w-1/4 text-center align-bottom relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-800" />
                    <div className="mb-2 h-[22px] invisible" />
                    <div className="text-lg font-bold text-emerald-900 flex items-center justify-center gap-2">
                      <span>🏭</span> Industrial
                    </div>
                    <p className="text-xs text-emerald-700/80 font-500 mt-1">For Sheds & Factories</p>
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition duration-150">
                    {/* Parameter Column */}
                    <td className="p-6 font-600 text-gray-900 flex items-center gap-2.5">
                      <span className="text-lg bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200/50">{row.icon}</span>
                      <span>{row.parameter}</span>
                    </td>
                    
                    {/* Residential Column */}
                    <td className="p-6 bg-green-50/10 border-x border-gray-100 font-500 text-gray-800">
                      {row.parameter === 'Govt. Subsidies (India)' ? (
                        <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-100/60 px-2.5 py-1 rounded-md text-xs font-bold border border-green-200">
                          {row.residential}
                        </span>
                      ) : (
                        row.residential
                      )}
                    </td>
                    
                    {/* Commercial Column */}
                    <td className="p-6">{row.commercial}</td>
                    
                    {/* Industrial Column */}
                    <td className="p-6">{row.industrial}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden space-y-6">
          {/* Tabs Nav */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            {(['residential', 'commercial', 'industrial'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab === 'residential' ? '🏠 Home' : tab === 'commercial' ? '🏢 Office' : '🏭 Factory'}
              </button>
            ))}
          </div>

          {/* Active Tab Panel */}
          <div className="card-base bg-white shadow-xl p-6 relative overflow-hidden border border-gray-200/80">
            {activeTab === 'residential' && (
              <span className="absolute top-4 right-4 bg-green-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                Most Popular
              </span>
            )}
            
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-2.5 ${
              activeTab === 'residential' ? 'text-green-700' : activeTab === 'commercial' ? 'text-blue-700' : 'text-emerald-800'
            }`}>
              <span>
                {activeTab === 'residential' ? '🏠' : activeTab === 'commercial' ? '🏢' : '🏭'}
              </span>
              <span className="capitalize">{activeTab} Solar Profile</span>
            </h3>

            <div className="space-y-4">
              {comparisonData.map((row, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 text-xs py-3.5 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-2 text-gray-500 font-500">
                    <span className="text-base bg-slate-100 w-6 h-6 rounded-md flex items-center justify-center border border-slate-200/30">{row.icon}</span>
                    <span>{row.parameter}</span>
                  </div>
                  <div className="text-gray-900 font-700 text-right max-w-[50%] mt-0.5 leading-snug">
                    {activeTab === 'residential' && row.parameter === 'Govt. Subsidies (India)' ? (
                      <span className="inline-block text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 font-bold">
                        {row.residential}
                      </span>
                    ) : (
                      activeTab === 'residential' ? row.residential : activeTab === 'commercial' ? row.commercial : row.industrial
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href="/quote"
            className="btn-base btn-primary px-8 py-3.5 text-sm sm:text-base tracking-wide"
          >
            Get Custom Quote
          </Link>
        </div>
      </div>
    </section>
  )
}
