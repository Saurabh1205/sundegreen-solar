'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Printer, ArrowLeft } from 'lucide-react'

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

export default function QuotationPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const res = await fetch('/api/admin/quotations')
        if (res.ok) {
          const quotes: Quotation[] = await res.json()
          const matched = quotes.find(q => q.id === id || q.refNo === id)
          if (matched) {
            setQuotation(matched)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuotation()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500 font-sans">
        <div className="text-center">
          <span className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="mt-3 text-sm">Loading Quotation...</p>
        </div>
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500 font-sans">
        <div className="text-center">
          <p className="font-bold text-lg">Quotation Not Found</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6 px-4 font-sans text-xs text-gray-900 leading-normal">
      {/* Floating Action Bar - Hidden on print */}
      <div className="max-w-[800px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm no-print">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-semibold transition"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow transition"
        >
          <Printer size={16} /> Print Quotation (PDF)
        </button>
      </div>

      <div className="w-full overflow-x-auto no-print-scroll">
        {/* Invoice Container - Styled to fit on standard A4 page */}
        <div className="min-w-[760px] max-w-[800px] mx-auto bg-white border border-gray-300 p-4 sm:p-8 shadow-md print:shadow-none print:border-none print:p-0 space-y-6">
        
        {/* Shree Krishan line */}
        <div className="text-center text-[10px] font-bold text-red-700 uppercase tracking-widest italic">
          || SHRI KRISHAN ||
        </div>

        {/* Company Header */}
        <div className="text-center space-y-1">
          <div className="font-black text-2xl tracking-tight text-gray-950 uppercase">SUN DEGREEN SOLAR</div>
          <div className="text-red-700 font-bold border-y border-red-700 py-1 uppercase tracking-wider text-sm">
            Quotation
          </div>
          <div className="text-[10px] font-bold text-gray-600 mt-1">
            GST NO-27DAWPC6210F1ZQ
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-red-700 p-4 rounded-lg bg-red-50/20 text-xs font-semibold">
          {/* Customer */}
          <div className="space-y-1.5">
            <div className="text-red-800 font-bold uppercase text-[10px] tracking-wider">To,</div>
            <div className="text-sm font-black text-gray-950 uppercase">{quotation.customerName}</div>
            <div className="text-gray-700 flex items-center gap-1">
              <span>Mobile:</span> {quotation.customerPhone}
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-1 text-gray-700 leading-tight">
            <div><span className="font-bold text-red-800">Reference No:</span> {quotation.refNo}</div>
            <div><span className="font-bold text-red-800">Quotation Date:</span> {quotation.date}</div>
            <div><span className="font-bold text-red-800">Quotation By:</span> NARESH F CHACHERKAR</div>
            <div className="text-[9px] text-gray-500 font-medium mt-1 leading-normal">
              Office - H NO-933/V/39, GANGABAI GHAT ROAD, NEAR DR. BABASAHEB AMBEDKAR STATUE, CHITNAVISPURA, MAHAL, Nagpur – 440032
            </div>
          </div>
        </div>

        {/* Warm Greetings */}
        <div className="space-y-2 leading-relaxed">
          <p className="font-bold text-gray-800">Dear Sir,</p>
          <p className="font-medium text-gray-700 italic">
            We thanks to you for giving us chance to submit our offer for your requirement, please find here our best offer for the same.
          </p>
        </div>

        {/* Project Capacity Header */}
        <div className="bg-green-700 text-white font-black text-center text-sm py-2 rounded uppercase tracking-wider">
          {quotation.capacity}
        </div>

        {/* Goods Table */}
        <table className="w-full border border-green-700/30 border-collapse">
          <thead>
            <tr className="bg-green-700 text-white font-bold text-left border-b border-green-700 divide-x divide-green-600">
              <th className="p-2 w-12 text-center text-xs">Sr no</th>
              <th className="p-2 text-xs">Product Name</th>
              <th className="p-2 text-xs w-40">Model</th>
              <th className="p-2 text-xs w-28 text-center">Qty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-700/20 divide-x divide-green-700/20 font-semibold text-gray-800 bg-green-50/10">
            {quotation.items.map((item, idx) => (
              <tr key={idx} className="divide-x divide-green-700/20 hover:bg-green-50/20">
                <td className="p-2.5 text-center text-green-800">{idx + 1}</td>
                <td className="p-2.5">{item.name}</td>
                <td className="p-2.5 text-green-950">{item.model}</td>
                <td className="p-2.5 text-center text-green-900 font-bold">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pricing Offer details */}
        <div className="space-y-4">
          <div className="border border-green-700/30 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-green-700/10 font-bold border-b border-green-700/30 p-2 text-center text-green-800 uppercase tracking-wider text-[10px]">
              Offer Details
            </div>
            
            <table className="w-full text-xs font-semibold">
              <tbody className="divide-y divide-green-700/10">
                <tr className="bg-green-50/30">
                  <td className="p-3 text-gray-600">Total Cost of Project / Products (Including GST):</td>
                  <td className="p-3 text-right text-gray-900 font-black">₹{quotation.totalCost.toLocaleString()}/-</td>
                </tr>
                <tr>
                  <td className="p-3 text-gray-600">Basic Total:</td>
                  <td className="p-3 text-right text-gray-900 font-bold">₹{quotation.totalCost.toLocaleString()}/-</td>
                </tr>
                <tr className="bg-green-50/30">
                  <td className="p-3 text-gray-600">Rounded By:</td>
                  <td className="p-3 text-right text-gray-400">—</td>
                </tr>
                <tr className="border-t border-green-700/30 bg-green-700/10 font-black text-sm text-green-900">
                  <td className="p-3 uppercase">Final Amount to Pay:</td>
                  <td className="p-3 text-right">₹{quotation.totalCost.toLocaleString()}/-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Government Subsidy Notice */}
          <div className="border-2 border-dashed border-orange-500 rounded-lg p-3.5 text-center bg-orange-50/50 font-black text-xs text-orange-950 uppercase tracking-wide">
            Govt. to be Credit on Our A/C Subsidy-₹{quotation.govtSubsidy.toLocaleString()}/-
          </div>
        </div>

        {/* PAGE BREAK FOR T&C PAGE */}
        <div className="page-break" />

        {/* PAGE 2: Terms & Conditions */}
        <div className="pt-6 space-y-6">
          <div className="text-center font-bold text-sm border-b border-gray-300 pb-2 uppercase tracking-wide">
            SUN DEGREEN SOLAR
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-red-700 uppercase tracking-wider text-xs border-b border-red-200 pb-1">
              Terms & Conditions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs leading-relaxed font-semibold text-gray-800">
              <div>
                <span className="font-bold text-gray-400">Taxes:</span><br />
                Included in Above Offer
              </div>
              
              <div>
                <span className="font-bold text-gray-400">Transportation:</span><br />
                Including up to nearest warehouse
              </div>

              <div>
                <span className="font-bold text-gray-400">Warranty Terms (Solar Panel):</span><br />
                25 Years Manufacturer&apos;s Performance Warranty. No Warranty for Physical Damage.
              </div>

              <div>
                <span className="font-bold text-gray-400">Warranty Terms (Solar Inverter):</span><br />
                10 Years Manufacturer&apos;s Warranty. No warranty will be Entertained on Physical Damage.
              </div>

              <div>
                <span className="font-bold text-gray-400">Damage Terms:</span><br />
                Any kind of Claim of Damage Must be Raised within 24 Hours of Delivery with Photographs and Proofs.
              </div>

              <div>
                <span className="font-bold text-gray-400">Insurance:</span><br />
                Extra
              </div>

              <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="font-bold text-gray-500 uppercase text-[10px]">Payment Milestones Schedule:</span><br />
                <ol className="list-decimal list-inside space-y-1 mt-1.5 text-gray-800">
                  <li><strong>10 %</strong> Advance On Order Conformation.</li>
                  <li><strong>80 %</strong> After Solar Approval (Liaisoning/DISCOM approval).</li>
                  <li><strong>10 %</strong> On day of successful commissioning & Handover of system.</li>
                </ol>
              </div>

              <div>
                <span className="font-bold text-gray-400">Price Validation:</span><br />
                07 Days
              </div>

              <div>
                <span className="font-bold text-gray-400">Jurisdiction:</span><br />
                Nagpur
              </div>
            </div>

            <div className="text-gray-500 text-[10px] space-y-1.5 font-medium leading-normal pt-2 border-t border-gray-100">
              <div>Note – 1) Total project working days is 30 to 60 days (Approximately)</div>
              <div>2) Structure elevated extra charges.</div>
              <div>3) Load Change Demand Extra Charges.</div>
            </div>
          </div>

          {/* Bank Coordinates & Signatures */}
          <div className="grid grid-cols-2 border border-gray-300 divide-x divide-gray-300">
            <div className="p-3 space-y-1 text-xs">
              <div className="font-bold text-gray-900 border-b border-gray-200 pb-1 flex items-center gap-1.5">🏦 Company Bank Details</div>
              <div><span className="font-semibold text-gray-500">Account Name:</span> <span className="font-bold text-gray-900">SUN DEGREEN SOLAR</span></div>
              <div><span className="font-semibold text-gray-500">Account No:</span> <span className="font-bold text-gray-900">640101310000004</span></div>
              <div><span className="font-semibold text-gray-500">Bank Name:</span> <span className="font-bold text-gray-900">UNION BANK OF INDIA</span></div>
              <div><span className="font-semibold text-gray-500">IFSC Code:</span> <span className="font-bold text-gray-900">UBIN0564010</span></div>
            </div>
            
            <div className="p-3 flex flex-col justify-between h-36">
              <div className="text-right text-[10px] font-bold text-gray-500">
                We hope you will find our offer suitable and competitive. We look forward to receive your valued order.
              </div>
              <div className="text-right border-t border-gray-200 pt-2">
                <div className="font-bold text-xs uppercase text-green-800">SUN DEGREEN SOLAR</div>
                <div className="text-[9px] font-medium text-gray-500 mt-1.5">
                  Naresh Chacherkar / Amol Gajbhiye<br />
                  Call: 9373582446 / 7709308619
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .no-print-scroll {
            overflow: visible !important;
          }
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>
    </main>
  )
}