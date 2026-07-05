'use client'
import { Zap, PiggyBank, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function PMSuryaGharSection() {
  return (
    <section className="py-8 bg-gradient-to-r from-green-950 via-gray-900 to-green-950 text-white border-y border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Headline & Badges */}
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 items-center">
              <span className="inline-flex items-center gap-1 bg-green-500/15 border border-green-500/30 text-green-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                <ShieldCheck size={12} /> Govt. Subsidy Scheme
              </span>
              <span className="bg-white/10 text-gray-300 font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wide">
                Valid till 31st March 2027
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
              PM-Surya Ghar: Muft Bijli Yojana
            </h3>
            
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              Solarise your home and get up to <strong className="text-green-400">300 units free monthly electricity</strong> with direct bank cashback subsidies up to <strong className="text-green-400">₹78,000</strong>.
            </p>
          </div>

          {/* Quick Subsidy Matrix Row */}
          <div className="flex flex-wrap justify-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 max-w-lg w-full">
            <div className="flex-1 min-w-[90px] text-center border-r border-white/10 last:border-r-0 pr-3 last:pr-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase">1 kW System</div>
              <div className="text-sm font-black text-green-400 mt-1">₹30,000</div>
              <div className="text-[8px] text-gray-500">Subsidy Credit</div>
            </div>
            <div className="flex-1 min-w-[90px] text-center border-r border-white/10 last:border-r-0 pr-3 last:pr-0">
              <div className="text-[10px] font-bold text-gray-400 uppercase">2 kW System</div>
              <div className="text-sm font-black text-green-400 mt-1">₹60,000</div>
              <div className="text-[8px] text-gray-500">Subsidy Credit</div>
            </div>
            <div className="flex-1 min-w-[90px] text-center">
              <div className="text-[10px] font-bold text-gray-400 uppercase">3 kW+ System</div>
              <div className="text-sm font-black text-green-400 mt-1">₹78,000</div>
              <div className="text-[8px] text-gray-500">Max Subsidy</div>
            </div>
          </div>

          {/* Call to action */}
          <div className="shrink-0 text-center">
            <Link
              href="/quote"
              className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all hover:scale-105"
            >
              Apply For Subsidy <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
