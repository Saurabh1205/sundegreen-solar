import { getTestimonials } from '../lib/firestore'
import TestimonialsClient from './TestimonialsClient'

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials()
  return <TestimonialsClient testimonials={testimonials} />
}
