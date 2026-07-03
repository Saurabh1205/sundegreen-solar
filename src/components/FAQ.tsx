export default function FAQ(){
  const faqs = [
    {q:'How long does installation take?', a:'Small rooftops typically 1-3 days; larger projects vary.'},
    {q:'Do you provide warranties?', a:'Yes, 25-year performance and product warranties.'}
  ]
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-2xl font-bold mb-4">FAQs</h2>
        <div className="space-y-4">
          {faqs.map((f,i)=> (
            <details key={i} className="p-4 border rounded">
              <summary className="font-semibold">{f.q}</summary>
              <p className="mt-2 text-sm">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
