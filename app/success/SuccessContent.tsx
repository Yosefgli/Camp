'use client'

import { useSearchParams } from 'next/navigation'
import { COPY } from '@/lib/copy'

export default function SuccessContent() {
  const params = useSearchParams()
  const registrationId = params.get('id') ?? ''

  return (
    <main className="min-h-screen bg-camp-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="form-card text-center space-y-6">
          {/* Confetti-style icon */}
          <div className="text-6xl animate-bounce">🎉</div>

          <div>
            <h1 className="text-2xl font-extrabold text-primary-700">{COPY.success.title}</h1>
            <p className="text-gray-600 mt-2">{COPY.success.subtitle}</p>
          </div>

          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            <p>✅ ההרשמה אושרה ואנחנו מצפים לראות אתכם בקייטנה!</p>
            {registrationId && (
              <p className="mt-1 text-xs text-green-600">
                מספר אישור: <span className="font-mono">{registrationId.slice(-8)}</span>
              </p>
            )}
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>תקבלו עדכונים נוספים בהמשך</p>
            <p>
              לשאלות:{' '}
              <a href="https://wa.me/972552770770" className="text-primary-600 font-semibold underline">
                055-2770770
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/972552770770"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center"
            >
              📱 פתח וואטסאפ
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
