import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { CatalogItem } from '../../../../types'
import { promises as fs } from 'fs'
import path from 'path'

const ADMIN_PIN = process.env.ADMIN_IMPORT_PIN || 'sundegreen2024'

const defaultCatalog = [
  { id: 'solar-panel', name: 'Solar Panel', hsn: '85414012', costPrice: 12000.00, rate: 14450.00, per: 'NOS', cgstRate: 2.5, sgstRate: 2.5 },
  { id: 'solar-inverter', name: 'SOLAR INVERTER', hsn: '85044090', costPrice: 9500.00, rate: 11950.00, per: 'NOS', cgstRate: 2.5, sgstRate: 2.5 },
  { id: 'base-plate', name: 'BASE PLATE', hsn: '72109010', costPrice: 200.00, rate: 260.00, per: 'KGS', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'gi-tube', name: 'GI TUBE', hsn: '730619', costPrice: 110.00, rate: 141.67, per: 'KGS', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'electric-item', name: 'ELECTRIC ITEM', hsn: '39172310', costPrice: 800.00, rate: 1020.00, per: 'NOS', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'labour-charges', name: 'LABOUR CHARGES', hsn: '995421', costPrice: 0.00, rate: 3500.00, per: 'NOS', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'dcdb-2-in-2-out', name: 'DCDB - 2 IN 2 OUT', hsn: '85371000', costPrice: 3500.00, rate: 4500.00, per: 'NOS', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'acdb-1-phase-3kw', name: 'ACDB – SINGAL PHASE SYSTEM(3 KW)', hsn: '85371000', costPrice: 4200.00, rate: 5500.00, per: 'NOS', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'cable-ac-4mm', name: '4 SQ. MM 2 CORE AC CABLE – (POLYCAB)', hsn: '74130000', costPrice: 60.00, rate: 80.00, per: 'MTR', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'cable-earthing-16mm', name: '16 SQ. MM EARTHING CABLE', hsn: '74130000', costPrice: 90.00, rate: 120.00, per: 'MTR', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'cable-dc-4mm', name: '4 SQ MM 2 CORE DC CABLE (POLYCAB)', hsn: '74130000', costPrice: 70.00, rate: 90.00, per: 'MTR', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'earthing-rod-chemical', name: 'Earthling Rod with Chemical Bag', hsn: '85359090', costPrice: 1400.00, rate: 1800.00, per: 'NOS', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'gi-structure-hot-dip', name: 'GI Structure Hot Dip', hsn: '73089090', costPrice: 12000.00, rate: 15000.00, per: 'SET', cgstRate: 9.0, sgstRate: 9.0 },
  { id: 'electric-accessories', name: 'Electric Accessories', hsn: '85389090', costPrice: 1000.00, rate: 1500.00, per: 'SET', cgstRate: 9.0, sgstRate: 9.0 }
]

const hasFirebaseConfig = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "sundegreen-solar"
  )
}

// Helper to load catalog from JSON fallback
async function readLocalCatalog(): Promise<CatalogItem[]> {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'catalog.json')
  try {
    await fs.mkdir(dataDir, { recursive: true })
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw || '[]')
    if (parsed.length === 0) {
      await fs.writeFile(filePath, JSON.stringify(defaultCatalog, null, 2), 'utf8')
      return defaultCatalog
    }
    return parsed
  } catch (e) {
    try {
      await fs.writeFile(filePath, JSON.stringify(defaultCatalog, null, 2), 'utf8')
    } catch {}
    return defaultCatalog
  }
}

// Helper to write catalog to JSON fallback
async function writeLocalCatalog(data: CatalogItem[]) {
  const dataDir = path.join(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'catalog.json')
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function GET() {
  try {
    if (hasFirebaseConfig()) {
      try {
        const fetchPromise = getDocs(collection(db, 'catalog'))
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore catalog fetch timeout')), 3000)
        )
        const querySnapshot = await Promise.race([fetchPromise, timeoutPromise])
        
        if (querySnapshot.empty) {
          // If Firestore is empty, pre-populate it with defaults
          for (const item of defaultCatalog) {
            await setDoc(doc(db, 'catalog', item.id), item)
          }
          return NextResponse.json(defaultCatalog)
        }

        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        return NextResponse.json(items)
      } catch (dbErr) {
        console.warn("Firestore catalog fetch failed or timed out, falling back to local file:", dbErr)
      }
    }

    const items = await readLocalCatalog()
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pin, item } = body

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    if (!item || !item.name) {
      return NextResponse.json({ error: 'Missing item data' }, { status: 400 })
    }

    const itemId = item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const updatedItem = {
      ...item,
      id: itemId,
      costPrice: Number(item.costPrice) || 0,
      rate: Number(item.rate) || 0,
      cgstRate: Number(item.cgstRate) || 0,
      sgstRate: Number(item.sgstRate) || 0
    }

    if (hasFirebaseConfig()) {
      try {
        const savePromise = setDoc(doc(db, 'catalog', itemId), updatedItem, { merge: true })
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore catalog write timeout')), 3000)
        )
        await Promise.race([savePromise, timeoutPromise])
        return NextResponse.json({ success: true, item: updatedItem })
      } catch (dbErr) {
        console.warn("Firestore catalog save failed, falling back to local file:", dbErr)
      }
    }

    const items = await readLocalCatalog()
    const index = items.findIndex(i => i.id === itemId)
    if (index > -1) {
      items[index] = { ...items[index], ...updatedItem }
    } else {
      items.push(updatedItem)
    }
    await writeLocalCatalog(items)

    return NextResponse.json({ success: true, item: updatedItem })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const itemId = url.searchParams.get('id')
    const pin = url.searchParams.get('pin')

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    if (!itemId) {
      return NextResponse.json({ error: 'Missing item ID' }, { status: 400 })
    }

    if (hasFirebaseConfig()) {
      try {
        const deletePromise = deleteDoc(doc(db, 'catalog', itemId))
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore catalog delete timeout')), 3000)
        )
        await Promise.race([deletePromise, timeoutPromise])
        return NextResponse.json({ success: true })
      } catch (dbErr) {
        console.warn("Firestore catalog delete failed, falling back to local file:", dbErr)
      }
    }

    const items = await readLocalCatalog()
    const filtered = items.filter(i => i.id !== itemId)
    await writeLocalCatalog(filtered)

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
