'use client'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  category: string
  image: string
  savings: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Mumbai Residential Complex',
    category: 'Residential',
    image: '/residential_solar.png',
    savings: '₹45,000/year savings',
  },
  {
    id: '2',
    title: 'Delhi Corporate Office',
    category: 'Commercial',
    image: '/commercial_solar.png',
    savings: '₹2,50,000/year savings',
  },
  {
    id: '3',
    title: 'Bangalore Tech Campus',
    category: 'Industrial',
    image: '/industrial_solar.png',
    savings: '₹8,50,000/year savings',
  },
  {
    id: '5',
    title: 'Chennai Manufacturing Unit',
    category: 'Industrial',
    image: '/industrial_solar.png',
    savings: '₹6,00,000/year savings',
  },
  {
    id: '6',
    title: 'Pune Hospital Complex',
    category: 'Commercial',
    image: '/commercial_solar.png',
    savings: '₹3,00,000/year savings',
  },
]

export default function Projects({ isSubpage = false }: { isSubpage?: boolean }){
  return (
    <section className={isSubpage ? "pt-24 pb-12 md:pt-28 md:pb-20 bg-white" : "py-12 md:py-20 bg-white"}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block badge badge-blue mb-4">Featured Projects</div>
          <h2 className="text-gray-900 mb-4">Our Recent Projects</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See how we&apos;ve helped businesses and homes save money with solar energy.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group relative h-64 md:h-80 rounded-xl overflow-hidden cursor-pointer bg-gray-100 border border-gray-200 hover:border-green-600 transition-all duration-300">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Dark Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                <span className="text-xs font-600 bg-green-500 w-fit px-3 py-1 rounded-full mb-3 shadow-sm">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold mb-1 text-white leading-snug">{project.title}</h3>
                <p className="text-green-300 text-sm font-600">{project.savings}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <button className="btn-base btn-outline">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  )
}
