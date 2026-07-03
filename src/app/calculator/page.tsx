import CalculatorSection from '../../components/CalculatorSection'

export const metadata = {
  title: 'Solar Savings Calculator - Sun Degreen Solar',
  description: 'Estimate system size, savings and ROI for rooftop solar.'
}

export default function CalculatorPage(){
  return (
    <main>
      <CalculatorSection isSubpage={true} />
    </main>
  )
}
