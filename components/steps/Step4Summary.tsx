'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { summarySchema, type SummaryFormData } from '@/lib/validation/schemas'
import { useRegistration } from '@/context/RegistrationContext'
import { calculateTotalCost, getChildCost, formatILS, COUPON_CODE, COUPON_PRICE } from '@/lib/pricing'
import { COPY } from '@/lib/copy'

export default function Step4Summary() {
  const { state, dispatch } = useRegistration()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SummaryFormData>({
    resolver: zodResolver(summarySchema),
    defaultValues: state.summary as SummaryFormData,
  })

  const paymentMethod = watch('paymentMethod')
  const breakdown = calculateTotalCost(
    state.children.map((c) => ({ grade: c.grade, registrationPeriod: c.registrationPeriod })),
  )

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState(false)
  const couponApplied = state.couponApplied
  const finalTotal = couponApplied ? COUPON_PRICE : breakdown.total

  function handleApplyCoupon() {
    if (couponInput.trim() === COUPON_CODE) {
      dispatch({ type: 'SET_COUPON', applied: true })
      setCouponError(false)
    } else {
      setCouponError(true)
    }
  }

  function handleRemoveCoupon() {
    dispatch({ type: 'SET_COUPON', applied: false })
    setCouponInput('')
    setCouponError(false)
  }

  function onSubmit(data: SummaryFormData) {
    dispatch({ type: 'SET_SUMMARY', summary: data })
    dispatch({ type: 'SET_STEP', step: 5 })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-slide-up space-y-6" noValidate>
      <h2 className="section-title">סיכום הרשמה</h2>

      {/* Children summary */}
      <div className="form-card space-y-3">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">ילדים</h3>
        {state.children.map((child, i) => {
          const cost = getChildCost(child.grade, child.registrationPeriod)
          return (
            <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-semibold">{child.firstName} {child.lastName}</p>
                <p className="text-gray-400">{child.grade}</p>
              </div>
              <span className="font-bold text-gray-700">{formatILS(cost)}</span>
            </div>
          )
        })}
      </div>

      {/* Cost breakdown */}
      <div className="form-card space-y-2">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">עלות</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>סה"כ לפני הנחה</span>
          <span>{formatILS(breakdown.subtotal)}</span>
        </div>
        {breakdown.hasDiscount && (
          <div className="flex justify-between text-sm text-green-600">
            <span>הנחת משפחה (5%)</span>
            <span>− {formatILS(breakdown.discountAmount)}</span>
          </div>
        )}
        {couponApplied && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>{COPY.coupon.discount}</span>
            <span>− {formatILS(breakdown.total - COUPON_PRICE)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-extrabold text-primary-700 pt-2 border-t border-gray-200">
          <span>סה"כ לתשלום</span>
          <span>{formatILS(finalTotal)}</span>
        </div>
      </div>

      {/* Coupon */}
      <div className="form-card space-y-3">
        <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{COPY.coupon.label}</h3>
        {couponApplied ? (
          <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
            <p className="text-sm text-emerald-700 font-medium">{COPY.coupon.applied}</p>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-xs text-gray-400 hover:text-gray-600 underline mr-3"
            >
              הסר
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => { setCouponInput(e.target.value); setCouponError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
              placeholder={COPY.coupon.placeholder}
              className="input-field flex-1"
              dir="ltr"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              {COPY.coupon.apply}
            </button>
          </div>
        )}
        {couponError && (
          <p className="text-sm text-red-600">{COPY.coupon.invalid}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="input-label">הערות כלליות</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="הערות לצוות הקייטנה..."
          {...register('notes')}
        />
      </div>

      {/* Payment method */}
      <div>
        <label className="input-label">אמצעי תשלום *</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <PaymentOption
            value="credit"
            selected={paymentMethod === 'credit'}
            icon="💳"
            title={COPY.payment.credit}
            desc={COPY.payment.creditDesc}
            register={register}
          />
          <PaymentOption
            value="cash"
            selected={paymentMethod === 'cash'}
            icon="💵"
            title={COPY.payment.cash}
            desc={COPY.payment.cashDesc}
            register={register}
          />
        </div>
        {errors.paymentMethod && (
          <p className="input-error mt-2">{errors.paymentMethod.message}</p>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
          className="btn-secondary"
        >
          ← חזור
        </button>
        <button type="submit" className="btn-primary flex-1">
          המשך — חתימה ←
        </button>
      </div>
    </form>
  )
}

function PaymentOption({
  value,
  selected,
  icon,
  title,
  desc,
  register,
}: {
  value: string
  selected: boolean
  icon: string
  title: string
  desc: string
  register: ReturnType<typeof useForm<SummaryFormData>>['register']
}) {
  return (
    <label
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected
          ? 'border-primary-500 bg-primary-50 shadow'
          : 'border-gray-200 bg-white hover:border-primary-300'
      }`}
    >
      <input type="radio" value={value} {...register('paymentMethod')} className="sr-only" />
      <span className="text-3xl">{icon}</span>
      <span className="font-bold text-sm text-gray-800">{title}</span>
      <span className="text-xs text-gray-500 text-center">{desc}</span>
    </label>
  )
}
