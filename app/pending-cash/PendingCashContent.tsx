'use client'

import { useSearchParams } from 'next/navigation'
import { formatILS } from '@/lib/pricing'
import { COPY } from '@/lib/copy'

export default function PendingCashContent() {
  const params = useSearchParams()
  const registrationId = params.get('id') ?? ''
  const amount = parseFloat(params.get('amount') ?? '0')

  return (
    <main className="min-h-screen bg-camp-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="form-card space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-5xl mb-3">📋</div>
            <h1 className="text-2xl font-extrabold text-primary-700">{COPY.cashPending.title}</h1>
          </div>

          {/* Important notice */}
          <div className="rounded-xl bg-amber-50 border-2 border-amber-400 p-4">
            <div className="flex gap-2 items-start">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-bold text-amber-800">ההרשמה לא מאושרת עד להסדרת התשלום</p>
                <p className="text-sm text-amber-700 mt-1">
                  מקומות בקייטנה שמורים רק לאחר קבלת התשלום. אנא הסדירו בהקדם.
                </p>
              </div>
            </div>
          </div>

          {/* Amount */}
          {amount > 0 && (
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">סכום לתשלום</span>
              <span className="text-2xl font-extrabold text-primary-700">{formatILS(amount)}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-semibold">{COPY.cashPending.body}</p>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 space-y-1">
              <p className="font-medium text-blue-800">{COPY.cashPending.contactNote}</p>
              <p>
                📱 וואטסאפ:{' '}
                <a
                  href="https://wa.me/972552770770?text=שלום+רוצה+לשלם+קייטנה"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 font-semibold underline"
                >
                  055-2770770
                </a>
              </p>
              <p>
                📧 מייל:{' '}
                <a href="mailto:office@chabadty.com" className="text-primary-600 underline">
                  office@chabadty.com
                </a>
              </p>
            </div>
          </div>

          {registrationId && (
            <p className="text-xs text-gray-400 text-center">
              מספר רישום: <span className="font-mono">{registrationId.slice(-8)}</span>
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/972552770770?text=${encodeURIComponent(`שלום, רשמתי ילד/ים לקייטנה ואני רוצה לשלם. מספר רישום: ${registrationId.slice(-8)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center"
            >
              📱 צור קשר לתיאום תשלום
            </a>
            <a href="/" className="btn-ghost w-full justify-center text-gray-400">
              חזרה לדף הבית
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
