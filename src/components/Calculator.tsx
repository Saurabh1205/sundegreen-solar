"use client"
import { useState } from 'react'

export default function Calculator(){
  const [bill,setBill]=useState(5000)
  const monthlyBill = bill
  const recommendedKW = Math.max(1, Math.round(monthlyBill / 1000))
  const yearlySavings = recommendedKW * 12000
  const carbonReduction = Math.round(recommendedKW * 800)
  const roiYears = 3.5

  return (
    <section className="py-12">
      <div className="container grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Savings Calculator</h3>
          <label className="block text-sm mb-2">Monthly Electricity Bill (INR)</label>
          <input type="range" min={500} max={50000} value={bill} onChange={(e)=>setBill(Number(e.target.value))} />
          <div className="mt-4">
            <p>Recommended System Size: <strong>{recommendedKW} kW</strong></p>
            <p>Estimated Yearly Savings: <strong>₹{yearlySavings.toLocaleString()}</strong></p>
            <p>Carbon Emission Reduction: <strong>{carbonReduction} kg CO2/year</strong></p>
            <p>Estimated ROI: <strong>{roiYears} years</strong></p>
          </div>
        </div>
        <div>
          <div className="p-6 border rounded-lg">Design and finance options will be provided after site survey.</div>
        </div>
      </div>
    </section>
  )
}
