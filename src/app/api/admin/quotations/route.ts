import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore'
import { Quotation } from '../../../../types'
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

// Local file helpers for Quotations
async function readLocalQuotations(): Promise<Quotation[]> {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'quotations.json')
  try {
    await fs.mkdir(dataDir, { recursive: true })
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

async function writeLocalQuotations(data: Quotation[]) {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'quotations.json')
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function GET() {
  try {
    if (hasFirebaseConfig()) {
      try {
        const fetchPromise = getDocs(collection(db, 'quotations'))
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore quotations fetch timeout')), 3000)
        )
        const querySnapshot = await Promise.race([fetchPromise, timeoutPromise])
        const quotations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        return NextResponse.json(quotations)
      } catch (dbErr) {
        console.warn("Firestore quotations fetch failed, falling back to local file:", dbErr)
      }
    }

    const quotations = await readLocalQuotations()
    return NextResponse.json(quotations)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pin, quotation } = body

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    if (!quotation || !quotation.customerName || !quotation.customerPhone || !quotation.items?.length) {
      return NextResponse.json({ error: 'Missing quotation data' }, { status: 400 })
    }

    // Read existing quotations to compute sequential Reference No
    let existingQuotations: Quotation[] = []
    if (hasFirebaseConfig()) {
      try {
        const snap = await getDocs(collection(db, 'quotations'))
        existingQuotations = snap.docs.map(d => ({ id: d.id, ...d.data() } as Quotation))
      } catch {}
    } else {
      existingQuotations = await readLocalQuotations()
    }

    // Generate reference number (starts from 216 offset to match quotation PDF)
    const nextRef = existingQuotations.length + 216
    const generatedRefNo = quotation.refNo || String(nextRef)
    const quoteId = quotation.id || `quote-${Date.now()}`

    const fullQuotation = {
      ...quotation,
      id: quoteId,
      refNo: generatedRefNo,
      createdAt: quotation.createdAt || new Date().toISOString()
    }

    if (hasFirebaseConfig()) {
      try {
        await setDoc(doc(db, 'quotations', quoteId), fullQuotation)
        return NextResponse.json({ success: true, quotation: fullQuotation })
      } catch (dbErr) {
        console.warn("Firestore quotation save failed, falling back to local file:", dbErr)
      }
    }

    // Fallback: Save local files
    const localQuotes = await readLocalQuotations()
    localQuotes.push(fullQuotation)
    await writeLocalQuotations(localQuotes)

    return NextResponse.json({ success: true, quotation: fullQuotation })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
