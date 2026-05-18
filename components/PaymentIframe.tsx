'use client'

import { useState, useEffect } from 'react'
import { formatILS } from '@/lib/pricing'

interface Props {
  registrationId: string
  amountILS: number
  parentName: string
}

export default function PaymentIframe({ registrationId, amountILS, parentName }: Props) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initPayment() {
      try {
        const res = await fetch('/api/payment/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId, amountILS, parentName }),
        })
        const data = (await res.json()) as { iframeUrl?: string; error?: string }
        if (!res.ok || !data.iframeUrl) {
          setError(data.error ?? 'שגיאה באתחול התשלום')
        } else {
          setIframeUrl(data.iframeUrl)
        }
      } catch {
        setError('שגיאה בחיבור לשירות התשלום')
      } finally {
        setLoading(false)
      }
    }
    void initPayment()
  }, [registrationId, amountILS, parentName])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-gray-500">מכין דף תשלום...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <p className="text-sm text-gray-500 mt-2">
          פנו אלינו בטלפון 055-2770770 להשלמת הרישום
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
        <span className="text-sm text-gray-600">סכום לתשלום</span>
        <span className="text-xl font-bold text-primary-700">{formatILS(amountILS)}</span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow">
        <iframe
          src={iframeUrl!}
          title="עמוד תשלום"
          className="w-full"
          style={{ height: '520px', border: 'none' }}
          allow="payment"
        />
      </div>

      <p className="text-xs text-center text-gray-400">
        התשלום מעובד בצורה מאובטחת על ידי נדרים פלוס 🔒
      </p>
    </div>
  )
}
