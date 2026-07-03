import Services from '../../components/Services'
import ServiceComparison from '../../components/ServiceComparison'
import ServiceProcess from '../../components/ServiceProcess'

export const metadata = {
  title: 'Services - Sun Degreen Solar',
  description: 'Residential, commercial and industrial solar services.'
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
