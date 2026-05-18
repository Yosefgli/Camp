'use client'

import { useState, useEffect, useRef } from 'react'
import { formatILS } from '@/lib/pricing'
import { NEDARIM_IFRAME_URL } from '@/lib/payments/nedarimPlus'
import type { NedarimPostMessagePayload } from '@/lib/payments/nedarimPlus'

interface Props {
  registrationId: string
  amountILS: number
  parentName: string
}

interface NedarimMessage {
  height?: number | string
  StatusCode?: string
  TransactionId?: string
  Amount?: string
  Error?: string
}

export default function PaymentIframe({ registrationId, amountILS, parentName }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeHeight, setIframeHeight] = useState(800)
  const [payload, setPayload] = useState<NedarimPostMessagePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch PostMessage payload from server so ApiValid never touches client source
  useEffect(() => {
    async function initPayment() {
      try {
        const res = await fetch('/api/payment/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId, amountILS, parentName }),
        })
        const data = (await res.json()) as { payload?: NedarimPostMessagePayload; error?: string }
        if (!res.ok || !data.payload) {
          setError(data.error ?? 'שגיאה באתחול התשלום')
        } else {
          setPayload(data.payload)
        }
      } catch {
        setError('שגיאה בחיבור לשירות התשלום')
      } finally {
        setLoading(false)
      }
    }
    void initPayment()
  }, [registrationId, amountILS, parentName])

  // Listen for height updates and payment results from Nedarim Plus iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://www.matara.pro') return

      let data: NedarimMessage
      try {
        data = typeof event.data === 'string'
          ? (JSON.parse(event.data) as NedarimMessage)
          : (event.data as NedarimMessage)
      } catch {
        return
      }

      if (data.height) {
        setIframeHeight(Number(data.height))
      }

      if (data.StatusCode !== undefined) {
        if (data.StatusCode === '0') {
          window.location.href = `/success?id=${registrationId}`
        } else {
          setError('התשלום נכשל. אנא נסו שנית או פנו אלינו.')
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [registrationId])

  // After iframe loads, send the payment data via PostMessage
  function handleIframeLoad() {
    if (!payload || !iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      JSON.stringify(payload),
      'https://www.matara.pro',
    )
  }

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

      <div className="relative rounded-xl border border-gray-200 shadow">
        <iframe
          ref={iframeRef}
          src={NEDARIM_IFRAME_URL}
          title="עמוד תשלום"
          className="w-full"
          style={{ height: `${iframeHeight}px`, border: 'none' }}
          onLoad={handleIframeLoad}
        />
      </div>

      <p className="text-xs text-center text-gray-400">
        התשלום מעובד בצורה מאובטחת על ידי נדרים פלוס 🔒
      </p>
    </div>
  )
}
