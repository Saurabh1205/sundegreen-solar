export type Service = {
  id: string
  title: string
  summary: string
  category: 'residential' | 'commercial' | 'industrial' | 'other'
  icon?: string
  features?: string[]
}

export type Project = {
  id: string
  title: string
  image: string
  capacityKW: number
  location: string
  savingsAnnual: number
  category: 'residential' | 'commercial' | 'industrial'
}

export type Testimonial = {
  id: string
  name: string
  location: string
  rating: number
  review: string
  image: string
}

export type FAQItem = {
  id: string
  question: string
  answer: string
  order?: number
}

export type StatCard = {
  icon: string
  value: number
  suffix?: string
  label: string
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  coverImageUrl?: string
  body?: string
}

export type SiteConfig = {
  heroHeadline?: string
  heroSubline?: string
  heroBadgeText?: string
  logoUrl?: string
  phone?: string
  email?: string
  address?: string
  googleRating?: string
  stats?: StatCard[]
  footerTagline?: string
}

export type CatalogItem = {
  id: string
  name: string
  hsn: string
  costPrice: number // Default Vendor Cost
  rate: number // Default Selling Price
  per: string // e.g., 'NOS', 'KGS', 'MTR', 'SET'
  cgstRate: number
  sgstRate: number
}

export type InvoiceItem = {
  name: string
  hsn: string
  qty: number
  costPrice: number // Vendor Cost specified for this invoice
  rate: number // Selling Price specified for this invoice
  per: string
  amount: number // qty * rate
  cgstRate: number
  sgstRate: number
  cgstAmount: number
  sgstAmount: number
}

export type Invoice = {
  id: string
  invoiceNo: string
  dated: string // e.g., "2026-06-10"
  leadId: string
  customerName: string
  customerAddress: string
  customerState: string
  customerStateCode: string
  items: InvoiceItem[]
  discountType: 'flat' | 'percent' | 'none'
  discountValue: number
  discountAmount: number
  taxableValue: number // subtotal after discount
  totalCgst: number
  totalSgst: number
  roundOff: number
  totalAmount: number
  amountInWords: string
  totalCostPrice: number // COGS
  createdAt: string
}

export interface ConsultationEntry {
  id: string | number
  name: string
  whatsapp: string
  email?: string | null
  pincode?: string | null
  bill?: string | null
  serviceType?: string | null
  message?: string | null
  suggestedKw?: number | null
  brand?: string | null
  quotePrice?: number | null
  leadPriority?: string | null
  source?: string | null
  inspectionDetails?: {
    preferredDate: string
    preferredTime: string
    address: string
    landmark?: string | null
  } | null
  createdAt: string
  status?: 'Pending' | 'SurveyScheduled' | 'SurveyCompleted' | 'NetMeteringFiled' | 'Procurement' | 'Installing' | 'Commissioned' | 'Billed' | null
  invoiceNo?: string | null
  installedAt?: string | null
  projectDetails?: {
    surveyRoofType?: string | null
    surveyOrientation?: string | null
    surveyPhase?: string | null
    surveyRecommendedKw?: number | null
    netMeterAppId?: string | null
    netMeterFilingDate?: string | null
    procurementNotes?: string | null
    installationNotes?: string | null
    commissioningDate?: string | null
  } | null
}

export type QuotationItem = {
  name: string
  model: string
  qty: string // string to allow "USE" or "As per Required"
}

export type Quotation = {
  id: string
  refNo: string
  date: string
  leadId?: string | null
  customerName: string
  customerPhone: string
  capacity: string // e.g. "For 3 KW"
  items: QuotationItem[]
  totalCost: number
  govtSubsidy: number
  createdAt: string
}


