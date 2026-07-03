'use client'
import { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  Edit,
  Printer,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  Phone,
  Layers,
  FileText,
  FileSpreadsheet,
  LogOut,
  RefreshCw,
  Search,
  Check,
  CheckCircle2,
  X,
  PlusCircle,
  ClipboardList,
  ChevronRight,
  TrendingDown,
  Info,
  FileCode
} from 'lucide-react'
import AdminImportPage from './import/page'

type Tab = 'leads' | 'catalog' | 'invoices' | 'reports' | 'import' | 'quotations'

type PipelineStage = 'Pending' | 'SurveyScheduled' | 'SurveyCompleted' | 'NetMeteringFiled' | 'Procurement' | 'Installing' | 'Commissioned' | 'Billed'

interface ProjectDetails {
  surveyRoofType?: string | null
  surveyOrientation?: string | null
  surveyPhase?: string | null
  surveyRecommendedKw?: number | null
  netMeterAppId?: string | null
  netMeterFilingDate?: string | null
  procurementNotes?: string | null
  installationNotes?: string | null
  commissioningDate?: string | null
}

interface Consultation {
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
  status?: PipelineStage | null
  invoiceNo?: string | null
  installedAt?: string | null
  projectDetails?: ProjectDetails | null
}

interface CatalogItem {
  id: string
  name: string
  hsn: string
  costPrice: number
  rate: number
  per: string
  cgstRate: number
  sgstRate: number
}

interface InvoiceItem {
  name: string
  hsn: string
  qty: number
  costPrice: number
  rate: number
  per: string
  amount: number
  cgstRate: number
  sgstRate: number
  cgstAmount: number
  sgstAmount: number
}

interface Invoice {
  id: string
  invoiceNo: string
  dated: string
  leadId: string
  customerName: string
  customerAddress: string
  customerState: string
  customerStateCode: string
  items: InvoiceItem[]
  discountType: 'flat' | 'percent' | 'none'
  discountValue: number
  discountAmount: number
  taxableValue: number
  totalCgst: number
  totalSgst: number
  roundOff: number
  totalAmount: number
  amountInWords: string
  totalCostPrice: number
  createdAt: string
}

interface QuotationItem {
  name: string
  model: string
  qty: string
}

interface Quotation {
  id: string
  refNo: string
  date: string
  leadId?: string | null
  customerName: string
  customerPhone: string
  capacity: string
  items: QuotationItem[]
  totalCost: number
  govtSubsidy: number
  createdAt: string
}

const STAGES: { value: PipelineStage; label: string; desc: string; color: string }[] = [
  { value: 'Pending', label: 'Lead Received', desc: 'New customer inquiry', color: 'bg-amber-500' },
  { value: 'SurveyScheduled', label: 'Visit Scheduled', desc: 'Site visit arranged', color: 'bg-blue-500' },
  { value: 'SurveyCompleted', label: 'Survey Done', desc: 'Roof & electrical details logged', color: 'bg-indigo-500' },
  { value: 'NetMeteringFiled', label: 'Net Meter Filed', desc: 'DISCOM application submitted', color: 'bg-purple-500' },
  { value: 'Procurement', label: 'Procurement', desc: 'Vendor orders placed', color: 'bg-cyan-500' },
  { value: 'Installing', label: 'Installing', desc: 'Physical mounting & wiring', color: 'bg-teal-500' },
  { value: 'Commissioned', label: 'Commissioned', desc: 'Net meter live, system active', color: 'bg-emerald-500' },
  { value: 'Billed', label: 'Billed & Handover', desc: 'Tax Invoice generated', color: 'bg-green-600' }
]

