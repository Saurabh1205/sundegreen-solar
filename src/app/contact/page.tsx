import ContactForm from '../../components/ContactForm'

export const metadata = {
  title: 'Contact Us - Sun Degreen Solar',
  description: 'Get in touch for a free solar consultation and quote.'
}

export default function ContactPage(){
  return (
    <main className="pt-24 md:pt-28 pb-16 md:pb-24 bg-gradient-to-b from-white to-blue-50/30 min-h-screen">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-block badge badge-green mb-4">Get In Touch</div>
              <h1 className="text-gray-900 mb-6">Contact Us</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Have questions about solar panel installations, pricing, or government subsidies? Feel free to reach out. Our team is ready to assist you.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-2xl text-green-600 mt-1">📞</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600 font-500">+91 98765 43210</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl text-green-600 mt-1">📧</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 font-500">info@sundegreen.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-2xl text-green-600 mt-1">📍</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Office Address</h3>
                    <p className="text-gray-600 font-500">Mumbai, Maharashtra, India</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-12 p-6 bg-green-50 rounded-2xl border border-green-100">
                <h3 className="text-lg font-bold text-green-800 mb-2">Business Hours</h3>
                <p className="text-green-700 text-sm">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                <p className="text-green-700 text-sm">Sunday: Closed</p>
              </div>
            </div>
            
            <div className="card-base shadow-xl bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
