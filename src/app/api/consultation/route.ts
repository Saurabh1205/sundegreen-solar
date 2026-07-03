import { db } from '../../../lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { promises as fs } from 'fs'
import path from 'path'

interface ConsultationEntry {
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
}

// Check if Firebase variables are set up
const hasFirebaseConfig = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "sundegreen-solar"
  )
}

function calculateLeadPriority(billStr: string | null): string {
  if (!billStr) return 'Low Priority'
  const clean = billStr.replace(/[₹,]/g, '').trim()
  const numbers = clean.match(/\d+/g)
  if (!numbers || numbers.length === 0) return 'Low Priority'

  let numericBill = 0
  if (numbers.length === 2) {
    const num1 = parseInt(numbers[0])
    const num2 = parseInt(numbers[1])
    numericBill = (num1 + num2) / 2
  } else {
    numericBill = parseInt(numbers[0])
  }

  if (numericBill < 3000) {
    return 'Low Priority'
  } else if (numericBill >= 3000 && numericBill < 7000) {
    return 'High Priority'
  } else {
    return 'Very High Priority'
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, whatsapp, email, pincode, bill, serviceType, message, suggestedKw, brand, quotePrice, source } = body
    if (!name || !whatsapp) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const leadPriority = calculateLeadPriority(bill)

    const entryData = {
      name,
      whatsapp,
      email: email || null,
      pincode: pincode || null,
      bill: bill || null,
      serviceType: serviceType || null,
      message: message || null,
      suggestedKw: suggestedKw ? Number(suggestedKw) : null,
      brand: brand || null,
      quotePrice: quotePrice ? Number(quotePrice) : null,
      leadPriority,
      source: source || 'Direct',
      inspectionDetails: null,
      status: 'Pending',
      invoiceNo: null,
      installedAt: null,
      projectDetails: null,
      createdAt: new Date().toISOString()
    }

    if (hasFirebaseConfig()) {
      try {
        const firestorePromise = addDoc(collection(db, 'consultations'), {
          ...entryData,
          serverTime: serverTimestamp()
        })
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
        )
        const docRef = await Promise.race([firestorePromise, timeoutPromise])
        return new Response(JSON.stringify({ ok: true, id: docRef.id, source: 'firestore' }), { status: 200 })
      } catch (dbErr) {
        const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr)
        console.warn("Firestore save failed or timed out, falling back to local file storage:", errMsg)
      }
    }

    // Fallback: Local JSON file storage
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'consultations.json')

    await fs.mkdir(dataDir, { recursive: true })

    let existing: ConsultationEntry[] = []
    try {
      const raw = await fs.readFile(filePath, 'utf8')
      existing = JSON.parse(raw || '[]')
    } catch (e) {
      existing = []
    }

    const entry: ConsultationEntry = {
      id: Date.now(),
      ...entryData
    }

    existing.push(entry)
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8')

    return new Response(JSON.stringify({ ok: true, id: entry.id, source: 'localfile' }), { status: 200 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}

export async function GET() {
  try {
    if (hasFirebaseConfig()) {
      try {
        const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'))
        const fetchPromise = getDocs(q)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore fetch timeout')), 3000)
        )
        const querySnapshot = await Promise.race([fetchPromise, timeoutPromise])
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        return new Response(JSON.stringify(data), { status: 200 })
      } catch (dbErr) {
        const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr)
        console.warn("Firestore fetch failed or timed out, falling back to local file:", errMsg)
      }
    }

    // Fallback: Local file load
    const filePath = path.join(process.cwd(), 'data', 'consultations.json')
    const raw = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(raw || '[]')
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify([]), { status: 200 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { leadId, inspectionDetails, status, invoiceNo, installedAt, projectDetails } = body

    if (!leadId) {
      return new Response(JSON.stringify({ error: 'Missing leadId' }), { status: 400 })
    }

    const updateData: any = {}

    if (inspectionDetails) {
      const { preferredDate, preferredTime, address, landmark } = inspectionDetails
      if (!preferredDate || !preferredTime || !address) {
        return new Response(JSON.stringify({ error: 'Missing inspection required fields' }), { status: 400 })
      }
      updateData.inspectionDetails = {
        preferredDate,
        preferredTime,
        address,
        landmark: landmark || null
      }
      if (status === undefined) {
        updateData.status = 'SurveyScheduled'
      }
    }

    if (status !== undefined) {
      updateData.status = status
    }
    if (invoiceNo !== undefined) {
      updateData.invoiceNo = invoiceNo
    }
    if (installedAt !== undefined) {
      updateData.installedAt = installedAt
    }
    if (projectDetails !== undefined) {
      updateData.projectDetails = projectDetails
    }


    if (hasFirebaseConfig()) {
      try {
        const docRef = doc(db, 'consultations', String(leadId))
        const updatePromise = updateDoc(docRef, updateData)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore update timeout')), 3000)
        )
        await Promise.race([updatePromise, timeoutPromise])
        return new Response(JSON.stringify({ ok: true, source: 'firestore', data: updateData }), { status: 200 })
      } catch (dbErr) {
        const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr)
        console.warn("Firestore update failed or timed out, falling back to local file storage:", errMsg)
      }
    }

    // Fallback: Local JSON file storage update
    const filePath = path.join(process.cwd(), 'data', 'consultations.json')
    let existing: ConsultationEntry[] = []
    try {
      const raw = await fs.readFile(filePath, 'utf8')
      existing = JSON.parse(raw || '[]')
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Local data file not found' }), { status: 404 })
    }

    const index = existing.findIndex(entry => String(entry.id) === String(leadId))
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), { status: 404 })
    }

    existing[index] = {
      ...existing[index],
      ...updateData
    }
    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8')

    return new Response(JSON.stringify({ ok: true, source: 'localfile', data: updateData }), { status: 200 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
