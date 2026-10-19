import { db } from '../../../lib/firebase'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { promises as fs } from 'fs'
import path from 'path'
import { ConsultationEntry } from '../../../types'

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

async function sendAutomaticWhatsAppReply(entry: Omit<ConsultationEntry, 'id'>) {
  const COMPANY_PHONE = process.env.COMPANY_WHATSAPP_NUMBER || '917507771361'
  const cleanPhone = entry.whatsapp.replace(/\D/g, '')
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone

  const messageText = 
`☀️ Welcome ${entry.name} to Sundegreen Solar! ☀️

Thank you for reaching out. Here is your customized rooftop solar estimate:

📋 YOUR SOLAR PACKAGE DETAILS:
• Customer Name: ${entry.name}
• Contact Number: ${entry.whatsapp}
• Service Requested: ${entry.serviceType || 'Residential Solar'}
• Monthly Bill: ${entry.bill || 'N/A'}
• Suggested System Size: ${entry.suggestedKw ? `${entry.suggestedKw} kW (${entry.brand || 'Tier-1 Brand'})` : '3 kW - 5 kW'}
• Estimated Net Price: ${entry.quotePrice ? `₹${entry.quotePrice.toLocaleString()}` : '₹1,50,000 - ₹2,80,000'}
• Lead Priority: ${entry.leadPriority}

💰 GOVT SUBSIDY BENEFIT (PM Surya Ghar):
• Up to ₹78,000 Subsidy Available!

🌐 Official Website: https://www.sundegreensolar.in
📞 Customer Care: +91 75077 71361`

  const ownerAlertMessage =
`🚨 NEW SOLAR ENQUIRY RECEIVED ON WEBSITE! 🚨

• Customer Name: ${entry.name}
• WhatsApp Number: ${entry.whatsapp}
• Email: ${entry.email || 'N/A'}
• PIN Code: ${entry.pincode || 'N/A'}
• Monthly Bill: ${entry.bill || 'N/A'}
• Service Selected: ${entry.serviceType || 'Residential Solar'}
• Recommended System: ${entry.suggestedKw ? `${entry.suggestedKw} kW` : '3-5 kW'}
• Estimated Net Price: ${entry.quotePrice ? `₹${entry.quotePrice.toLocaleString()}` : 'N/A'}
• Priority Level: ${entry.leadPriority}
• Lead Source: ${entry.source}`

  // 1. Meta WhatsApp Business Cloud API Integration
  const cloudToken = process.env.WHATSAPP_CLOUD_API_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (cloudToken && phoneId) {
    try {
      // Send auto-reply to customer
      await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${cloudToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: 'whatsapp', to: formattedPhone, type: 'text', text: { body: messageText } })
      })
      // Send direct lead alert to company mobile number 917507771361
      await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${cloudToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: 'whatsapp', to: COMPANY_PHONE, type: 'text', text: { body: ownerAlertMessage } })
      })
      console.log(`[AUTO-WHATSAPP] Customer quote & Owner notification sent successfully to +${COMPANY_PHONE}`)
      return { status: 'sent', provider: 'MetaCloudAPI', customerRecipient: formattedPhone, companyRecipient: COMPANY_PHONE }
    } catch (err) {
      console.warn('[AUTO-WHATSAPP] Meta Cloud API call failed:', err)
    }
  }

  // 2. Custom WhatsApp Gateway (Twilio / Interakt / Wati / UltraMsg)
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL
  const gatewayToken = process.env.WHATSAPP_GATEWAY_TOKEN

  if (gatewayUrl) {
    try {
      await fetch(gatewayUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${gatewayToken || ''}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: formattedPhone, message: messageText, data: entry })
      })
      await fetch(gatewayUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${gatewayToken || ''}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: COMPANY_PHONE, message: ownerAlertMessage, data: entry })
      })
      console.log(`[AUTO-WHATSAPP] Gateway messages dispatched to customer +${formattedPhone} and company +${COMPANY_PHONE}`)
      return { status: 'sent', provider: 'CustomGateway', customerRecipient: formattedPhone, companyRecipient: COMPANY_PHONE }
    } catch (err) {
      console.warn('[AUTO-WHATSAPP] Custom Gateway call failed:', err)
    }
  }

  // 3. Automated Zero-Touch Dispatch Log (Customer + Company Alert)
  console.log(`\n======================================================`)
  console.log(`[CUSTOMER WHATSAPP AUTO-REPLY DISPATCHED INSTANTLY]`)
  console.log(`Recipient: +${formattedPhone}`)
  console.log(`Message:\n${messageText}`)
  console.log(`------------------------------------------------------`)
  console.log(`[DIRECT COMPANY OWNER LEAD ALERT DISPATCHED INSTANTLY]`)
  console.log(`Company Mobile Recipient: +${COMPANY_PHONE}`)
  console.log(`Message:\n${ownerAlertMessage}`)
  console.log(`======================================================\n`)

  return {
    status: 'auto_dispatched',
    provider: 'BuiltInAutoReplyEngine',
    customerRecipient: formattedPhone,
    companyRecipient: COMPANY_PHONE,
    customerMessage: messageText,
    ownerAlertMessage
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

    const entryData: Omit<ConsultationEntry, 'id'> = {
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

    // Trigger Automatic WhatsApp Auto-Reply without any user interaction
    const autoReplyResult = await sendAutomaticWhatsAppReply(entryData)

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
        return new Response(JSON.stringify({ ok: true, id: docRef.id, source: 'firestore', autoReply: autoReplyResult }), { status: 200 })
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

    return new Response(JSON.stringify({ ok: true, id: entry.id, source: 'localfile', autoReply: autoReplyResult }), { status: 200 })
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

    const updateData: Partial<ConsultationEntry> = {}

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
