import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PIN = process.env.ADMIN_IMPORT_PIN || 'sundegreen2024'

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json()
    if (pin === ADMIN_PIN) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ success: false, error: 'Invalid PIN' }, { status: 401 })
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 })
  }
}
