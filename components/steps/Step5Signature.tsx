'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useRegistration } from '@/context/RegistrationContext'
import { COPY } from '@/lib/copy'
import { calculateTotalCost, formatILS } from '@/lib/pricing'
import { toUserMessage } from '@/lib/errors'

export default function Step5Signature() {
  const { state, dispatch } = useRegistration()
  const sigRef = useRef<SignatureCanvas>(null)

  const [fatherSigned, setFatherSigned] = useState(false)
  const [motherSigned, setMotherSigned] = useState(false)
  const [sigError, setSigError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const hasFather = !!(state.parent.fatherName && state.parent.fatherPhone)
  const hasMother = !!(state.parent.motherName && state.parent.motherPhone)
  const breakdown = calculateTotalCost(
    state.children.map((c) => ({ grade: c.grade, registrationPeriod: c.registrationPeriod })),
  )

  function clearSig() {
    sigRef.current?.clear()
    setSigError('')
  }

  async function handleSubmit() {
    setSigError('')
    setConfirmError('')
    setSubmitError('')

    // Validate at least one parent confirmed
    if (!fatherSigned && !motherSigned) {
      setConfirmError('יש לאשר את הטופס על ידי לפחות אחד ההורים')
      return
    }

    // Validate signature
    if (!sigRef.current || sigRef.current.isEmpty()) {
      setSigError('חתימה נדרשת לפני שליחת הטופס')
      return
    }

    setSubmitting(true)

    try {
      const signatureDataUrl = sigRef.current.toDataURL('image/png')

      // Upload signature to Vercel Blob (optional)
      let signatureUrl: string | undefined
      try {
        const uploadRes = await fetch('/api/upload-signature', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: signatureDataUrl,
            registrationKey: `${state.parent.email}_${Date.now()}`,
          }),
        })
        const uploadData = (await uploadRes.json()) as { url?: string }
        signatureUrl = uploadData.url ?? undefined
      } catch {
        // Non-fatal: proceed without signature URL
      }

      // Submit registration
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent: state.parent,
          children: state.children,
          summary: state.summary,
          signature: {
            fatherSigned,
            motherSigned,
            signatureDataUrl,
          },
          signatureUrl,
        }),
      })

      const data = (await res.json()) as {
        success?: boolean
        registrationId?: string
        totalAmount?: number
        error?: string
      }

      if (!res.ok || !data.registrationId) {
        setSubmitError(data.error ?? COPY.errors.submissionFailed)
        return
      }

      dispatch({
        type: 'SET_REGISTRATION_RESULT',
        registrationId: data.registrationId,
        totalAmount: data.totalAmount ?? breakdown.total,
      })

      // Navigate to payment or cash page
      if (state.summary.paymentMethod === 'credit') {
        window.location.href = `/payment?id=${data.registrationId}&amount=${data.totalAmount ?? breakdown.total}&name=${encodeURIComponent((state.parent.fatherName ?? state.parent.motherName ?? ''))}`
      } else {
        window.location.href = `/pending-cash?id=${data.registrationId}&amount=${data.totalAmount ?? breakdown.total}`
      }
    } catch (err) {
      setSubmitError(toUserMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-slide-up space-y-6">
      <h2 className="section-title">אישור וחתימה</h2>

      {/* Summary reminder */}
      <div className="rounded-xl bg-primary-50 border border-primary-100 p-4 text-sm text-gray-700">
        <p className="font-semibold text-primary-700 mb-1">סיכום הרשמה</p>
        <p>
          {state.children.length} ילד/ים · סה&quot;כ{' '}
          <strong className="text-primary-700">{formatILS(breakdown.total)}</strong>
          {state.summary.paymentMethod === 'cash' ? ' · תשלום במזומן' : ' · תשלום באשראי'}
        </p>
      </div>

      {/* Confirmation checkboxes */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">
          ההורה/ים החותמים על הטופס:
        </p>

        {hasFather && (
          <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-primary-300 transition">
            <input
              type="checkbox"
              className="mt-0.5 w-5 h-5 accent-primary-600 flex-shrink-0"
              checked={fatherSigned}
              onChange={(e) => setFatherSigned(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              אני, <strong>{state.parent.fatherName}</strong> (האב), קראתי ואישרתי את כל תנאי הרישום לקייטנה.
            </span>
          </label>
        )}

        {hasMother && (
          <label className="flex items-start gap-3 p-3 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-primary-300 transition">
            <input
              type="checkbox"
              className="mt-0.5 w-5 h-5 accent-primary-600 flex-shrink-0"
              checked={motherSigned}
              onChange={(e) => setMotherSigned(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              אני, <strong>{state.parent.motherName}</strong> (האם), קראתי ואישרתי את כל תנאי הרישום לקייטנה.
            </span>
          </label>
        )}

        {confirmError && <p className="input-error">{confirmError}</p>}
      </div>

      {/* Signature */}
      <div>
        <p className="input-label mb-2">חתימה דיגיטלית *</p>
        <p className="text-xs text-gray-500 mb-3">חתמו עם האצבע או העכבר בתיבה למטה</p>

        <div className={`rounded-xl overflow-hidden border-2 ${sigError ? 'border-red-400' : 'border-gray-200'}`}>
          <div className="bg-gray-50 px-3 py-1.5 flex justify-between items-center border-b border-gray-100">
            <span className="text-xs text-gray-400">✍️ חתמו כאן</span>
            <button
              type="button"
              onClick={clearSig}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              נקה
            </button>
          </div>
          <SignatureCanvas
            ref={sigRef}
            penColor="#1e3a5f"
            canvasProps={{
              className: 'w-full',
              style: { height: 160, background: '#fff', display: 'block' },
            }}
            onBegin={() => setSigError('')}
          />
        </div>
        {sigError && <p className="input-error mt-1">{sigError}</p>}
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}
          disabled={submitting}
          className="btn-secondary"
        >
          ← חזור
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary flex-1"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              שולח...
            </>
          ) : (
            state.summary.paymentMethod === 'credit' ? 'המשך לתשלום ←' : 'שלח טופס ←'
          )}
        </button>
      </div>
    </div>
  )
}
