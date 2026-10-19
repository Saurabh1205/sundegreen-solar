import Projects from '../../components/Projects'

export const metadata = {
  title: 'Completed Solar Rooftop Projects in Maharashtra | Sun Degreen Solar',
  description:
    'Explore our portfolio of successful residential, commercial, and industrial rooftop solar installations across Nagpur and Maharashtra. Real customer savings and case studies.'
}

export default function ProjectsPage(){
  return (
    <main>
      <Projects isSubpage={true} />
    </main>
  )
}
