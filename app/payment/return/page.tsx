'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// This page is loaded INSIDE the Nedarim Plus iframe after payment.
// It breaks out of the iframe and redirects the parent window.
function ReturnContent() {
  const params = useSearchParams()
  const status = params.get('status')
  const registrationId = params.get('registrationId') ?? ''

  useEffect(() => {
    const targetUrl =
      status === 'success'
        ? `/success?id=${registrationId}`
        : `/payment?id=${registrationId}&error=payment_failed`

    // Break out of the iframe
    if (window.top && window.top !== window) {
      window.top.location.href = targetUrl
    } else {
      window.location.href = targetUrl
    }
  }, [status, registrationId])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">מעבד תוצאת תשלום...</p>
      </div>
    </div>
  )
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ReturnContent />
    </Suspense>
  )
}
