import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { doc, setDoc, writeBatch } from 'firebase/firestore'

const ADMIN_PIN = process.env.ADMIN_IMPORT_PIN || 'sundegreen2024'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pin, data } = body

    if (pin !== ADMIN_PIN) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    const results: Record<string, { success: boolean; count: number; error?: string }> = {}

    // ── siteConfig ──────────────────────────────────────────────────────────
    if (data.siteConfig) {
      try {
        await setDoc(doc(db, 'siteConfig', 'main'), data.siteConfig, { merge: true })
        results.siteConfig = { success: true, count: 1 }
      } catch (e) {
        results.siteConfig = { success: false, count: 0, error: String(e) }
      }
    }

    // ── stats (stored inside siteConfig) ────────────────────────────────────
    if (data.stats) {
      try {
        await setDoc(doc(db, 'siteConfig', 'main'), { stats: data.stats }, { merge: true })
        results.stats = { success: true, count: data.stats.length }
      } catch (e) {
        results.stats = { success: false, count: 0, error: String(e) }
      }
    }

    // ── services ─────────────────────────────────────────────────────────────
    if (data.services?.length) {
      try {
        const batch = writeBatch(db)
        data.services.forEach((item: Record<string, unknown>) => {
          const id = String(item.id || item.title)
          const ref = doc(db, 'services', id)
          batch.set(ref, item, { merge: true })
        })
        await batch.commit()
        results.services = { success: true, count: data.services.length }
      } catch (e) {
        results.services = { success: false, count: 0, error: String(e) }
      }
    }

    // ── projects ─────────────────────────────────────────────────────────────
    if (data.projects?.length) {
      try {
        const batch = writeBatch(db)
        data.projects.forEach((item: Record<string, unknown>) => {
          const id = String(item.id || item.title)
          const ref = doc(db, 'projects', id)
          batch.set(ref, item, { merge: true })
        })
        await batch.commit()
        results.projects = { success: true, count: data.projects.length }
      } catch (e) {
        results.projects = { success: false, count: 0, error: String(e) }
      }
    }

    // ── testimonials ─────────────────────────────────────────────────────────
    if (data.testimonials?.length) {
      try {
        const batch = writeBatch(db)
        data.testimonials.forEach((item: Record<string, unknown>) => {
          const id = String(item.id || item.name)
          const ref = doc(db, 'testimonials', id)
          batch.set(ref, item, { merge: true })
        })
        await batch.commit()
        results.testimonials = { success: true, count: data.testimonials.length }
      } catch (e) {
        results.testimonials = { success: false, count: 0, error: String(e) }
      }
    }

    // ── faqs ─────────────────────────────────────────────────────────────────
    if (data.faqs?.length) {
      try {
        const batch = writeBatch(db)
        data.faqs.forEach((item: Record<string, unknown>) => {
          const id = String(item.id || item.order)
          const ref = doc(db, 'faqs', id)
          batch.set(ref, item, { merge: true })
        })
        await batch.commit()
        results.faqs = { success: true, count: data.faqs.length }
      } catch (e) {
        results.faqs = { success: false, count: 0, error: String(e) }
      }
    }

    // ── blogPosts ─────────────────────────────────────────────────────────────
    if (data.blogPosts?.length) {
      try {
        const batch = writeBatch(db)
        data.blogPosts.forEach((item: Record<string, unknown>) => {
          const id = String(item.slug || item.title)
          const ref = doc(db, 'blogPosts', id)
          batch.set(ref, item, { merge: true })
        })
        await batch.commit()
        results.blogPosts = { success: true, count: data.blogPosts.length }
      } catch (e) {
        results.blogPosts = { success: false, count: 0, error: String(e) }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
