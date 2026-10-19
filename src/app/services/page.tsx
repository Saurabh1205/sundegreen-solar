import Services from '../../components/Services'
import ServiceComparison from '../../components/ServiceComparison'
import ServiceProcess from '../../components/ServiceProcess'

export const metadata = {
  title: 'Rooftop Solar Installation Services in Maharashtra',
  description:
    'Expert residential, commercial & industrial rooftop solar panel installation, solar water pumps, and AMC maintenance across Maharashtra. Save up to 90% on electricity bills with PM Surya Ghar subsidy.'
}

export default function ServicesPage(){
  return (
    <main>
      <Services isSubpage={true} />
      <ServiceComparison />
      <ServiceProcess />
    </main>
  )
}
