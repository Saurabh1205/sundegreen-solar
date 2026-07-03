import Image from 'next/image'
import Link from 'next/link'

export default function CalculatorContact(){
  return (
    <section className="py-12">
      <div className="container grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-1 bg-gradient-to-b from-white to-slate-50 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-3">Solar Saving Calculator</h3>
          <label className="block text-sm text-gray-600">Your monthly bill</label>
          <input className="w-full border px-3 py-2 rounded mt-2 mb-3" placeholder="e.g. 4500" />
          <div className="text-sm text-gray-700 mb-4">Recommended system: <strong>5 kW</strong></div>
          <Link href="/calculator" className="inline-block bg-orange-500 text-white px-4 py-2 rounded">Calculate Now</Link>
        </div>

        <div className="md:col-span-1 md:col-start-2 md:col-end-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded overflow-hidden shadow">
              <Image src="/hero-solar.svg" alt="panel" width={640} height={360} className="object-cover"/>
            </div>
            <div className="bg-white rounded p-6 shadow">
              <h3 className="text-xl font-bold mb-2">Get Your Free Quote</h3>
              <input className="w-full border px-3 py-2 rounded mb-2" placeholder="Name" />
              <input className="w-full border px-3 py-2 rounded mb-2" placeholder="Phone" />
              <input className="w-full border px-3 py-2 rounded mb-2" placeholder="Email" />
              <textarea className="w-full border px-3 py-2 rounded mb-3" placeholder="Message" />
              <button className="bg-primary text-white px-4 py-2 rounded">Request Quote</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
