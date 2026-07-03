import Link from 'next/link'

export default function CTA(){
  return (
    <section className="py-12 bg-gradient-to-r from-yellow-50 to-white">
      <div className="container flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Start Saving With Solar Today</h3>
          <p className="text-sm">Get a free bespoke quote and system analysis.</p>
        </div>
        <div>
          <Link href="/quote" className="bg-secondary text-white px-5 py-3 rounded-lg">Get Free Quote</Link>
        </div>
      </div>
    </section>
  )
}
