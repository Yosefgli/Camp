import { Suspense } from 'react'
import PaymentPageContent from './PaymentPageContent'

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}
