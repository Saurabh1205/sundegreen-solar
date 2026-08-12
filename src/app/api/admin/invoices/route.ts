import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore'
import { Invoice, InvoiceItem, ConsultationEntry } from '../../../../types'
import { promises as fs } from 'fs'
import path from 'path'

const ADMIN_PIN = process.env.ADMIN_IMPORT_PIN || 'sundegreen2024'

const hasFirebaseConfig = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "sundegreen-solar"
  )
}

// Local file helpers for Invoices
async function readLocalInvoices(): Promise<Invoice[]> {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'invoices.json')
  try {
    await fs.mkdir(dataDir, { recursive: true })
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

async function writeLocalInvoices(data: Invoice[]) {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'invoices.json')
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// Local file helpers for Consultations (leads)
async function readLocalConsultations(): Promise<ConsultationEntry[]> {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'consultations.json')
  try {
    await fs.mkdir(dataDir, { recursive: true })
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

async function writeLocalConsultations(data: ConsultationEntry[]) {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'consultations.json')
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function GET() {
  try {
    if (hasFirebaseConfig()) {
      try {
        const fetchPromise = getDocs(collection(db, 'invoices'))
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore invoices fetch timeout')), 3000)
        )
        const querySnapshot = await Promise.race([fetchPromise, timeoutPromise])
        const invoices = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        return NextResponse.json(invoices)
      } catch (dbErr) {
        console.warn("Firestore invoices fetch failed, falling back to local file:", dbErr)
      }
    }

    const invoices = await readLocalInvoices()
    return NextResponse.json(invoices)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pin, invoice } = body

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    if (!invoice || !invoice.leadId || !invoice.customerName || !invoice.items?.length) {
      return NextResponse.json({ error: 'Missing invoice data' }, { status: 400 })
    }

    // Read existing invoices to check length/generate auto invoice number
    let existingInvoices: Invoice[] = []
    if (hasFirebaseConfig()) {
      try {
        const snap = await getDocs(collection(db, 'invoices'))
        existingInvoices = snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice))
      } catch {}
    } else {
      existingInvoices = await readLocalInvoices()
    }

    // Auto-generate invoice number if not provided
    const nextNum = existingInvoices.length + 44 // starting offset to match SL/26-27/043 sequence
    const generatedInvoiceNo = invoice.invoiceNo || `SL/26-27/${String(nextNum).padStart(3, '0')}`
    const invoiceId = invoice.id || `inv-${Date.now()}`

    // Calculate/reverify totals
    let taxableSubtotal = 0
    let totalCOGS = 0

    const processedItems = invoice.items.map((item: InvoiceItem) => {
      const qty = Number(item.qty) || 0
      const costPrice = Number(item.costPrice) || 0
      const rate = Number(item.rate) || 0
      const amount = qty * rate
      const cgstRate = Number(item.cgstRate) || 0
      const sgstRate = Number(item.sgstRate) || 0
      const cgstAmount = (amount * cgstRate) / 100
      const sgstAmount = (amount * sgstRate) / 100

      taxableSubtotal += amount
      totalCOGS += qty * costPrice

      return {
        ...item,
        qty,
        costPrice,
        rate,
        amount,
        cgstRate,
        sgstRate,
        cgstAmount: Number(cgstAmount.toFixed(2)),
        sgstAmount: Number(sgstAmount.toFixed(2))
      }
    })

    // Apply overall discount
    let discountAmount = 0
    const discountVal = Number(invoice.discountValue) || 0
    if (invoice.discountType === 'percent') {
      discountAmount = (taxableSubtotal * discountVal) / 100
    } else if (invoice.discountType === 'flat') {
      discountAmount = discountVal
    }
    discountAmount = Number(discountAmount.toFixed(2))

    const finalTaxableValue = Number((taxableSubtotal - discountAmount).toFixed(2))

    // Recompute taxes based on the discounted value proportions
    // For simplicity and accuracy, we apply the discount proportionally to each item's taxable amount
    let totalCgst = 0
    let totalSgst = 0
    
    processedItems.forEach((item: InvoiceItem) => {
      // Proportional factor
      const proportion = taxableSubtotal > 0 ? item.amount / taxableSubtotal : 0
      const itemDiscount = discountAmount * proportion
      const itemTaxable = item.amount - itemDiscount
      
      item.cgstAmount = Number(((itemTaxable * item.cgstRate) / 100).toFixed(2))
      item.sgstAmount = Number(((itemTaxable * item.sgstRate) / 100).toFixed(2))
      
      totalCgst += item.cgstAmount
      totalSgst += item.sgstAmount
    })

    totalCgst = Number(totalCgst.toFixed(2))
    totalSgst = Number(totalSgst.toFixed(2))

    const rawTotal = finalTaxableValue + totalCgst + totalSgst
    const grandTotal = Math.round(rawTotal)
    const roundOff = Number((grandTotal - rawTotal).toFixed(2))

    const fullInvoice = {
      ...invoice,
      id: invoiceId,
      invoiceNo: generatedInvoiceNo,
      items: processedItems,
      discountAmount,
      taxableValue: finalTaxableValue,
      totalCgst,
      totalSgst,
      roundOff,
      totalAmount: grandTotal,
      totalCostPrice: totalCOGS,
      createdAt: invoice.createdAt || new Date().toISOString()
    }

    // Save Invoice & Update Lead Status in Firestore
    if (hasFirebaseConfig()) {
      try {
        // Save invoice
        const saveInvoicePromise = setDoc(doc(db, 'invoices', invoiceId), fullInvoice)
        
        // Update lead status to 'Billed'
        const leadRef = doc(db, 'consultations', String(invoice.leadId))
        const updateLeadPromise = updateDoc(leadRef, {
          status: 'Billed',
          invoiceNo: generatedInvoiceNo,
          installedAt: invoice.dated || new Date().toISOString().split('T')[0]
        })

        await Promise.all([saveInvoicePromise, updateLeadPromise])
        return NextResponse.json({ success: true, invoice: fullInvoice })
      } catch (dbErr) {
        console.warn("Firestore invoice save or lead update failed, falling back to local file:", dbErr)
      }
    }

    // Fallback: Save local files
    const localInvoices = await readLocalInvoices()
    localInvoices.push(fullInvoice)
    await writeLocalInvoices(localInvoices)

    const localConsultations = await readLocalConsultations()
    const leadIndex = localConsultations.findIndex(c => String(c.id) === String(invoice.leadId))
    if (leadIndex > -1) {
      localConsultations[leadIndex].status = 'Billed'
      localConsultations[leadIndex].invoiceNo = generatedInvoiceNo
      localConsultations[leadIndex].installedAt = invoice.dated || new Date().toISOString().split('T')[0]
      await writeLocalConsultations(localConsultations)
    }

    return NextResponse.json({ success: true, invoice: fullInvoice })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
