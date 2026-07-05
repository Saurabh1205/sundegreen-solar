import TopBanner from '../components/TopBanner'
import Hero from '../components/Hero'
import StatisticsSection from '../components/StatisticsSection'
import Services from '../components/Services'
import WhyChooseUs from '../components/WhyChooseUs'
import PMSuryaGharSection from '../components/PMSuryaGharSection'
import CalculatorSection from '../components/CalculatorSection'
import Projects from '../components/Projects'
import TestimonialsSection from '../components/TestimonialsSection'
import FAQSection from '../components/FAQSection'

export default function Home() {
  return (
    <>
      {/* Pull banner up so it starts behind the fixed navbar */}
      <div className="-mt-20">
        <TopBanner />
      </div>
      <Hero />
      <PMSuryaGharSection />
      <StatisticsSection />
      <Services />
      <WhyChooseUs />
      <CalculatorSection />
      <Projects />
      <TestimonialsSection />
      <FAQSection />
    </>
  )
}
