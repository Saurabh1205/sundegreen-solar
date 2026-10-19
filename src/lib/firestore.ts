import { db } from './firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore'
import type {
  Service,
  Project,
  Testimonial,
  FAQItem,
  BlogPost,
  SiteConfig,
  StatCard,
} from '../types'

// ─── FALLBACK DATA ──────────────────────────────────────────────────────────

const fallbackStats: StatCard[] = [
  { value: 500, label: 'Installations', suffix: '+', icon: '⚡' },
  { value: 10, label: 'MW Installed', suffix: '+', icon: '🔋' },
  { value: 25, label: 'Years Warranty', icon: '🛡️' },
  { value: 98, label: 'Customer Satisfaction', suffix: '%', icon: '😊' },
]

const fallbackSiteConfig: SiteConfig = {
  heroHeadline: 'Power Your Future With Clean Solar Energy',
  heroSubline: 'Reduce electricity bills by up to 90% with high-efficiency solar systems for homes, businesses and industries.',
  heroBadgeText: "India's Trusted Solar Partner",
  phone: '+91 75077 71361',
  email: 'info@sundegreensolar.in',
  address: 'Mumbai, India',
  googleRating: '4.8',
  footerTagline: 'Empowering India with clean, sustainable solar energy solutions for homes, businesses, and industries.',
  stats: fallbackStats,
}

const fallbackServices: Service[] = [
  { id: 'res', title: 'Residential Solar', summary: 'Rooftop solar solutions tailored for homes.', category: 'residential' },
  { id: 'com', title: 'Commercial Solar', summary: 'High-efficiency systems for businesses.', category: 'commercial' },
  { id: 'ind', title: 'Industrial Solar', summary: 'Large-scale solar installations and EPC.', category: 'industrial' },
  // { id: 'pump', title: 'Solar Water Pumps', summary: 'Robust pumps for agriculture and irrigation.', category: 'other' },
  // { id: 'battery', title: 'Battery Backup Systems', summary: 'Reliable energy storage solutions.', category: 'other' },
  { id: 'maint', title: 'Annual Maintenance Contracts', summary: 'Keep your system at peak performance.', category: 'other' },
]

const fallbackProjects: Project[] = [
  { id: 'p1', title: 'Rooftop Residence, Pune', image: '/projects/res1.svg', capacityKW: 5, location: 'Pune, MH', savingsAnnual: 45000, category: 'residential' },
  { id: 'p2', title: 'Factory Solar Installation, Gujarat', image: '/projects/res1.svg', capacityKW: 150, location: 'Vadodara, GJ', savingsAnnual: 1800000, category: 'industrial' },
  { id: 'p3', title: 'School Rooftop, Bangalore', image: '/projects/res1.svg', capacityKW: 20, location: 'Bengaluru, KA', savingsAnnual: 200000, category: 'commercial' },
]

const fallbackTestimonials: Testimonial[] = [
  { id: '1', name: 'Rajesh Kumar', location: 'Mumbai, Maharashtra', rating: 5, review: 'Sun Degreen Solar transformed my electricity bills. I am saving ₹4,500 every month! The installation was quick and the team was very professional.', image: '/customer_rajesh.png' },
  { id: '2', name: 'Priya Sharma', location: 'Bangalore, Karnataka', rating: 5, review: 'The best investment for my home. The engineers explained everything clearly, and now I feel proud using clean energy. Highly recommended!', image: '/customer_priya.png' },
  { id: '3', name: 'Amit Patel', location: 'Ahmedabad, Gujarat', rating: 5, review: 'Running my factory on solar power is amazing. I reduced my operating costs by 70%. The team provided excellent after-sales support too.', image: '/customer_amit.png' },
]

const fallbackFAQs: FAQItem[] = [
  { id: '1', question: 'How much can I save with solar energy?', answer: 'Most customers save 70-90% on their electricity bills. Your exact savings depend on your current consumption, location, and system size. We offer a free consultation to calculate your specific savings.', order: 1 },
  { id: '2', question: 'What is the installation time?', answer: 'A typical residential installation takes 3-5 days. Commercial and industrial projects may take longer depending on system complexity.', order: 2 },
  { id: '3', question: 'Do I need to maintain the solar panels?', answer: 'Solar panels require minimal maintenance. We recommend cleaning them 2-3 times a year. We also offer comprehensive AMC services.', order: 3 },
  { id: '4', question: 'What warranty do you provide?', answer: 'We provide a 25-year warranty on panels and 10-year warranty on inverters.', order: 4 },
  { id: '5', question: 'Are there government subsidies available?', answer: 'Yes! The Government of India offers subsidies up to 40% on residential solar installations.', order: 5 },
  { id: '6', question: 'Will solar panels work during monsoons?', answer: 'Yes, solar panels generate electricity even on cloudy days. While output is reduced during heavy monsoons, modern panels provide consistent energy throughout the year.', order: 6 },
]

const fallbackBlogPosts: BlogPost[] = [
  { slug: 'solar-panel-cost-india', title: 'Solar Panel Cost in India', excerpt: 'Understanding costs and ROI for residential systems.', publishedAt: '2024-01-15' },
  { slug: 'government-solar-subsidies', title: 'Government Solar Subsidies', excerpt: 'How to access subsidies and incentives.', publishedAt: '2024-02-10' },
  { slug: 'net-metering-explained', title: 'Net Metering Explained', excerpt: 'Net metering basics for homeowners.', publishedAt: '2024-03-05' },
]

// ─── LOCAL FILE FALLBACK HELPER ─────────────────────────────────────────────

async function readLocalJson<T>(filename: string): Promise<T | null> {
  try {
    const { promises: fs } = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', filename)
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

// ─── FETCH FUNCTIONS ─────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const docRef = doc(db, 'siteConfig', 'main')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      return { ...fallbackSiteConfig, ...snap.data() } as SiteConfig
    }
  } catch {}
  const local = await readLocalJson<Partial<SiteConfig>>('siteConfig.json')
  if (local) {
    return { ...fallbackSiteConfig, ...local }
  }
  return fallbackSiteConfig
}

export async function getServices(): Promise<Service[]> {
  try {
    const snap = await getDocs(collection(db, 'services'))
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Service))
    }
  } catch {}
  const local = await readLocalJson<Service[]>('services.json')
  if (local && local.length > 0) return local
  return fallbackServices
}

export async function getProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(collection(db, 'projects'))
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
    }
  } catch {}
  const local = await readLocalJson<Project[]>('projects.json')
  if (local && local.length > 0) return local
  return fallbackProjects
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const snap = await getDocs(collection(db, 'testimonials'))
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial))
    }
  } catch {}
  const local = await readLocalJson<Testimonial[]>('testimonials.json')
  if (local && local.length > 0) return local
  return fallbackTestimonials
}

export async function getFAQs(): Promise<FAQItem[]> {
  try {
    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as FAQItem))
    }
  } catch {}
  const local = await readLocalJson<FAQItem[]>('faqs.json')
  if (local && local.length > 0) return local
  return fallbackFAQs
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'))
    const snap = await getDocs(q)
    if (!snap.empty) {
      return snap.docs.map(d => ({ slug: d.id, ...d.data() } as BlogPost))
    }
  } catch {}
  const local = await readLocalJson<BlogPost[]>('blogPosts.json')
  if (local && local.length > 0) return local
  return fallbackBlogPosts
}
