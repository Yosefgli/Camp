import { Suspense } from 'react'
import PendingCashContent from './PendingCashContent'

export default function PendingCashPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PendingCashContent />
    </Suspense>
  )
}
