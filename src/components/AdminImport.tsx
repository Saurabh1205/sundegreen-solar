'use client'
import { useState, useRef, useEffect } from 'react'
import * as XLSX from 'xlsx'

type ImportResult = {
  success: boolean
  count: number
  error?: string
}

type ParsedData = {
  siteConfig?: Record<string, unknown>
  stats?: Record<string, unknown>[]
  services?: Record<string, unknown>[]
  projects?: Record<string, unknown>[]
  testimonials?: Record<string, unknown>[]
  faqs?: Record<string, unknown>[]
  blogPosts?: Record<string, unknown>[]
}

function sheetToRows(ws: XLSX.WorkSheet): Record<string, unknown>[] {
  return XLSX.utils.sheet_to_json(ws, { defval: '' })
}

export function AdminImport({ adminPin, isTab = false }: { adminPin?: string; isTab?: boolean }) {
  const [pin, setPin] = useState(adminPin || '')
  const [authenticated, setAuthenticated] = useState(!!adminPin)

  useEffect(() => {
    if (adminPin) {
      setPin(adminPin)
      setAuthenticated(true)
    }
  }, [adminPin])

  const [pinError, setPinError] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [parsed, setParsed] = useState<ParsedData | null>(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<Record<string, ImportResult> | null>(null)
  const [parseError, setParseError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length < 4) {
      setPinError('Enter your admin PIN')
      return
    }
    setAuthenticated(true)
    setPinError('')
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setParsed(null)
    setResults(null)
    setParseError('')

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })

        const result: ParsedData = {}

        if (wb.SheetNames.includes('SiteConfig')) {
          const rows = sheetToRows(wb.Sheets['SiteConfig']) as { key: string; value: unknown }[]
          const cfg: Record<string, unknown> = {}
          rows.forEach(r => { if (r.key) cfg[String(r.key)] = r.value })
          result.siteConfig = cfg
        }

        if (wb.SheetNames.includes('Stats')) {
          result.stats = sheetToRows(wb.Sheets['Stats']).map(r => ({
            ...r,
            value: Number(r.value) || 0,
          }))
        }

        if (wb.SheetNames.includes('Services')) {
          result.services = sheetToRows(wb.Sheets['Services'])
        }

        if (wb.SheetNames.includes('Projects')) {
          result.projects = sheetToRows(wb.Sheets['Projects']).map(r => ({
            ...r,
            capacityKW: Number(r.capacityKW) || 0,
            savingsAnnual: Number(r.savingsAnnual) || 0,
          }))
        }

        if (wb.SheetNames.includes('Testimonials')) {
          result.testimonials = sheetToRows(wb.Sheets['Testimonials']).map(r => ({
            ...r,
            rating: Number(r.rating) || 5,
          }))
        }

        if (wb.SheetNames.includes('FAQs')) {
          result.faqs = sheetToRows(wb.Sheets['FAQs']).map(r => ({
            ...r,
            order: Number(r.order) || 0,
          }))
        }

        if (wb.SheetNames.includes('BlogPosts')) {
          result.blogPosts = sheetToRows(wb.Sheets['BlogPosts'])
        }

        setParsed(result)
      } catch (err) {
        setParseError('Failed to parse Excel file. Make sure it is a valid .xlsx file.')
        console.error(err)
      }
    }
    reader.readAsArrayBuffer(f)
  }

  async function handleImport() {
    if (!parsed) return
    setImporting(true)
    setResults(null)
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: parsed }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(json.error || 'Import failed')
      } else {
        setResults(json.results)
      }
    } catch (err) {
      alert('Network error: ' + err)
    } finally {
      setImporting(false)
    }
  }

  const collectionLabels: Record<string, string> = {
    siteConfig: '⚙️ Site Config',
    stats: '📊 Stats',
    services: '🔧 Services',
    projects: '🏗️ Projects',
    testimonials: '💬 Testimonials',
    faqs: '❓ FAQs',
    blogPosts: '📝 Blog Posts',
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-sm border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-white">Admin Import</h1>
            <p className="text-green-300 text-sm mt-1">Sundegreen Solar CMS</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
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
              Enter
            </button>
          </form>
        </div>
      </main>
    )
  }

  const content = (
    <>
      {!isTab && (
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🌞</div>
            <div>
              <h1 className="text-3xl font-bold">Sundegreen Solar CMS</h1>
              <p className="text-green-100 mt-1">Upload your Excel sheet to update all website content</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 mb-6 shadow border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
          Download the Excel Template
        </h2>
        <p className="text-gray-600 text-sm mb-4">Use this template to fill in your content. Each tab corresponds to a section of the website.</p>
        <a
          href="/sundegreen-cms-template.xlsx"
          download
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
        >
          📥 Download Template (.xlsx)
        </a>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 shadow border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
          Upload Your Filled Excel Sheet
        </h2>
        <div
          className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-4xl mb-3">📂</div>
          <p className="text-gray-700 font-medium">{file ? file.name : 'Click to select your .xlsx file'}</p>
          <p className="text-gray-400 text-sm mt-1">Only .xlsx files are supported</p>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {parseError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{parseError}</div>
        )}
      </div>

      {parsed && (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Preview & Import
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {Object.entries(parsed).map(([key, val]) => {
              const count = Array.isArray(val) ? val.length : (val ? 1 : 0)
              return (
                <div key={key} className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">{collectionLabels[key]?.split(' ')[0] ?? '📄'}</div>
                  <div className="font-semibold text-gray-900 text-sm">{collectionLabels[key]?.split(' ').slice(1).join(' ') ?? key}</div>
                  <div className="text-green-600 text-xs font-bold mt-1">{count} {count === 1 ? 'record' : 'records'}</div>
                </div>
              )
            })}
          </div>

          <button
            onClick={handleImport}
            disabled={importing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 hover:scale-[1.01] shadow-lg"
          >
            {importing ? '⏳ Importing to Firebase...' : '🚀 Import to Firebase'}
          </button>
        </div>
      )}

      {results && (
        <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">✅ Import Results</h2>
          <div className="space-y-2">
            {Object.entries(results).map(([key, res]) => (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-xl ${res.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <span className="font-medium text-gray-800">{collectionLabels[key] ?? key}</span>
                <span className={`text-sm font-semibold ${res.success ? 'text-green-700' : 'text-red-600'}`}>
                  {res.success ? `✓ ${res.count} imported` : `✗ ${res.error}`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800 text-sm font-medium">
              🌐 Website will reflect changes within 60 seconds automatically.
            </p>
          </div>
        </div>
      )}
    </>
  )

  if (isTab) {
    return <div className="py-2">{content}</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {content}
      </div>
    </main>
  )
}
