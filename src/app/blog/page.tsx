import Link from 'next/link'
import type { Route } from 'next'
import { getBlogPosts } from '../../lib/firestore'

export const revalidate = 60 // revalidate every 60 seconds

export const metadata = {
  title: 'Blog - Sun Degreen Solar',
  description: 'Insights and guides on solar energy and incentives in India.'
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main className="pt-24 md:pt-28 pb-12">
      <div className="container">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">Insights and guides on solar energy in India.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => (
            <article key={p.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
              {p.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImageUrl} alt={p.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
              )}
              <div className="p-6">
                {p.publishedAt && (
                  <p className="text-xs text-gray-400 mb-2">{new Date(p.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                )}
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">
                  <Link href={`/blog/${p.slug}` as Route}>{p.title}</Link>
                </h3>
                <p className="text-sm text-gray-600">{p.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