export default function AdminDashboard() {
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinError, setPinError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('leads')

  // Data states
  const [leads, setLeads] = useState<Consultation[]>([])
  const [catalog, setCatalog] = useState<CatalogItem[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [loadingCatalog, setLoadingCatalog] = useState(false)
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const [loadingQuotations, setLoadingQuotations] = useState(false)

  // Filters
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All')
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('')
  const [quotationSearchQuery, setQuotationSearchQuery] = useState('')

  // Report states
  const [reportTimeframe, setReportTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')

  // Modals / Detail Forms states
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<Consultation | null>(null)
  
  // Inspection Scheduling Fields
  const [inspectionModalLead, setInspectionModalLead] = useState<Consultation | null>(null)
  const [inspectionDate, setInspectionDate] = useState('')
  const [inspectionTime, setInspectionTime] = useState('Morning (9 AM - 12 PM)')
  const [inspectionAddress, setInspectionAddress] = useState('')
  const [inspectionLandmark, setInspectionLandmark] = useState('')

  // Survey Detail Fields
  const [surveyRoofType, setSurveyRoofType] = useState('Concrete')
  const [surveyOrientation, setSurveyOrientation] = useState('South')
  const [surveyPhase, setSurveyPhase] = useState('Three Phase')
  const [surveyRecommendedKw, setSurveyRecommendedKw] = useState(3)

  // Net Metering Fields
  const [netMeterAppId, setNetMeterAppId] = useState('')
  const [netMeterFilingDate, setNetMeterFilingDate] = useState('')

  // Billing Modal Fields
  const [billingModalLead, setBillingModalLead] = useState<Consultation | null>(null)
  const [billingInvoiceNo, setBillingInvoiceNo] = useState('')
  const [billingDate, setBillingDate] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [billingState, setBillingState] = useState('Maharashtra')
  const [billingStateCode, setBillingStateCode] = useState('27')
  const [billingDiscountType, setBillingDiscountType] = useState<'none' | 'flat' | 'percent'>('none')
  const [billingDiscountVal, setBillingDiscountVal] = useState(0)
  const [billingItems, setBillingItems] = useState<Partial<InvoiceItem>[]>([])

  const [catalogModalItem, setCatalogModalItem] = useState<Partial<CatalogItem> | null>(null)

  // Quotation Wizard Modal Fields
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false)
  const [quoteLeadId, setQuoteLeadId] = useState<string | null>(null)
  const [quoteCustomerName, setQuoteCustomerName] = useState('')
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState('')
  const [quoteRefNo, setQuoteRefNo] = useState('')
  const [quoteDate, setQuoteDate] = useState('')
  const [quoteCapacity, setQuoteCapacity] = useState('For 3 KW')
  const [quoteTotalCost, setQuoteTotalCost] = useState(190000)
  const [quoteGovtSubsidy, setQuoteGovtSubsidy] = useState(78000)
  const [quoteItems, setQuoteItems] = useState<QuotationItem[]>([])

  // Load auth
  useEffect(() => {
    const savedPin = sessionStorage.getItem('admin_pin')
    if (savedPin) {
      verifyPin(savedPin)
    }
  }, [])

  async function verifyPin(enteredPin: string) {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      })
      if (res.ok) {
        setAuthenticated(true)
        setPin(enteredPin)
        sessionStorage.setItem('admin_pin', enteredPin)
        loadLeads()
        loadCatalog()
        loadInvoices()
        loadQuotations()
      } else {
        const data = await res.json()
        setPinError(data.error || 'Invalid PIN')
        sessionStorage.removeItem('admin_pin')
      }
    } catch {
      setPinError('Failed to verify PIN')
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!pin) {
      setPinError('Enter Admin PIN')
      return
    }
    verifyPin(pin)
  }

  function handleLogout() {
    setAuthenticated(false)
    setPin('')
    sessionStorage.removeItem('admin_pin')
  }

  // ── Data Loading ──────────────────────────────────────────────────────────
  async function loadLeads() {
    setLoadingLeads(true)
    try {
      const res = await fetch('/api/consultation')
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingLeads(false)
    }
  }

  async function loadCatalog() {
    setLoadingCatalog(true)
    try {
      const res = await fetch('/api/admin/catalog')
      if (res.ok) {
        const data = await res.json()
        setCatalog(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingCatalog(false)
    }
  }

  async function loadInvoices() {
    setLoadingInvoices(true)
    try {
      const res = await fetch('/api/admin/invoices')
      if (res.ok) {
        const data = await res.json()
        setInvoices(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingInvoices(false)
    }
  }

  async function loadQuotations() {
    setLoadingQuotations(true)
    try {
      const res = await fetch('/api/admin/quotations')
      if (res.ok) {
        const data = await res.json()
        setQuotations(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingQuotations(false)
    }
  }

  // ── Stage & Pipeline Transition Operations ────────────────────────────────
  async function advanceLeadStage(leadId: string | number, currentStage: PipelineStage, extraPayload: any = {}) {
    const idx = STAGES.findIndex(s => s.value === currentStage)
    if (idx === -1 || idx === STAGES.length - 1) return

    const nextStage = STAGES[idx + 1].value
    try {
      const res = await fetch('/api/consultation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          status: nextStage,
          ...extraPayload
        })
      })

      if (res.ok) {
        loadLeads()
        if (selectedLeadDetails && selectedLeadDetails.id === leadId) {
          const updated = await res.json()
          setSelectedLeadDetails(prev => prev ? { ...prev, status: nextStage, ...updated.data } : null)
        }
      } else {
        alert('Failed to update project stage.')
      }
    } catch (err) {
      alert('Error updating stage: ' + err)
    }
  }

  async function updateProjectDetailsField(leadId: string | number, updatedProjectDetails: ProjectDetails) {
    try {
      const currentLead = leads.find(l => String(l.id) === String(leadId))
      const mergedDetails = {
        ...(currentLead?.projectDetails || {}),
        ...updatedProjectDetails
      }

      const res = await fetch('/api/consultation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          projectDetails: mergedDetails
        })
      })

      if (res.ok) {
        loadLeads()
        if (selectedLeadDetails && selectedLeadDetails.id === leadId) {
          setSelectedLeadDetails(prev => prev ? { ...prev, projectDetails: mergedDetails } : null)
        }
        alert('Details updated successfully!')
      } else {
        alert('Failed to save details.')
      }
    } catch (err) {
      alert('Error: ' + err)
    }
  }

  // ── Scheduling Visit Form ────────────────────────────────────────────────
  async function submitInspection(e: React.FormEvent) {
    e.preventDefault()
    if (!inspectionModalLead) return

    try {
      const res = await fetch('/api/consultation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: inspectionModalLead.id,
          inspectionDetails: {
            preferredDate: inspectionDate,
            preferredTime: inspectionTime,
            address: inspectionAddress,
            landmark: inspectionLandmark,
          },
          status: 'SurveyScheduled'
        }),
      })

      if (res.ok) {
        setInspectionModalLead(null)
        loadLeads()
      } else {
        alert('Failed to save inspection schedule')
      }
    } catch (err) {
      alert('Error scheduling: ' + err)
    }
  }

  // ── Billing Wizard Operations ─────────────────────────────────────────────
  function launchBilling(lead: Consultation) {
    setBillingModalLead(lead)
    const offset = invoices.length + 44
    setBillingInvoiceNo(`SL/26-27/${String(offset).padStart(3, '0')}`)
    setBillingDate(new Date().toISOString().split('T')[0])
    setBillingAddress(lead.inspectionDetails?.address || lead.pincode || '')
    setBillingState('Maharashtra')
    setBillingStateCode('27')
    setBillingDiscountType('none')
    setBillingDiscountVal(0)

    const is3KW = lead.suggestedKw === 3 || (lead.projectDetails?.surveyRecommendedKw === 3)
    
    const initialItems: Partial<InvoiceItem>[] = [
      { name: 'Solar Panel', hsn: '85414012', qty: is3KW ? 5 : 4, costPrice: 12000, rate: 14450, per: 'NOS', cgstRate: 2.5, sgstRate: 2.5 },
      { name: 'SOLAR INVERTER', hsn: '85044090', qty: 1, costPrice: 9500, rate: 11950, per: 'NOS', cgstRate: 2.5, sgstRate: 2.5 },
      { name: 'BASE PLATE', hsn: '72109010', qty: 15, costPrice: 200, rate: 260, per: 'KGS', cgstRate: 9, sgstRate: 9 },
      { name: 'GI TUBE', hsn: '730619', qty: 30, costPrice: 110, rate: 141.67, per: 'KGS', cgstRate: 9, sgstRate: 9 },
      { name: 'ELECTRIC ITEM', hsn: '39172310', qty: 5, costPrice: 800, rate: 1020, per: 'NOS', cgstRate: 9, sgstRate: 9 },
      { name: 'LABOUR CHARGES', hsn: '995421', qty: 1, costPrice: 0, rate: 3500, per: 'NOS', cgstRate: 9, sgstRate: 9 }
    ]
    setBillingItems(initialItems)
  }

  function handleBillingItemChange(index: number, field: keyof InvoiceItem, value: any) {
    const updated = [...billingItems]
    updated[index] = { ...updated[index], [field]: value }
    setBillingItems(updated)
  }

  function handleSelectCatalogTemplate(index: number, itemId: string) {
    const item = catalog.find(i => i.id === itemId)
    if (!item) return
    const updated = [...billingItems]
    updated[index] = {
      name: item.name,
      hsn: item.hsn,
      costPrice: item.costPrice,
      rate: item.rate,
      per: item.per,
      qty: updated[index].qty || 1,
      cgstRate: item.cgstRate,
      sgstRate: item.sgstRate
    }
    setBillingItems(updated)
  }

  function removeBillingItem(index: number) {
    setBillingItems(billingItems.filter((_, i) => i !== index))
  }

  function addBillingItem() {
    setBillingItems([...billingItems, { name: '', hsn: '', qty: 1, costPrice: 0, rate: 0, per: 'NOS', cgstRate: 9, sgstRate: 9 }])
  }

  function calculateBillingSummary() {
    let subtotal = 0
    let totalCOGS = 0

    billingItems.forEach(item => {
      const q = Number(item.qty) || 0
      const r = Number(item.rate) || 0
      const c = Number(item.costPrice) || 0
      subtotal += q * r
      totalCOGS += q * c
    })

    let discountAmt = 0
    if (billingDiscountType === 'percent') {
      discountAmt = (subtotal * billingDiscountVal) / 100
    } else if (billingDiscountType === 'flat') {
      discountAmt = billingDiscountVal
    }
    discountAmt = Number(discountAmt.toFixed(2))

    const taxableValue = subtotal - discountAmt

    let totalCgst = 0
    let totalSgst = 0

    billingItems.forEach(item => {
      const q = Number(item.qty) || 0
      const r = Number(item.rate) || 0
      const amt = q * r
      const proportion = subtotal > 0 ? amt / subtotal : 0
      const itemDiscount = discountAmt * proportion
      const itemTaxable = amt - itemDiscount

      const cgstR = Number(item.cgstRate) || 0
      const sgstR = Number(item.sgstRate) || 0

      totalCgst += (itemTaxable * cgstR) / 100
      totalSgst += (itemTaxable * sgstR) / 100
    })

    totalCgst = Number(totalCgst.toFixed(2))
    totalSgst = Number(totalSgst.toFixed(2))

    const rawTotal = taxableValue + totalCgst + totalSgst
    const grandTotal = Math.round(rawTotal)
    const roundOff = Number((grandTotal - rawTotal).toFixed(2))

    return {
      subtotal,
      discountAmt,
      taxableValue,
      totalCgst,
      totalSgst,
      roundOff,
      grandTotal,
      totalCOGS,
      grossProfit: taxableValue - totalCOGS
    }
  }

  function numberToWords(num: number): string {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ']
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

    if (num === 0) return 'Zero'
    let n = String(num).padStart(9, '0')
    const match = n.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
    if (!match) return ''

    let str = ''
    const crore = parseInt(match[1])
    const lakh = parseInt(match[2])
    const thousand = parseInt(match[3])
    const hundred = parseInt(match[4])
    const tens = parseInt(match[5])

    if (crore > 0) str += (crore < 20 ? a[crore] : b[Math.floor(crore / 10)] + ' ' + a[crore % 10]) + 'Crore '
    if (lakh > 0) str += (lakh < 20 ? a[lakh] : b[Math.floor(lakh / 10)] + ' ' + a[lakh % 10]) + 'Lakh '
    if (thousand > 0) str += (thousand < 20 ? a[thousand] : b[Math.floor(thousand / 10)] + ' ' + a[thousand % 10]) + 'Thousand '
    if (hundred > 0) str += a[hundred] + 'Hundred '
    if (tens > 0) str += (tens < 20 ? a[tens] : b[Math.floor(tens / 10)] + ' ' + a[tens % 10])

    return 'INR ' + str.trim() + ' Only'
  }

  async function submitBilling(e: React.FormEvent) {
    e.preventDefault()
    if (!billingModalLead) return

    const summary = calculateBillingSummary()

    const invoicePayload = {
      leadId: billingModalLead.id,
      invoiceNo: billingInvoiceNo,
      dated: billingDate,
      customerName: billingModalLead.name,
      customerAddress: billingAddress,
      customerState: billingState,
      customerStateCode: billingStateCode,
      items: billingItems,
      discountType: billingDiscountType,
      discountValue: billingDiscountVal,
      discountAmount: summary.discountAmt,
      taxableValue: summary.taxableValue,
      totalCgst: summary.totalCgst,
      totalSgst: summary.totalSgst,
      roundOff: summary.roundOff,
      totalAmount: summary.grandTotal,
      totalCostPrice: summary.totalCOGS,
      amountInWords: numberToWords(summary.grandTotal)
    }

    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, invoice: invoicePayload })
      })

      if (res.ok) {
        setBillingModalLead(null)
        setSelectedLeadDetails(null)
        loadLeads()
        loadInvoices()
        setActiveTab('invoices')
      } else {
        const err = await res.json()
        alert('Billing generation failed: ' + (err.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Error submitting bill: ' + err)
    }
  }

  // ── Quotation Generator Operations ─────────────────────────────────────────
  function launchQuotationWizard(lead?: Consultation) {
    setQuoteLeadId(lead ? String(lead.id) : null)
    setQuoteCustomerName(lead ? lead.name : '')
    setQuoteCustomerPhone(lead ? lead.whatsapp : '')
    setQuoteDate(new Date().toISOString().split('T')[0])
    
    // sequential reference number offset
    const nextRef = quotations.length + 216
    setQuoteRefNo(String(nextRef))
    
    const is3KW = lead ? (lead.suggestedKw === 3 || (lead.bill && lead.bill.includes('1500') === false)) : true
    setQuoteCapacity(is3KW ? 'For 3 KW' : 'For 5 KW')
    setQuoteTotalCost(is3KW ? 190000 : 310000)
    setQuoteGovtSubsidy(is3KW ? 78000 : 78000)

    // Pre-populate standard quotation line items
    const standardItems: QuotationItem[] = [
      { name: '3 KW SINGAL Phase MPPT Inverter-/Vsole/UTL', model: 'Boost', qty: '1.00' },
      { name: '620 W DCR PANEL Make-Adani', model: '620 w', qty: is3KW ? '5.00' : '8.00' },
      { name: 'DCDB - 2 IN 2 OUT', model: '2 IN- 2 OUT', qty: '1.00' },
      { name: 'ACDB – SINGAL PHASE SYSTEM(3 KW)', model: 'SINGAL PHASE', qty: '1.00' },
      { name: '4 SQ. MM 2 CORE AC CABLE – (POLYCAB)', model: 'AC', qty: 'USE' },
      { name: '16 SQ. MM EARTHING CABLE', model: 'AC', qty: 'USE' },
      { name: '4 SQ MM 2 CORE DC CABLE (POLYCAB)', model: 'DC', qty: 'USE' },
      { name: 'Earthling Rod with Chemical Bag', model: '1MTR - 17MM', qty: '3.00' },
      { name: 'GI Structure Hot Dip', model: '3 KW Structure 2*2', qty: 'USE' },
      { name: 'Electric Accessories', model: 'As per Required', qty: '3.00' }
    ]
    setQuoteItems(standardItems)
    setIsQuotationModalOpen(true)
  }

  function handleQuoteItemChange(index: number, field: keyof QuotationItem, value: string) {
    const updated = [...quoteItems]
    updated[index] = { ...updated[index], [field]: value }
    setQuoteItems(updated)
  }

  function handleSelectQuoteCatalogTemplate(index: number, itemId: string) {
    const item = catalog.find(i => i.id === itemId)
    if (!item) return
    const updated = [...quoteItems]
    updated[index] = {
      name: item.name,
      model: item.per === 'NOS' ? 'Standard' : item.per,
      qty: '1.00'
    }
    setQuoteItems(updated)
  }

  function removeQuoteItem(index: number) {
    setQuoteItems(quoteItems.filter((_, i) => i !== index))
  }

  function addQuoteItem() {
    setQuoteItems([...quoteItems, { name: '', model: 'Standard', qty: 'USE' }])
  }

  async function submitQuotation(e: React.FormEvent) {
    e.preventDefault()
    if (!quoteCustomerName || !quoteCustomerPhone || !quoteItems.length) {
      alert('Please fill out all quotation details.')
      return
    }

    const payload = {
      leadId: quoteLeadId,
      refNo: quoteRefNo,
      date: quoteDate,
      customerName: quoteCustomerName,
      customerPhone: quoteCustomerPhone,
      capacity: quoteCapacity,
      items: quoteItems,
      totalCost: Number(quoteTotalCost) || 0,
      govtSubsidy: Number(quoteGovtSubsidy) || 0
    }

    try {
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, quotation: payload })
      })

      if (res.ok) {
        setIsQuotationModalOpen(false)
        loadQuotations()
        setActiveTab('quotations')
      } else {
        const err = await res.json()
        alert('Quotation generation failed: ' + (err.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Error submitting quotation: ' + err)
    }
  }

  // ── Catalog Operations ─────────────────────────────────────────────────────
  async function saveCatalogItem(e: React.FormEvent) {
    e.preventDefault()
    if (!catalogModalItem) return

    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, item: catalogModalItem })
      })

      if (res.ok) {
        setCatalogModalItem(null)
        loadCatalog()
      } else {
        alert('Failed to save item template')
      }
    } catch (err) {
      alert('Error saving catalog: ' + err)
    }
  }

  async function deleteCatalogItem(itemId: string) {
    if (!confirm('Are you sure you want to delete this template from the catalog?')) return
    try {
      const res = await fetch(`/api/admin/catalog?id=${itemId}&pin=${pin}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        loadCatalog()
      } else {
        alert('Failed to delete item template')
      }
    } catch (err) {
      alert('Error deleting template: ' + err)
    }
  }

  // ── Financial aggregation and SVG charts compile ────────────────────────────
  function compileFinancialReports() {
    const now = new Date()
    const currentYear = now.getFullYear()
    
    const monthsData: { name: string; revenue: number; cogs: number; profit: number }[] = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthsData.push({ name: `${monthNames[d.getMonth()]}`, revenue: 0, cogs: 0, profit: 0 })
    }

    let revenue = 0
    let cogs = 0
    let taxes = 0
    let invoicesCount = 0
    const currentMonth = now.getMonth()

    invoices.forEach(inv => {
      const date = new Date(inv.dated || inv.createdAt)
      const invYear = date.getFullYear()
      const invMonth = date.getMonth()

      let matches = false

      if (reportTimeframe === 'monthly') {
        matches = invYear === currentYear && invMonth === currentMonth
      } else if (reportTimeframe === 'quarterly') {
        const currentQuarter = Math.floor(currentMonth / 3)
        const invQuarter = Math.floor(invMonth / 3)
        matches = invYear === currentYear && invQuarter === currentQuarter
      } else if (reportTimeframe === 'yearly') {
        matches = invYear === currentYear
      }

      if (matches) {
        revenue += inv.taxableValue
        cogs += inv.totalCostPrice || 0
        taxes += (inv.totalCgst || 0) + (inv.totalSgst || 0)
        invoicesCount++
      }

      monthsData.forEach(m => {
        const mIdx = monthNames.indexOf(m.name)
        if (mIdx === invMonth && invYear === currentYear) {
          m.revenue += inv.taxableValue
          m.cogs += inv.totalCostPrice || 0
          m.profit += (inv.taxableValue - (inv.totalCostPrice || 0))
        }
      })
    })

    const grossProfit = revenue - cogs
    const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0

    const pipelineDistribution: Record<PipelineStage, { count: number; value: number }> = {
      Pending: { count: 0, value: 0 },
      SurveyScheduled: { count: 0, value: 0 },
      SurveyCompleted: { count: 0, value: 0 },
      NetMeteringFiled: { count: 0, value: 0 },
      Procurement: { count: 0, value: 0 },
      Installing: { count: 0, value: 0 },
      Commissioned: { count: 0, value: 0 },
      Billed: { count: 0, value: 0 }
    }

    leads.forEach(l => {
      const stage = l.status || 'Pending'
      if (pipelineDistribution[stage] !== undefined) {
        pipelineDistribution[stage].count++
        pipelineDistribution[stage].value += l.quotePrice || 190000
      }
    })

    return {
      revenue,
      cogs,
      grossProfit,
      profitMargin,
      taxes,
      invoicesCount,
      monthsData,
      pipelineDistribution
    }
  }

  const reports = compileFinancialReports()

  function getStageTagStyles(stage: PipelineStage) {
    switch (stage) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'SurveyScheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SurveyCompleted': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'NetMeteringFiled': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Procurement': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Installing': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'Commissioned': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Billed': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // ── Login Gate ────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-sm border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-green-300 text-sm mt-1">Sundegreen Solar Control Center</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-300 mb-2">Admin PIN</label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter your PIN"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400"
                autoFocus
              />
              {pinError && <p className="text-red-400 text-sm mt-1">{pinError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Enter Dashboard
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-gradient-to-r from-green-700 to-green-600 shadow-lg text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌞</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Sun Degreen Solar</h1>
              <p className="text-xs text-green-100 font-medium">Business Admin & Billing Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-green-800 px-3 py-1.5 rounded-full border border-green-500 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Firebase Mode
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('leads'); setSelectedLeadDetails(null) }}
            className={`py-4 px-3 font-semibold border-b-2 text-sm flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'leads' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <User size={16} /> Installation Pipeline
            {leads.filter(l => !l.status || l.status !== 'Billed').length > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {leads.filter(l => !l.status || l.status !== 'Billed').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`py-4 px-3 font-semibold border-b-2 text-sm flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'quotations' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileCode size={16} /> Quotations (Offers)
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-4 px-3 font-semibold border-b-2 text-sm flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'catalog' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers size={16} /> Catalog Templates
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-4 px-3 font-semibold border-b-2 text-sm flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'invoices' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText size={16} /> Invoices
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-3 font-semibold border-b-2 text-sm flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'reports' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <TrendingUp size={16} /> Reports & P&L
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-4 px-3 font-semibold border-b-2 text-sm flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'import' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileSpreadsheet size={16} /> CMS Excel Import
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        
        {/* LEADS & TIMELINE PIPELINE TAB */}
        {activeTab === 'leads' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Installation Pipeline & Pendency</h2>
                <p className="text-gray-500 text-sm">Advance projects through milestones from lead capture to survey, net-metering filing, and final billing.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={leadStatusFilter}
                  onChange={e => setLeadStatusFilter(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Projects</option>
                  {STAGES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button
                  onClick={loadLeads}
                  disabled={loadingLeads}
                  className="bg-white border border-gray-300 text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  title="Reload Leads"
                >
                  <RefreshCw size={16} className={loadingLeads ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Split Screen pipeline list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className={`lg:col-span-${selectedLeadDetails ? '2' : '3'} space-y-4`}>
                {loadingLeads ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <span className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                    <p className="text-gray-500 text-sm mt-3">Loading pipeline...</p>
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-800 font-medium">No installation projects active.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {leads
                      .filter(lead => {
                        if (leadStatusFilter === 'All') return true
                        return (lead.status || 'Pending') === leadStatusFilter
                      })
                      .map(lead => {
                        const currentStage = lead.status || 'Pending'
                        const stageIndex = STAGES.findIndex(s => s.value === currentStage)
                        
                        return (
                          <div
                            key={lead.id}
                            onClick={() => setSelectedLeadDetails(lead)}
                            className={`bg-white p-5 rounded-xl border transition shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between gap-4 ${
                              selectedLeadDetails?.id === lead.id ? 'border-green-600 ring-2 ring-green-100' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <div>
                                <h3 className="font-bold text-md text-gray-900 flex items-center gap-1.5 font-sans">
                                  {lead.name}
                                  {lead.leadPriority === 'Very High Priority' && (
                                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">VIP</span>
                                  )}
                                </h3>
                                <p className="text-xs text-gray-400">ID: {lead.id} • Registered: {new Date(lead.createdAt).toLocaleDateString()}</p>
                              </div>
                              <span className={`border text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1.5 ${getStageTagStyles(currentStage)}`}>
                                <span className={`w-2 h-2 rounded-full ${STAGES.find(s => s.value === currentStage)?.color || 'bg-gray-500'}`}></span>
                                {STAGES.find(s => s.value === currentStage)?.label || currentStage}
                              </span>
                            </div>

                            {/* timeline progress */}
                            <div className="w-full bg-gray-100 rounded-full h-2 flex overflow-hidden mt-1">
                              {STAGES.map((s, idx) => (
                                <div
                                  key={s.value}
                                  className={`h-full flex-1 border-r border-white/20 last:border-r-0 ${
                                    idx <= stageIndex ? STAGES[idx].color : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 font-semibold items-center">
                              <span className="flex items-center gap-1"><Phone size={13} /> {lead.whatsapp}</span>
                              {lead.pincode && <span className="flex items-center gap-1">📍 Pincode: {lead.pincode}</span>}
                              {lead.suggestedKw && <span className="flex items-center gap-1">⚡ Capacity: {lead.suggestedKw} KW</span>}
                              
                              {/* Create manual quotation shortcut */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  launchQuotationWizard(lead)
                                }}
                                className="ml-auto text-green-700 hover:text-green-900 border border-green-300 hover:bg-green-50 px-2.5 py-1 rounded text-[10px] font-bold transition flex items-center gap-1"
                              >
                                <Plus size={12} /> Create Quote Offer
                              </button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>

              {/* Detail drawer column */}
              {selectedLeadDetails && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 space-y-6 sticky top-[150px]">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 font-sans">Project Specs</h3>
                      <p className="text-xs text-gray-400">Customer: {selectedLeadDetails.name}</p>
                    </div>
                    <button onClick={() => setSelectedLeadDetails(null)} className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">Milestone Checklist</h4>
                    <div className="space-y-3">
                      {STAGES.map((s, idx) => {
                        const currentStage = selectedLeadDetails.status || 'Pending'
                        const activeIdx = STAGES.findIndex(st => st.value === currentStage)
                        const isDone = idx < activeIdx
                        const isActive = idx === activeIdx
                        
                        return (
                          <div key={s.value} className={`flex items-start gap-3 text-xs ${isActive ? 'bg-green-50/50 p-2 rounded-lg border border-green-100' : ''}`}>
                            <div className="flex flex-col items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] border ${
                                isDone ? 'bg-green-600 border-green-600 text-white' :
                                isActive ? 'bg-green-100 border-green-500 text-green-700 animate-pulse' :
                                'bg-gray-100 border-gray-200 text-gray-400'
                              }`}>
                                {isDone ? <Check size={10} strokeWidth={3} /> : idx + 1}
                              </span>
                              {idx < STAGES.length - 1 && <span className={`w-0.5 h-6 mt-1 ${isDone ? 'bg-green-600' : 'bg-gray-200'}`} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold ${isActive ? 'text-green-800' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>{s.label}</div>
                              <div className="text-[10px] text-gray-400 truncate">{s.desc}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                    <h5 className="font-bold text-xs text-gray-700 flex items-center gap-1"><ClipboardList size={14} /> Action Required</h5>
                    {(() => {
                      const currentStage = selectedLeadDetails.status || 'Pending'
                      
                      if (currentStage === 'Pending') {
                        return (
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500">Arrange site visit to qualified rooftop installation layout, specs, & electrical systems.</p>
                            <button
                              onClick={() => {
                                setInspectionModalLead(selectedLeadDetails)
                                setInspectionAddress(selectedLeadDetails.pincode ? `Pincode: ${selectedLeadDetails.pincode}` : '')
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition"
                            >
                              <Calendar size={14} /> Schedule Inspection
                            </button>
                          </div>
                        )
                      }

                      if (currentStage === 'SurveyScheduled') {
                        return (
                          <div className="space-y-3">
                            <p className="text-xs text-gray-500">Log solar orientation details from structural roof inspection.</p>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Roof Type</label>
                                <select value={surveyRoofType} onChange={e => setSurveyRoofType(e.target.value)} className="w-full border border-gray-300 rounded p-1 text-xs">
                                  <option value="Concrete">Concrete flat roof</option>
                                  <option value="Metal Sheet">Metal Sheet sloped</option>
                                  <option value="Tiles">Roof Tiles</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Solar Orientation</label>
                                <select value={surveyOrientation} onChange={e => setSurveyOrientation(e.target.value)} className="w-full border border-gray-300 rounded p-1 text-xs">
                                  <option value="South">South (optimal)</option>
                                  <option value="East-West">East-West split</option>
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Grid Connection</label>
                                  <select value={surveyPhase} onChange={e => setSurveyPhase(e.target.value)} className="w-full border border-gray-300 rounded p-1 text-xs">
                                    <option value="Single Phase">Single Phase</option>
                                    <option value="Three Phase">Three Phase</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Size (KW)</label>
                                  <input type="number" value={surveyRecommendedKw} onChange={e => setSurveyRecommendedKw(Number(e.target.value) || 3)} className="w-full border border-gray-300 rounded p-1 text-xs" />
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const details: ProjectDetails = { surveyRoofType, surveyOrientation, surveyPhase, surveyRecommendedKw }
                                advanceLeadStage(selectedLeadDetails.id, 'SurveyScheduled', { projectDetails: details })
                              }}
                              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-2 rounded-lg transition"
                            >
                              ✓ Submit Survey Report
                            </button>
                          </div>
                        )
                      }

                      if (currentStage === 'SurveyCompleted') {
                        return (
                          <div className="space-y-3">
                            <p className="text-xs text-gray-500">File Net-Metering approval application with Electricity DISCOM.</p>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">DISCOM Registry ID</label>
                                <input type="text" value={netMeterAppId} onChange={e => setNetMeterAppId(e.target.value)} placeholder="e.g. MSEDCL-998822" className="w-full border border-gray-300 rounded p-1.5 text-xs" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Filing Date</label>
                                <input type="date" value={netMeterFilingDate} className="w-full border border-gray-300 rounded p-1.5 text-xs" onChange={e => setNetMeterFilingDate(e.target.value)} />
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const details: ProjectDetails = { netMeterAppId, netMeterFilingDate }
                                advanceLeadStage(selectedLeadDetails.id, 'SurveyCompleted', { projectDetails: details })
                              }}
                              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 rounded-lg transition"
                            >
                              ✓ Log Filing & Procurement
                            </button>
                          </div>
                        )
                      }

                      if (currentStage === 'NetMeteringFiled') {
                        return (
                          <button onClick={() => advanceLeadStage(selectedLeadDetails.id, 'NetMeteringFiled')} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 rounded-lg transition">
                            Procurement Complete ➔ Installing
                          </button>
                        )
                      }

                      if (currentStage === 'Procurement') {
                        return (
                          <button onClick={() => advanceLeadStage(selectedLeadDetails.id, 'Procurement')} className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-2 rounded-lg transition">
                            Installation Complete ➔ Commissioning
                          </button>
                        )
                      }

                      if (currentStage === 'Installing') {
                        return (
                          <button onClick={() => advanceLeadStage(selectedLeadDetails.id, 'Installing')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition">
                            ✓ Net Meter Activated / Live
                          </button>
                        )
                      }

                      if (currentStage === 'Commissioned') {
                        return (
                          <button onClick={() => launchBilling(selectedLeadDetails)} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1">
                            <FileText size={13} /> Generate Customer Bill
                          </button>
                        )
                      }

                      return <div className="text-center py-2 text-green-700 font-bold text-xs">🎉 Billed & Completed!</div>
                    })()}
                  </div>
                </div>
              )}

            </div>
          </section>
        )}

        {/* QUOTATIONS (OFFERS) TAB */}
        {activeTab === 'quotations' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Manual Customer Quotations</h2>
                <p className="text-gray-500 text-sm">Create and print structured design layouts, pricing offers, and terms for your solar installations.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotations..."
                    value={quotationSearchQuery}
                    onChange={e => setQuotationSearchQuery(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={() => launchQuotationWizard()}
                  className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <PlusCircle size={18} /> Create Manual Quote
                </button>
              </div>
            </div>

            {loadingQuotations ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <span className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-gray-500 text-sm mt-3">Loading quotations...</p>
              </div>
            ) : quotations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-gray-800 font-medium">No quotations generated yet</p>
                <p className="text-gray-400 text-sm mt-1">Generate quote offers for your leads using the create manual quote button.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Ref No</th>
                        <th className="py-4 px-6">Customer Name</th>
                        <th className="py-4 px-6">Mobile</th>
                        <th className="py-4 px-6">System Capacity</th>
                        <th className="py-4 px-6">Price Offer (Incl. GST)</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {quotations
                        .filter(q => {
                          const query = quotationSearchQuery.toLowerCase()
                          return (
                            q.customerName.toLowerCase().includes(query) ||
                            q.refNo.toLowerCase().includes(query)
                          )
                        })
                        .map(quote => (
                          <tr key={quote.id} className="hover:bg-gray-50 transition">
                            <td className="py-4 px-6 font-bold text-gray-900">#Ref: {quote.refNo}</td>
                            <td className="py-4 px-6 font-semibold text-gray-800">{quote.customerName}</td>
                            <td className="py-4 px-6 font-medium text-gray-600">{quote.customerPhone}</td>
                            <td className="py-4 px-6 font-bold text-indigo-700">{quote.capacity}</td>
                            <td className="py-4 px-6 font-extrabold text-green-700">₹{quote.totalCost.toLocaleString()}</td>
                            <td className="py-4 px-6 text-right">
                              <a
                                href={`/admin/quotation/${quote.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                              >
                                <Printer size={14} /> Open Offer Details
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* CATALOG TEMPLATES TAB */}
        {activeTab === 'catalog' && (
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Catalog Templates</h2>
                <p className="text-gray-500 text-sm">Save pre-defined item layouts to quickly generate customer bills.</p>
              </div>
              <button
                onClick={() => setCatalogModalItem({})}
                className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle size={18} /> Add New Item
              </button>
            </div>

            {loadingCatalog ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <span className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-gray-500 text-sm mt-3">Loading catalog templates...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Item Name</th>
                        <th className="py-4 px-6">HSN/SAC</th>
                        <th className="py-4 px-6">Vendor Cost</th>
                        <th className="py-4 px-6">Customer Price</th>
                        <th className="py-4 px-6">GST Rates</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {catalog.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="py-4 px-6 font-bold text-gray-900">{item.name}</td>
                          <td className="py-4 px-6 text-gray-500">{item.hsn}</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">₹{item.costPrice.toLocaleString()} / <span className="text-xs text-gray-400 font-normal">{item.per}</span></td>
                          <td className="py-4 px-6 font-bold text-green-700">₹{item.rate.toLocaleString()} / <span className="text-xs text-gray-400 font-normal">{item.per}</span></td>
                          <td className="py-4 px-6 text-gray-500">
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">CGST: {item.cgstRate}%</span>
                            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium ml-1.5">SGST: {item.sgstRate}%</span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button onClick={() => setCatalogModalItem(item)} className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition inline-block"><Edit size={16} /></button>
                            <button onClick={() => deleteCatalogItem(item.id)} className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition inline-block"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* INVOICES HISTORY TAB */}
        {activeTab === 'invoices' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Generated Invoices</h2>
                <p className="text-gray-500 text-sm">Review, print, and track profitability of generated tax invoices.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto relative">
                <Search size={16} className="absolute left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer or invoice..."
                  value={invoiceSearchQuery}
                  onChange={e => setInvoiceSearchQuery(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {loadingInvoices ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <span className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-gray-500 text-sm mt-3">Loading invoices...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Invoice Details</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Vendor Cost</th>
                        <th className="py-4 px-6">Billed Price (Pre-Tax)</th>
                        <th className="py-4 px-6">Gross Profit</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {invoices
                        .filter(inv => {
                          const query = invoiceSearchQuery.toLowerCase()
                          return (
                            inv.customerName.toLowerCase().includes(query) ||
                            inv.invoiceNo.toLowerCase().includes(query)
                          )
                        })
                        .map(inv => {
                          const profit = inv.taxableValue - (inv.totalCostPrice || 0)
                          const margin = inv.taxableValue > 0 ? (profit / inv.taxableValue) * 100 : 0
                          return (
                            <tr key={inv.id} className="hover:bg-gray-50 transition">
                              <td className="py-4 px-6">
                                <div className="font-bold text-gray-900">{inv.invoiceNo}</div>
                                <div className="text-xs text-gray-400 mt-0.5">Dated: {inv.dated}</div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-gray-800">{inv.customerName}</div>
                              </td>
                              <td className="py-4 px-6 font-semibold text-gray-500">₹{(inv.totalCostPrice || 0).toLocaleString()}</td>
                              <td className="py-4 px-6 font-semibold text-gray-800">
                                ₹{inv.taxableValue.toLocaleString()}
                                {inv.discountAmount > 0 && <div className="text-[10px] text-orange-600 font-bold">Discounted</div>}
                              </td>
                              <td className="py-4 px-6">
                                <div className={`font-bold ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>₹{profit.toLocaleString()}</div>
                                <div className="text-[10px] text-gray-400">{margin.toFixed(1)}% margin</div>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <a href={`/admin/invoice/${inv.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition"><Printer size={14} /> Open & Print</a>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* REPORTS & PROFIT/LOSS TAB (WITH SVG CHARTS) */}
        {activeTab === 'reports' && (
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profit & Loss Reports</h2>
                <p className="text-gray-500 text-sm">Track your margins, vendor costs, and project pipelines with real-time analytics.</p>
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {['monthly', 'quarterly', 'yearly'].map(t => (
                  <button
                    key={t}
                    onClick={() => setReportTimeframe(t as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition capitalize ${
                      reportTimeframe === t ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t === 'monthly' ? 'This Month' : t === 'quarterly' ? 'This Quarter' : 'This Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Revenue (Pre-Tax)</span>
                  <DollarSign size={20} className="text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">₹{reports.revenue.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">{reports.invoicesCount} billing events</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">COGS (Vendor Costs)</span>
                  <Layers size={20} className="text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">₹{reports.cogs.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">Purchased for clients</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Gross Profit</span>
                  <TrendingUp size={20} className={reports.grossProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
                </div>
                <div className={`text-2xl font-bold ${reports.grossProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>₹{reports.grossProfit.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1 font-semibold">{reports.profitMargin.toFixed(1)}% gross margin</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">GST Liaised</span>
                  <FileText size={20} className="text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900">₹{reports.taxes.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">CGST + SGST collected</p>
              </div>
            </div>

            {/* Financial Visualizations: Dynamic SVG Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 1. Bar Chart: Revenue vs. COGS */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider flex items-center gap-1">📊 Monthly Revenue vs. Vendor Costs</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Last 6 months breakdown</p>
                </div>
                
                <div className="h-64 flex items-end justify-center w-full">
                  <svg className="w-full h-full text-xs" viewBox="0 0 500 240" fill="none">
                    <line x1="40" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="190" x2="480" y2="190" stroke="#cbd5e1" strokeWidth="1.5" />

                    {reports.monthsData.map((m, idx) => {
                      const spacing = 70
                      const xBase = 60 + idx * spacing
                      const maxVal = Math.max(...reports.monthsData.map(d => Math.max(d.revenue, d.cogs)), 100000)
                      const scale = 140 / maxVal
                      const revHeight = m.revenue * scale
                      const cogsHeight = m.cogs * scale

                      return (
                        <g key={m.name}>
                          <rect x={xBase} y={190 - revHeight} width="20" height={revHeight} fill="#22c55e" rx="3" className="transition-all duration-500 hover:fill-green-400 cursor-pointer"><title>{m.name} Revenue: ₹{m.revenue.toLocaleString()}</title></rect>
                          <rect x={xBase + 24} y={190 - cogsHeight} width="20" height={cogsHeight} fill="#f97316" rx="3" className="transition-all duration-500 hover:fill-orange-400 cursor-pointer"><title>{m.name} Costs: ₹{m.cogs.toLocaleString()}</title></rect>
                          <text x={xBase + 22} y="210" textAnchor="middle" fill="#64748b" className="font-semibold">{m.name}</text>
                        </g>
                      )
                    })}
                    <text x="35" y="45" textAnchor="end" fill="#94a3b8">Max</text>
                    <text x="35" y="115" textAnchor="end" fill="#94a3b8">Mid</text>
                    <text x="35" y="195" textAnchor="end" fill="#94a3b8">0</text>
                  </svg>
                </div>
                <div className="flex gap-4 justify-center text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded-sm"></span> Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-orange-500 rounded-sm"></span> Vendor Costs</span>
                </div>
              </div>

              {/* 2. Line Chart: Profit Margins */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider flex items-center gap-1">📈 Profit Margin Percentage Trend</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Performance index</p>
                </div>

                <div className="h-64 flex items-end justify-center w-full">
                  <svg className="w-full h-full text-xs" viewBox="0 0 500 240" fill="none">
                    <line x1="40" y1="40" x2="480" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="40" y1="190" x2="480" y2="190" stroke="#cbd5e1" strokeWidth="1.5" />

                    {(() => {
                      const points = reports.monthsData.map((m, idx) => {
                        const spacing = 70
                        const x = 80 + idx * spacing
                        const profitMargin = m.revenue > 0 ? (m.profit / m.revenue) * 100 : 0
                        const y = 190 - (profitMargin * 1.5)
                        return { x, y, margin: profitMargin, name: m.name }
                      })

                      const pathD = points.reduce((acc, p, idx) => {
                        return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
                      }, '')

                      return (
                        <g>
                          <path d={pathD} fill="none" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          {points.map((p, idx) => (
                            <g key={idx}>
                              <circle cx={p.x} cy={p.y} r="5" fill="#22c55e" stroke="#15803d" strokeWidth="2" className="cursor-pointer"><title>{p.name} Margin: {p.margin.toFixed(1)}%</title></circle>
                              <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#15803d" className="font-bold text-[10px]">{p.margin > 0 ? `${p.margin.toFixed(0)}%` : '0%'}</text>
                              <text x={p.x} y="210" textAnchor="middle" fill="#64748b" className="font-semibold">{p.name}</text>
                            </g>
                          ))}
                        </g>
                      )
                    })()}
                    <text x="35" y="45" textAnchor="end" fill="#94a3b8">100%</text>
                    <text x="35" y="115" textAnchor="end" fill="#94a3b8">50%</text>
                    <text x="35" y="195" textAnchor="end" fill="#94a3b8">0%</text>
                  </svg>
                </div>
                <div className="text-center text-xs text-gray-500 font-semibold italic">Displays operational margin percentage computed per billing month.</div>
              </div>
            </div>

            {/* Pipeline Stage Valuation */}
            <div className="bg-gradient-to-br from-indigo-900 via-green-950 to-indigo-950 rounded-2xl p-6 text-white shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-1.5"><Layers className="text-green-400" /> Pipeline Funnel & Pendency Valuations</h3>
                <p className="text-green-100 text-xs mt-0.5">Quantified potential revenue waiting at each milestone stage.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {STAGES.map(stage => {
                  const data = reports.pipelineDistribution[stage.value] || { count: 0, value: 0 }
                  return (
                    <div key={stage.value} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10 flex flex-col justify-between h-28">
                      <div>
                        <div className="text-[10px] font-bold text-green-300 uppercase tracking-wider">{stage.label}</div>
                        <div className="text-2xl font-black mt-1">{data.count} {data.count === 1 ? 'project' : 'projects'}</div>
                      </div>
                      <div className="text-xs font-bold text-gray-100 border-t border-white/10 pt-2 flex justify-between">
                        <span>Valuation:</span>
                        <span className="text-green-300">₹{data.value.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-green-100">
                <span className="flex items-center gap-1"><Info size={14} className="text-green-400" /> Total Active Pendency (Leads not yet final-billed)</span>
                <span className="text-sm">
                  Valuation: <span className="text-white text-md font-black">₹{Object.values(reports.pipelineDistribution).slice(0, 7).reduce((acc, v) => acc + v.value, 0).toLocaleString()}</span>
                </span>
              </div>
            </div>
          </section>
        )}

        {/* CMS EXCEL IMPORT TAB */}
        {activeTab === 'import' && (
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <AdminImportPage />
          </section>
        )}
      </div>

      {/* ── MODALS ── */}

      {/* 1. Schedule Visit */}
      {inspectionModalLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-gray-100 shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Schedule Site Visit</h3>
                <p className="text-xs text-blue-100 mt-1">Customer: {inspectionModalLead.name}</p>
              </div>
              <button onClick={() => setInspectionModalLead(null)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submitInspection} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Visit Date</label>
                  <input type="date" required value={inspectionDate} onChange={e => setInspectionDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slot</label>
                  <select value={inspectionTime} onChange={e => setInspectionTime(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option value="Morning (9 AM - 12 PM)">Morning (9 - 12)</option>
                    <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 - 3)</option>
                    <option value="Evening (3 PM - 6 PM)">Evening (3 - 6)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Site Address</label>
                <textarea required rows={3} value={inspectionAddress} onChange={e => setInspectionAddress(e.target.value)} placeholder="Address..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Landmark (Optional)</label>
                <input type="text" value={inspectionLandmark} onChange={e => setInspectionLandmark(e.target.value)} placeholder="e.g. Near Ram Temple" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setInspectionModalLead(null)} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Billing Wizard */}
      {billingModalLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden border border-gray-100 shadow-2xl animate-scale-up my-8">
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Billing Wizard & Invoice Generator</h3>
                <p className="text-xs text-green-100 mt-1">Generating Tax Invoice for: {billingModalLead.name}</p>
              </div>
              <button onClick={() => setBillingModalLead(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={submitBilling} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Invoice Number</label>
                  <input type="text" required value={billingInvoiceNo} onChange={e => setBillingInvoiceNo(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dated</label>
                  <input type="date" required value={billingDate} onChange={e => setBillingDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer State</label>
                  <input type="text" required value={billingState} onChange={e => setBillingState(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State Code</label>
                  <input type="text" required value={billingStateCode} onChange={e => setBillingStateCode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Buyer Address</label>
                  <input type="text" required value={billingAddress} onChange={e => setBillingAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-bold text-gray-800">Invoice Items Line</h4>
                  <button type="button" onClick={addBillingItem} className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"><PlusCircle size={14} /> Add Item Row</button>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                        <th className="p-3 w-1/4">Catalog Template / Item Name</th>
                        <th className="p-3">HSN/SAC</th>
                        <th className="p-3 w-12 text-center">Unit</th>
                        <th className="p-3 w-16 text-center">Qty</th>
                        <th className="p-3 w-28">Vendor Cost</th>
                        <th className="p-3 w-28">Selling Rate</th>
                        <th className="p-3 w-16 text-center">CGST%</th>
                        <th className="p-3 w-16 text-center">SGST%</th>
                        <th className="p-3 w-24 text-right">Subtotal</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {billingItems.map((item, idx) => {
                        const qty = Number(item.qty) || 0
                        const rate = Number(item.rate) || 0
                        const sub = qty * rate
                        return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-2 space-y-1">
                              <select onChange={e => handleSelectCatalogTemplate(idx, e.target.value)} className="w-full text-xs border border-gray-200 rounded bg-gray-50 p-1 text-gray-600 focus:outline-none">
                                <option value="">-- Catalog Template --</option>
                                {catalog.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                              </select>
                              <input type="text" required value={item.name || ''} onChange={e => handleBillingItemChange(idx, 'name', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-bold" />
                            </td>
                            <td className="p-2"><input type="text" required value={item.hsn || ''} onChange={e => handleBillingItemChange(idx, 'hsn', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" /></td>
                            <td className="p-2"><input type="text" required value={item.per || 'NOS'} onChange={e => handleBillingItemChange(idx, 'per', e.target.value)} className="w-full border border-gray-300 rounded p-1.5 text-xs text-center" /></td>
                            <td className="p-2"><input type="number" required min="1" value={item.qty || 1} onChange={e => handleBillingItemChange(idx, 'qty', parseInt(e.target.value) || 0)} className="w-full border border-gray-300 rounded p-1.5 text-xs text-center font-bold" /></td>
                            <td className="p-2"><input type="number" required min="0" step="any" value={item.costPrice || 0} onChange={e => handleBillingItemChange(idx, 'costPrice', parseFloat(e.target.value) || 0)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-500" /></td>
                            <td className="p-2"><input type="number" required min="0" step="any" value={item.rate || 0} onChange={e => handleBillingItemChange(idx, 'rate', parseFloat(e.target.value) || 0)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-bold text-green-700" /></td>
                            <td className="p-2"><input type="number" required min="0" max="100" step="0.5" value={item.cgstRate || 2.5} onChange={e => handleBillingItemChange(idx, 'cgstRate', parseFloat(e.target.value) || 0)} className="w-full border border-gray-300 rounded p-1.5 text-xs text-center" /></td>
                            <td className="p-2"><input type="number" required min="0" max="100" step="0.5" value={item.sgstRate || 2.5} onChange={e => handleBillingItemChange(idx, 'sgstRate', parseFloat(e.target.value) || 0)} className="w-full border border-gray-300 rounded p-1.5 text-xs text-center" /></td>
                            <td className="p-2 text-right font-bold text-gray-900 whitespace-nowrap">₹{sub.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="p-2 text-center"><button type="button" onClick={() => removeBillingItem(idx)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                  <h5 className="font-bold text-sm text-gray-700 flex items-center gap-1.5">🏷️ Applied Discount Settings</h5>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 cursor-pointer"><input type="radio" name="discountType" checked={billingDiscountType === 'none'} onChange={() => { setBillingDiscountType('none'); setBillingDiscountVal(0) }} /> No Discount</label>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 cursor-pointer"><input type="radio" name="discountType" checked={billingDiscountType === 'flat'} onChange={() => { setBillingDiscountType('flat'); setBillingDiscountVal(0) }} /> Flat Discount (₹)</label>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 cursor-pointer"><input type="radio" name="discountType" checked={billingDiscountType === 'percent'} onChange={() => { setBillingDiscountType('percent'); setBillingDiscountVal(0) }} /> Percentage (%)</label>
                  </div>
                  {billingDiscountType !== 'none' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{billingDiscountType === 'flat' ? 'Discount Amount (₹)' : 'Discount Rate (%)'}</label>
                      <input type="number" min="0" step="any" value={billingDiscountVal || ''} onChange={e => setBillingDiscountVal(parseFloat(e.target.value) || 0)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-bold" placeholder={billingDiscountType === 'flat' ? 'e.g. 5000' : 'e.g. 5'} />
                    </div>
                  )}
                </div>

                <div className="bg-green-50/50 border border-green-200/80 p-5 rounded-2xl text-sm space-y-3 font-semibold text-gray-700">
                  <h5 className="font-bold text-sm text-green-800 flex items-center gap-1.5 mb-2">🧾 Real-time Calculations Preview</h5>
                  <div className="flex justify-between"><span>Taxable Subtotal (selling price):</span><span className="text-gray-900">₹{calculateBillingSummary().subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  {calculateBillingSummary().discountAmt > 0 && (<div className="flex justify-between text-orange-600 font-bold"><span>Discount Applied:</span><span>-₹{calculateBillingSummary().discountAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>)}
                  <div className="flex justify-between border-t border-green-200/50 pt-2 text-green-950 font-bold"><span>Final Taxable Value:</span><span>₹{calculateBillingSummary().taxableValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span>CGST Total:</span><span className="text-gray-900">₹{calculateBillingSummary().totalCgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between"><span>SGST Total:</span><span className="text-gray-900">₹{calculateBillingSummary().totalSgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between text-xs text-gray-500"><span>Round Off adjustment:</span><span>₹{calculateBillingSummary().roundOff}</span></div>
                  <div className="flex justify-between border-t border-green-200/50 pt-3 text-lg text-green-900 font-extrabold"><span>Grand Total:</span><span>₹{calculateBillingSummary().grandTotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-dashed border-green-200/50"><span>Total Vendor Purchase Cost:</span><span>₹{calculateBillingSummary().totalCOGS.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs text-green-700"><span>Estimated Net Profit on Project:</span><span className="font-bold">₹{calculateBillingSummary().grossProfit.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setBillingModalLead(null)} className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition">🚀 Confirm & Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Catalog Item Template Form Modal */}
      {catalogModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-gray-100 shadow-2xl">
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{catalogModalItem.id ? 'Edit Catalog Item Template' : 'Add New Item Template'}</h3>
                <p className="text-xs text-green-100 mt-1">Configure default template details for billing shortcuts.</p>
              </div>
              <button onClick={() => setCatalogModalItem(null)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={saveCatalogItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Item Name</label>
                <input type="text" required value={catalogModalItem.name || ''} onChange={e => setCatalogModalItem({ ...catalogModalItem, name: e.target.value })} placeholder="e.g. Solar Panel, Wires..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">HSN/SAC Code</label>
                  <input type="text" required value={catalogModalItem.hsn || ''} onChange={e => setCatalogModalItem({ ...catalogModalItem, hsn: e.target.value })} placeholder="e.g. 85414012" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
                  <input type="text" required value={catalogModalItem.per || 'NOS'} onChange={e => setCatalogModalItem({ ...catalogModalItem, per: e.target.value })} placeholder="e.g. NOS, KGS, MTR" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Default Vendor Cost (₹)</label>
                  <input type="number" required min="0" step="any" value={catalogModalItem.costPrice || 0} onChange={e => setCatalogModalItem({ ...catalogModalItem, costPrice: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Default Customer Rate (₹)</label>
                  <input type="number" required min="0" step="any" value={catalogModalItem.rate || 0} onChange={e => setCatalogModalItem({ ...catalogModalItem, rate: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CGST (%)</label>
                  <input type="number" required min="0" max="100" step="0.5" value={catalogModalItem.cgstRate || 2.5} onChange={e => setCatalogModalItem({ ...catalogModalItem, cgstRate: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SGST (%)</label>
                  <input type="number" required min="0" max="100" step="0.5" value={catalogModalItem.sgstRate || 2.5} onChange={e => setCatalogModalItem({ ...catalogModalItem, sgstRate: parseFloat(e.target.value) || 0 })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setCatalogModalItem(null)} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">Save Item template</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Manual Quotation Wizard Modal */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden border border-gray-100 shadow-2xl animate-scale-up my-8">
            <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Manual Quotation Wizard</h3>
                <p className="text-xs text-green-100 mt-1">Configure pricing packages and terms for client offers.</p>
              </div>
              <button onClick={() => setIsQuotationModalOpen(false)} className="text-white/80 hover:text-white"><X size={24} /></button>
            </div>
            
            <form onSubmit={submitQuotation} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              {/* Customer Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={quoteCustomerName}
                    onChange={e => setQuoteCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={quoteCustomerPhone}
                    onChange={e => setQuoteCustomerPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quotation Date</label>
                  <input
                    type="date"
                    required
                    value={quoteDate}
                    onChange={e => setQuoteDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reference Number</label>
                  <input
                    type="text"
                    required
                    value={quoteRefNo}
                    onChange={e => setQuoteRefNo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">System Capacity Rating</label>
                  <input
                    type="text"
                    required
                    value={quoteCapacity}
                    onChange={e => setQuoteCapacity(e.target.value)}
                    placeholder="e.g. For 3 KW"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quoted Price (Incl. GST)</label>
                  <input
                    type="number"
                    required
                    value={quoteTotalCost}
                    onChange={e => setQuoteTotalCost(Number(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-bold text-green-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Government Subsidy (₹)</label>
                  <input
                    type="number"
                    required
                    value={quoteGovtSubsidy}
                    onChange={e => setQuoteGovtSubsidy(Number(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 font-bold text-orange-700"
                  />
                </div>
              </div>

              {/* Quotation Items List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-bold text-gray-800">Quotation Materials Checklist</h4>
                  <button
                    type="button"
                    onClick={addQuoteItem}
                    className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                  >
                    <PlusCircle size={14} /> Add Quotation Line
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                        <th className="p-3 w-1/3">Catalog Template / Product Description</th>
                        <th className="p-3 w-1/3">Model / Rating specifications</th>
                        <th className="p-3 w-1/4">Quantity (Number or Terms e.g. "USE")</th>
                        <th className="p-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {quoteItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-2 space-y-1">
                            <select
                              onChange={e => handleSelectQuoteCatalogTemplate(idx, e.target.value)}
                              className="w-full text-xs border border-gray-200 rounded bg-gray-50 p-1 text-gray-600 focus:outline-none animate-none"
                            >
                              <option value="">-- Catalog Template --</option>
                              {catalog.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                            </select>
                            <input
                              type="text"
                              required
                              value={item.name}
                              onChange={e => handleQuoteItemChange(idx, 'name', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-bold"
                              placeholder="Product details..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              required
                              value={item.model}
                              onChange={e => handleQuoteItemChange(idx, 'model', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs"
                              placeholder="e.g. Boost, 620 w, 2 IN-2 OUT..."
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              required
                              value={item.qty}
                              onChange={e => handleQuoteItemChange(idx, 'qty', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs font-bold text-center"
                              placeholder="e.g. 1.00 or USE or As per Required..."
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeQuoteItem(idx)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsQuotationModalOpen(false)}
                  className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition"
                >
                  🚀 Generate & Save Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  )
}
