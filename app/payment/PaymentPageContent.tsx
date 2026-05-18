'use client'

import { useSearchParams } from 'next/navigation'
import PaymentIframe from '@/components/PaymentIframe'
import { COPY } from '@/lib/copy'

export default function PaymentPageContent() {
  const params = useSearchParams()
  const registrationId = params.get('id') ?? ''
  const amount = parseFloat(params.get('amount') ?? '0')
  const parentName = params.get('name') ?? 'הורה'

  if (!registrationId || amount <= 0) {
    return (
      <main className="min-h-screen bg-camp-bg flex items-center justify-center p-4">
        <div className="form-card text-center max-w-sm w-full">
          <p className="text-red-600 font-medium">קישור תשלום לא תקין</p>
          <a href="/" className="btn-secondary mt-4 inline-block">חזרה לטופס</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-camp-bg">
      <div className="bg-primary-700 text-white py-3 px-4 text-center">
        <p className="text-sm font-medium">{COPY.campName} — תשלום</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💳</div>
          <h1 className="text-xl font-bold text-primary-700">תשלום מאובטח</h1>
          <p className="text-sm text-gray-500 mt-1">השלם/י את התשלום להשלמת ההרשמה</p>
        </div>

        <div className="form-card">
          <PaymentIframe
            registrationId={registrationId}
            amountILS={amount}
            parentName={parentName}
          />
        </div>
      </div>
    </main>
  )
}
