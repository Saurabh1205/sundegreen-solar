import { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ')
  return { title: `${title.replace(/\b\w/g, c => c.toUpperCase())} - Sun Degreen Solar` }
}

export default async function Post({ params }: Props){
  const { slug } = await params
  return (
    <article className="pt-24 md:pt-28 pb-16 md:pb-24 container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{slug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase())}</h1>
      <p className="mt-4 text-gray-600">Sample blog content coming soon.</p>
    </article>
  )
}
