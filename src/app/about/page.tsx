import WhyChooseUs from '../../components/WhyChooseUs'
import FAQSection from '../../components/FAQSection'

export const metadata = {
  title: 'About Us - Sun Degreen Solar',
  description: 'Learn about our mission, team and certifications.'
}

export default function AboutPage(){
  return (
    <main className="pt-24 md:pt-28 pb-0 bg-gradient-to-b from-white to-blue-50/30 min-h-screen">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block badge badge-green mb-4">About Us</div>
          <h1 className="text-gray-900 mb-6">About Sun Degreen Solar</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Sun Degreen Solar is one of India&apos;s leading solar energy system integrators. We offer comprehensive, end-to-end solar solutions, including engineering, procurement, construction, and AMC services for residential, commercial, and industrial clients.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our goal is to assist you in reducing carbon footprints and cutting down electricity expenditures by up to 90%. We achieve this using superior-quality tier-1 solar modules and certified structural engineers.
          </p>
        </div>
      </div>
      <WhyChooseUs />
      <FAQSection />
    </main>
  )
}
