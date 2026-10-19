import CalculatorSection from '../../components/CalculatorSection'

export const metadata = {
  title: 'Solar Rooftop Calculator & PM Surya Ghar Subsidy Estimator India',
  description:
    'Calculate your rooftop solar capacity, monthly electricity bill savings, payback period, and PM Surya Ghar subsidy (up to ₹78,000) instantly with Sun Degreen Solar.'
}

export default function CalculatorPage(){
  return (
    <main>
      <CalculatorSection isSubpage={true} />
    </main>
  )
}
