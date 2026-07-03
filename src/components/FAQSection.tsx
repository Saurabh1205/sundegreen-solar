import { getFAQs } from '../lib/firestore'
import FAQClient from './FAQClient'

export default async function FAQSection() {
  const faqs = await getFAQs()
  return <FAQClient faqs={faqs} />
}
