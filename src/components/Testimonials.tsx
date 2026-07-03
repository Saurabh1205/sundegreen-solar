const items = [
  { id:1, name:'Rohit Sharma', text:'Excellent installation and support. Our electricity bills dropped significantly.' },
  { id:2, name:'Meera Patel', text:'Professional team and timely delivery. Highly recommend Sun Degreen.' },
  { id:3, name:'Anil Kapoor', text:'Great post-installation service and warranty support.' }
]

export default function Testimonials(){
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(i=> (
            <div key={i.id} className="p-6 border rounded-lg">
              <p className="italic">“{i.text}”</p>
              <p className="mt-4 font-semibold">{i.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
