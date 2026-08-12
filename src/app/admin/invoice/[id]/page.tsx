'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Printer, ArrowLeft } from 'lucide-react'

interface InvoiceItem {
  name: string
  hsn: string
  qty: number
  costPrice: number
  rate: number
  per: string
  amount: number
  cgstRate: number
  sgstRate: number
  cgstAmount: number
  sgstAmount: number
}

interface Invoice {
  id: string
  invoiceNo: string
  dated: string
  leadId: string
  customerName: string
  customerAddress: string
  customerState: string
  customerStateCode: string
  items: InvoiceItem[]
  discountType: 'flat' | 'percent' | 'none'
  discountValue: number
  discountAmount: number
  taxableValue: number
  totalCgst: number
  totalSgst: number
  roundOff: number
  totalAmount: number
  amountInWords: string
  totalCostPrice: number
  createdAt: string
}

export default function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch('/api/admin/invoices')
        if (res.ok) {
          const invoices: Invoice[] = await res.json()
          const matched = invoices.find(inv => inv.id === id || inv.invoiceNo.replace(/\//g, '-') === id)
          if (matched) {
            setInvoice(matched)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoice()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500 font-sans">
        <div className="text-center">
          <span className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="mt-3 text-sm">Loading Invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500 font-sans">
        <div className="text-center">
          <p className="font-bold text-lg">Invoice Not Found</p>
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

  // Calculate tax analysis details (group by HSN/SAC)
  const taxAnalysis: Record<string, { taxable: number; cgstRate: number; cgstAmt: number; sgstRate: number; sgstAmt: number; totalTax: number }> = {}

  let totalTaxable = 0
  let totalCgstAmt = 0
  let totalSgstAmt = 0

  invoice.items.forEach(item => {
    const key = item.hsn || '995421'
    const itemSub = item.qty * item.rate
    const proportion = invoice.items.reduce((acc, i) => acc + i.qty * i.rate, 0) > 0 
      ? itemSub / invoice.items.reduce((acc, i) => acc + i.qty * i.rate, 0) 
      : 0
    
    // Proportional taxable amount after discount
    const taxable = itemSub - (invoice.discountAmount * proportion)
    const cgstAmt = (taxable * item.cgstRate) / 100
    const sgstAmt = (taxable * item.sgstRate) / 100

    totalTaxable += taxable
    totalCgstAmt += cgstAmt
    totalSgstAmt += sgstAmt

    if (!taxAnalysis[key]) {
      taxAnalysis[key] = {
        taxable: 0,
        cgstRate: item.cgstRate,
        cgstAmt: 0,
        sgstRate: item.sgstRate,
        sgstAmt: 0,
        totalTax: 0
      }
    }

    taxAnalysis[key].taxable += taxable
    taxAnalysis[key].cgstAmt += cgstAmt
    taxAnalysis[key].sgstAmt += sgstAmt
    taxAnalysis[key].totalTax += cgstAmt + sgstAmt
  })

  // Format tax amount in words (Simple Indian style)
  function formatTaxWords(num: number): string {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ']
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

    const parts = num.toFixed(2).split('.')
    const integer = parseInt(parts[0])
    const paise = parseInt(parts[1])

    let str = ''
    if (integer === 0) {
      str = 'Zero '
    } else {
      const n = String(integer).padStart(9, '0')
      const match = n.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/)
      if (match) {
        const crore = parseInt(match[1])
        const lakh = parseInt(match[2])
        const thousand = parseInt(match[3])
        const hundred = parseInt(match[4])
        const tens = parseInt(match[5])

        if (crore > 0) str += (crore < 20 ? a[crore] : b[Math.floor(crore / 10)] + ' ' + a[crore % 10]) + 'Crore '
        if (lakh > 0) str += (lakh < 20 ? a[lakh] : b[Math.floor(lakh / 10)] + ' ' + a[lakh % 10]) + 'Lakh '
        if (thousand > 0) str += (thousand < 20 ? a[thousand] : b[Math.floor(thousand / 10)] + ' ' + a[thousand % 10]) + 'Thousand '
        if (hundred > 0) str += a[hundred] + 'Hundred '
        if (tens > 0) str += (tens < 20 ? a[tens] : b[Math.floor(tens / 10)] + ' ' + a[tens % 10])
      }
    }

    let result = 'INR ' + str.trim()
    if (paise > 0) {
      const paiseStr = paise < 20 ? a[paise] : b[Math.floor(paise / 10)] + ' ' + a[paise % 10]
      result += ' and ' + paiseStr.trim() + ' Paise'
    }
    return result + ' Only'
  }

  const taxInWords = formatTaxWords(totalCgstAmt + totalSgstAmt)

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
          <Printer size={16} /> Print Invoice (PDF)
        </button>
      </div>

      <div className="w-full overflow-x-auto no-print-scroll">
        {/* Invoice Container - Styled to fit on standard A4 page */}
        <div className="min-w-[760px] max-w-[800px] mx-auto bg-white border border-gray-300 p-4 sm:p-8 shadow-md print:shadow-none print:border-none print:p-0 space-y-6">
        
        {/* Document Title */}
        <div className="text-center font-bold text-lg border-b border-gray-300 pb-2 uppercase tracking-wide">
          Tax Invoice
        </div>

        {/* Company & Invoice Meta Info Grid */}
        <div className="grid grid-cols-2 border border-gray-300 divide-x divide-gray-300">
          {/* Left Column: Seller & Buyer Details */}
          <div className="p-3 space-y-4">
            <div>
              <div className="font-bold text-sm tracking-tight text-green-800 uppercase">Sun Degreen Solar</div>
              <div className="mt-1 font-medium">H NO-933/V/39, GANGABAI GHAT ROAD</div>
              <div>NEAR DR. BABASAHEB AMBEDKAR STATUE, CHITNAVISPURA</div>
              <div>MAHAL, Nagpur - 440032</div>
              <div className="font-bold mt-1.5">GSTIN/UIN: 27DAWPC6210F1ZQ</div>
              <div>State Name: Maharashtra, Code: 27</div>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="font-bold text-gray-500 uppercase text-[10px]">Buyer (Bill To)</div>
              <div className="font-bold text-sm text-gray-900 mt-1 uppercase">{invoice.customerName}</div>
              <div className="mt-1">{invoice.customerAddress}</div>
              <div className="font-bold mt-1.5">State Name: {invoice.customerState}, Code: {invoice.customerStateCode}</div>
            </div>
          </div>

          {/* Right Column: Invoice numbers & Dates */}
          <div className="divide-y divide-gray-300">
            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Invoice No.</div>
                <div className="font-bold text-sm mt-0.5">{invoice.invoiceNo}</div>
              </div>
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Dated</div>
                <div className="font-bold text-sm mt-0.5">{invoice.dated}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Delivery Note</div>
                <div className="mt-0.5 text-gray-400">—</div>
              </div>
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Mode/Terms of Payment</div>
                <div className="mt-0.5 font-medium">As per Terms</div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Supplier&apos;s Ref.</div>
                <div className="mt-0.5">{invoice.invoiceNo}</div>
              </div>
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Other Reference(s)</div>
                <div className="mt-0.5 text-gray-400">—</div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Buyer&apos;s Order No.</div>
                <div className="mt-0.5 text-gray-400">—</div>
              </div>
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Dated</div>
                <div className="mt-0.5 text-gray-400">—</div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Despatch Document No.</div>
                <div className="mt-0.5 text-gray-400">—</div>
              </div>
              <div className="p-3">
                <div className="font-bold text-gray-500 text-[10px]">Delivery Note Date</div>
                <div className="mt-0.5 text-gray-400">—</div>
              </div>
            </div>

            <div className="p-3">
              <div className="font-bold text-gray-500 text-[10px]">Terms of Delivery</div>
              <div className="mt-0.5 text-gray-700">Successful Commissioning & Handover of Solar System.</div>
            </div>
          </div>
        </div>

        {/* Invoice Goods Table */}
        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300 font-bold text-left divide-x divide-gray-300">
              <th className="p-2 w-8 text-center">Sl<br/>No.</th>
              <th className="p-2">Description of Goods</th>
              <th className="p-2 w-20 text-center">HSN/SAC</th>
              <th className="p-2 w-20 text-center">Quantity</th>
              <th className="p-2 w-24 text-right">Rate</th>
              <th className="p-2 w-12 text-center">per</th>
              <th className="p-2 w-28 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 divide-x divide-gray-300 font-medium">
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="divide-x divide-gray-300 align-top">
                <td className="p-2 text-center">{idx + 1}</td>
                <td className="p-2">
                  <div className="font-bold text-gray-900">{item.name}</div>
                </td>
                <td className="p-2 text-center text-gray-500">{item.hsn}</td>
                <td className="p-2 text-center font-bold">{item.qty} {item.per}</td>
                <td className="p-2 text-right">₹{item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-2 text-center">{item.per}</td>
                <td className="p-2 text-right font-bold">₹{(item.qty * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}

            {/* Calculations Rows at the bottom of the goods table */}
            {/* 1. Subtotal Row (before discount) */}
            {invoice.discountAmount > 0 && (
              <tr className="border-t border-gray-300 font-semibold divide-x divide-gray-300">
                <td colSpan={6} className="p-2 text-right">Subtotal</td>
                <td className="p-2 text-right">₹{invoice.items.reduce((acc, i) => acc + i.qty * i.rate, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            )}

            {/* 2. Discount Row */}
            {invoice.discountAmount > 0 && (
              <tr className="font-semibold text-orange-700 divide-x divide-gray-300">
                <td colSpan={6} className="p-2 text-right">
                  Discount {invoice.discountType === 'percent' ? `(${invoice.discountValue}%)` : ''}
                </td>
                <td className="p-2 text-right">-₹{invoice.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            )}

            {/* 3. CGST Row */}
            <tr className="font-semibold divide-x divide-gray-300">
              <td colSpan={6} className="p-2 text-right">CGST</td>
              <td className="p-2 text-right">₹{invoice.totalCgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>

            {/* 4. SGST Row */}
            <tr className="font-semibold divide-x divide-gray-300">
              <td colSpan={6} className="p-2 text-right">SGST</td>
              <td className="p-2 text-right">₹{invoice.totalSgst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>

            {/* 5. Round Off Row */}
            {invoice.roundOff !== 0 && (
              <tr className="font-semibold text-gray-500 divide-x divide-gray-300">
                <td colSpan={6} className="p-2 text-right">ROUND OFF</td>
                <td className="p-2 text-right">
                  {invoice.roundOff > 0 ? '+' : ''}
                  ₹{invoice.roundOff.toFixed(2)}
                </td>
              </tr>
            )}

            {/* 6. Grand Total Row */}
            <tr className="border-t-2 border-gray-300 font-extrabold text-sm divide-x divide-gray-300 bg-gray-50">
              <td colSpan={6} className="p-2 text-right text-green-800 uppercase">Grand Total</td>
              <td className="p-2 text-right text-green-900">₹{invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        {/* Chargeable Amount in Words */}
        <div className="border border-gray-300 p-3 bg-gray-50/50">
          <div className="font-bold text-gray-500 uppercase text-[9px] mb-0.5">Amount Chargeable (in words)</div>
          <div className="font-bold text-gray-900 text-xs">{invoice.amountInWords}</div>
        </div>

        {/* Bank details & Signatory Grid */}
        <div className="grid grid-cols-2 border border-gray-300 divide-x divide-gray-300">
          <div className="p-3 space-y-2">
            <div className="font-bold text-gray-800 border-b border-gray-200 pb-1 flex items-center gap-1">🏦 Company Bank Details</div>
            <div><span className="font-semibold text-gray-500">Account Name:</span> <span className="font-bold text-gray-900">SUN DEGREEN SOLAR</span></div>
            <div><span className="font-semibold text-gray-500">Account No:</span> <span className="font-bold text-gray-900">640101310000004</span></div>
            <div><span className="font-semibold text-gray-500">Bank Name:</span> <span className="font-bold text-gray-900">UNION BANK OF INDIA</span></div>
            <div><span className="font-semibold text-gray-500">IFSC Code:</span> <span className="font-bold text-gray-900">UBIN0564010</span></div>
          </div>
          <div className="p-3 flex flex-col justify-between h-36">
            <div className="text-right">
              <div className="text-[10px] text-gray-500">Declaration:</div>
              <div className="text-[10px] font-medium text-gray-700 italic mt-1 leading-tight">
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </div>
            </div>
            <div className="text-right border-t border-gray-200 pt-2">
              <div className="font-bold text-xs uppercase text-green-800">for SUN DEGREEN SOLAR</div>
              <div className="h-10"></div>
              <div className="text-[10px] font-bold text-gray-500">Authorised Signatory</div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] font-semibold text-gray-400 italic">
          This is a Computer Generated Tax Invoice.
        </div>

        {/* ─── PAGE BREAK FOR PRINTING TAX ANALYSIS ─── */}
        <div className="page-break" />

        {/* Tax Analysis Section */}
        <div className="pt-6 space-y-4">
          <div className="text-center font-bold text-sm border-b border-gray-300 pb-2 uppercase tracking-wide">
            Tax Invoice (Tax Analysis)
          </div>
          
          <div className="grid grid-cols-2 text-[10px] text-gray-500">
            <div>Invoice No: <span className="font-bold text-gray-900">{invoice.invoiceNo}</span></div>
            <div className="text-right">Dated: <span className="font-bold text-gray-900">{invoice.dated}</span></div>
          </div>

          <table className="w-full border border-gray-300 border-collapse text-[10px] text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-300 font-bold divide-x divide-gray-300">
                <th className="p-2 w-24" rowSpan={2}>HSN/SAC</th>
                <th className="p-2 text-right w-24" rowSpan={2}>Taxable Value</th>
                <th className="p-2 text-center" colSpan={2}>Central Tax</th>
                <th className="p-2 text-center" colSpan={2}>State Tax</th>
                <th className="p-2 text-right w-28" rowSpan={2}>Total Tax Amount</th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-300 font-bold divide-x divide-gray-300">
                <th className="p-1.5 text-center w-14">Rate</th>
                <th className="p-1.5 text-right w-20">Amount</th>
                <th className="p-1.5 text-center w-14">Rate</th>
                <th className="p-1.5 text-right w-20">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 divide-x divide-gray-300 font-medium">
              {Object.entries(taxAnalysis).map(([hsn, val]) => (
                <tr key={hsn} className="divide-x divide-gray-300">
                  <td className="p-2">{hsn}</td>
                  <td className="p-2 text-right">₹{val.taxable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-2 text-center">{val.cgstRate.toFixed(1)}%</td>
                  <td className="p-2 text-right">₹{val.cgstAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-2 text-center">{val.sgstRate.toFixed(1)}%</td>
                  <td className="p-2 text-right">₹{val.sgstAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="p-2 text-right font-bold">₹{val.totalTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold border-t-2 border-gray-300 divide-x divide-gray-300">
                <td className="p-2">Total</td>
                <td className="p-2 text-right">₹{totalTaxable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2"></td>
                <td className="p-2 text-right">₹{totalCgstAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2"></td>
                <td className="p-2 text-right">₹{totalSgstAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-2 text-right">₹{(totalCgstAmt + totalSgstAmt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div className="border border-gray-300 p-3 bg-gray-50/50">
            <div className="font-bold text-gray-500 uppercase text-[8px] mb-0.5">Tax Amount (in words)</div>
            <div className="font-bold text-gray-900 text-xs">{taxInWords}</div>
          </div>

          <div className="text-right border-t border-gray-200 pt-4 flex justify-between items-center text-[10px] font-bold text-gray-500">
            <div>SUN DEGREEN SOLAR</div>
            <div>Authorised Signatory</div>
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
