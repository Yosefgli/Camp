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

interface NedarimIncoming {
  Name: string
  Value?: unknown
}

interface TransactionResult {
  Status: string
  Message?: string
}

export default function PaymentIframe({ registrationId, amountILS, parentName }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeHeight, setIframeHeight] = useState(0)
  const [payload, setPayload] = useState<NedarimPostMessagePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [payError, setPayError] = useState<string | null>(null)

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

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://www.matara.pro') return

      const msg = event.data as NedarimIncoming
      if (!msg || typeof msg.Name !== 'string') return

      if (msg.Name === 'Height') {
        setIframeHeight(Number(msg.Value) + 15)
        return
      }

      if (msg.Name === 'TransactionResponse') {
        const result = msg.Value as TransactionResult
        setPaying(false)
        if (result?.Status === 'Error') {
          setPayError(result.Message ?? 'התשלום נכשל. אנא נסו שנית.')
        } else {
          window.location.href = `/success?id=${registrationId}`
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [registrationId])

  function handleIframeLoad() {
    iframeRef.current?.contentWindow?.postMessage(
      { Name: 'GetHeight' },
      'https://www.matara.pro',
    )
  }

  function handlePay() {
    if (!payload || !iframeRef.current?.contentWindow) return
    setPayError(null)
    setPaying(true)
    iframeRef.current.contentWindow.postMessage(
      { Name: 'FinishTransaction2', Value: payload },
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

      <div className="rounded-xl border border-gray-200 shadow overflow-hidden">
        <iframe
          ref={iframeRef}
          src={NEDARIM_IFRAME_URL}
          title="עמוד תשלום"
          className="w-full"
          style={{ height: `${iframeHeight}px`, border: 'none', display: 'block' }}
          scrolling="no"
          onLoad={handleIframeLoad}
        />
      </div>

      {payError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
          <p className="text-red-700 text-sm font-medium">{payError}</p>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={paying || !payload}
        className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
      >
        {paying ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            מבצע חיוב, נא להמתין...
          </span>
        ) : (
          'בצע תשלום'
        )}
      </button>

      <p className="text-xs text-center text-gray-400">
        התשלום מעובד בצורה מאובטחת על ידי נדרים פלוס
      </p>
    </div>
  )
}
