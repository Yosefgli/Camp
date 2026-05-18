'use client'

import { useRegistration } from '@/context/RegistrationContext'
import ProgressBar from '@/components/ProgressBar'
import Step1CampInfo from '@/components/steps/Step1CampInfo'
import Step2ParentDetails from '@/components/steps/Step2ParentDetails'
import Step3Children from '@/components/steps/Step3Children'
import Step4Summary from '@/components/steps/Step4Summary'
import Step5Signature from '@/components/steps/Step5Signature'
import { COPY } from '@/lib/copy'

export default function Home() {
  const { state } = useRegistration()
  const { step } = state

  const StepComponent = {
    1: Step1CampInfo,
    2: Step2ParentDetails,
    3: Step3Children,
    4: Step4Summary,
    5: Step5Signature,
  }[step]

  return (
    <main className="min-h-screen bg-camp-bg">
      {/* Top bar */}
      <div className="bg-primary-700 text-white py-3 px-4 text-center">
        <p className="text-sm font-medium">{COPY.campName} — {COPY.campYear}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-primary-700 leading-tight">
            הרשמה לקייטנה
          </h1>
          <p className="text-sm text-gray-500 mt-1">{COPY.campDates}</p>
        </div>

        {/* Progress */}
        <ProgressBar />

        {/* Step card */}
        <div className="form-card">
          {StepComponent && <StepComponent />}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          שאלות? צרו קשר:{' '}
          <a href={`https://wa.me/972552770770`} className="underline text-primary-400">
            055-2770770
          </a>
        </p>
      </div>
    </main>
  )
}
