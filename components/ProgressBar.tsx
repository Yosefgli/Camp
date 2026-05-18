'use client'

import { useRegistration } from '@/context/RegistrationContext'
import { COPY } from '@/lib/copy'

const TOTAL_STEPS = 5

export default function ProgressBar() {
  const { state, goToStep, canGoToStep } = useRegistration()
  const { step } = state

  return (
    <div className="w-full mb-6">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => {
          const isCompleted = s < step
          const isCurrent = s === step
          const isAccessible = canGoToStep(s) || s < step

          return (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Left line */}
                {s > 1 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      s <= step ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}

                {/* Circle */}
                <button
                  onClick={() => isAccessible && goToStep(s)}
                  disabled={!isAccessible}
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-primary-500 text-white shadow'
                      : isCurrent
                      ? 'bg-primary-600 text-white shadow-lg ring-4 ring-primary-100'
                      : isAccessible
                      ? 'bg-white border-2 border-primary-300 text-primary-500 hover:border-primary-500'
                      : 'bg-white border-2 border-gray-200 text-gray-300'
                  }`}
                >
                  {isCompleted ? '✓' : s}
                </button>

                {/* Right line */}
                {s < TOTAL_STEPS && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      s < step ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Label — visible on md+ */}
              <span
                className={`hidden md:block mt-1.5 text-xs font-medium text-center ${
                  isCurrent ? 'text-primary-600' : isCompleted ? 'text-primary-400' : 'text-gray-400'
                }`}
              >
                {COPY.steps[s as keyof typeof COPY.steps]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Current step name on mobile */}
      <p className="md:hidden mt-3 text-center text-sm font-semibold text-primary-600">
        שלב {step} מתוך {TOTAL_STEPS}: {COPY.steps[step as keyof typeof COPY.steps]}
      </p>
    </div>
  )
}
