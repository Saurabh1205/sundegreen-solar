import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { doc, setDoc, writeBatch } from 'firebase/firestore'
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

async function saveLocalJson(filename: string, content: unknown) {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    await fs.mkdir(dataDir, { recursive: true })
    const filePath = path.join(dataDir, filename)
    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf8')
  } catch (err) {
    console.error(`Failed to save local JSON ${filename}:`, err)
  }
}

async function readLocalJson(filename: string): Promise<Record<string, unknown> | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', filename)
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

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
      let saved = false
      if (hasFirebaseConfig()) {
        try {
          const savePromise = setDoc(doc(db, 'siteConfig', 'main'), data.siteConfig, { merge: true })
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
          )
          await Promise.race([savePromise, timeoutPromise])
          saved = true
        } catch (e) {
          console.warn("Firestore siteConfig write failed, falling back to local storage:", e)
        }
      }
      await saveLocalJson('siteConfig.json', data.siteConfig)
      results.siteConfig = { success: true, count: 1 }
    }

    // ── stats (stored inside siteConfig) ────────────────────────────────────
    if (data.stats) {
      if (hasFirebaseConfig()) {
        try {
          const savePromise = setDoc(doc(db, 'siteConfig', 'main'), { stats: data.stats }, { merge: true })
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
          )
          await Promise.race([savePromise, timeoutPromise])
        } catch (e) {
          console.warn("Firestore stats write failed, falling back to local storage:", e)
        }
      }
      const existing = (await readLocalJson('siteConfig.json')) || {}
      await saveLocalJson('siteConfig.json', { ...existing, stats: data.stats })
      results.stats = { success: true, count: data.stats.length }
    }

    // ── services ─────────────────────────────────────────────────────────────
    if (data.services?.length) {
      if (hasFirebaseConfig()) {
        try {
          const batch = writeBatch(db)
          data.services.forEach((item: Record<string, unknown>) => {
            const id = String(item.id || item.title)
            const ref = doc(db, 'services', id)
            batch.set(ref, item, { merge: true })
          })
          const commitPromise = batch.commit()
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
          )
          await Promise.race([commitPromise, timeoutPromise])
        } catch (e) {
          console.warn("Firestore services write failed, falling back to local storage:", e)
        }
      }
      await saveLocalJson('services.json', data.services)
      results.services = { success: true, count: data.services.length }
    }

    // ── projects ─────────────────────────────────────────────────────────────
    if (data.projects?.length) {
      if (hasFirebaseConfig()) {
        try {
          const batch = writeBatch(db)
          data.projects.forEach((item: Record<string, unknown>) => {
            const id = String(item.id || item.title)
            const ref = doc(db, 'projects', id)
            batch.set(ref, item, { merge: true })
          })
          const commitPromise = batch.commit()
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
          )
          await Promise.race([commitPromise, timeoutPromise])
        } catch (e) {
          console.warn("Firestore projects write failed, falling back to local storage:", e)
        }
      }
      await saveLocalJson('projects.json', data.projects)
      results.projects = { success: true, count: data.projects.length }
    }

    // ── testimonials ─────────────────────────────────────────────────────────
    if (data.testimonials?.length) {
      if (hasFirebaseConfig()) {
        try {
          const batch = writeBatch(db)
          data.testimonials.forEach((item: Record<string, unknown>) => {
            const id = String(item.id || item.name)
            const ref = doc(db, 'testimonials', id)
            batch.set(ref, item, { merge: true })
          })
          const commitPromise = batch.commit()
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
          )
          await Promise.race([commitPromise, timeoutPromise])
        } catch (e) {
          console.warn("Firestore testimonials write failed, falling back to local storage:", e)
        }
      }
      await saveLocalJson('testimonials.json', data.testimonials)
      results.testimonials = { success: true, count: data.testimonials.length }
    }

    // ── faqs ─────────────────────────────────────────────────────────────────
    if (data.faqs?.length) {
      if (hasFirebaseConfig()) {
        try {
          const batch = writeBatch(db)
          data.faqs.forEach((item: Record<string, unknown>) => {
            const id = String(item.id || item.order)
            const ref = doc(db, 'faqs', id)
            batch.set(ref, item, { merge: true })
          })
          const commitPromise = batch.commit()
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
          )
          await Promise.race([commitPromise, timeoutPromise])
        } catch (e) {
          console.warn("Firestore faqs write failed, falling back to local storage:", e)
        }
      }
      await saveLocalJson('faqs.json', data.faqs)
      results.faqs = { success: true, count: data.faqs.length }
    }

    // ── blogPosts ─────────────────────────────────────────────────────────────
    if (data.blogPosts?.length) {
      if (hasFirebaseConfig()) {
        try {
          const batch = writeBatch(db)
          data.blogPosts.forEach((item: Record<string, unknown>) => {
            const id = String(item.slug || item.title)
            const ref = doc(db, 'blogPosts', id)
            batch.set(ref, item, { merge: true })
          })
          const commitPromise = batch.commit()
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore write timeout')), 3000)
          )
          await Promise.race([commitPromise, timeoutPromise])
        } catch (e) {
          console.warn("Firestore blogPosts write failed, falling back to local storage:", e)
        }
      }
      await saveLocalJson('blogPosts.json', data.blogPosts)
      results.blogPosts = { success: true, count: data.blogPosts.length }
    }

    return NextResponse.json({ success: true, results })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

