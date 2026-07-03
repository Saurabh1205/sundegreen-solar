import Projects from '../../components/Projects'

export const metadata = {
  title: 'Projects - Sun Degreen Solar',
  description: 'Explore our residential, commercial and industrial solar projects.'
}

export default function ProjectsPage(){
  return (
    <main>
      <Projects isSubpage={true} />
    </main>
  )
}
