import Head from 'next/head'
import { localBusinessSchema } from '../lib/schema'

export default function Seo({title,description}:{title?:string;description?:string}){
  const t = title ?? 'Sun Degreen Solar'
  const d = description ?? 'Premium solar panel installation in India.'
  return (
    <Head>
      <title>{t}</title>
      <meta name="description" content={d} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessSchema)}} />
    </Head>
  )
}
