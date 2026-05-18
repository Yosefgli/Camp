'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { parentSchema, type ParentFormData } from '@/lib/validation/schemas'
import { useRegistration } from '@/context/RegistrationContext'

export default function Step2ParentDetails() {
  const { state, dispatch } = useRegistration()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: state.parent as ParentFormData,
  })

  const fatherName = watch('fatherName') ?? ''
  const motherName = watch('motherName') ?? ''

  function onSubmit(data: ParentFormData) {
    dispatch({ type: 'SET_PARENT', parent: data })
    dispatch({ type: 'SET_STEP', step: 3 })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-slide-up space-y-6" noValidate>
      <div>
        <h2 className="section-title">פרטי ההורים</h2>
        <p className="text-sm text-gray-500">יש למלא פרטים לפחות של הורה אחד</p>
      </div>

      {/* Email */}
      <div>
        <label className="input-label">כתובת מייל *</label>
        <input
          type="email"
          className="input-field"
          placeholder="example@mail.com"
          dir="ltr"
          {...register('email')}
        />
        {errors.email && <p className="input-error">{errors.email.message}</p>}
      </div>

      {/* Father */}
      <div className="form-card space-y-4 !p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">👨</span>
          <h3 className="font-bold text-gray-700">פרטי האב</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">שם מלא</label>
            <input
              className="input-field"
              placeholder="ישראל ישראלי"
              {...register('fatherName')}
            />
            {errors.fatherName && <p className="input-error">{errors.fatherName.message}</p>}
          </div>
          <div>
            <label className="input-label">נייד</label>
            <input
              type="tel"
              className="input-field"
              placeholder="0501234567"
              dir="ltr"
              {...register('fatherPhone')}
            />
            {errors.fatherPhone && <p className="input-error">{errors.fatherPhone.message}</p>}
          </div>
        </div>
        {fatherName && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-primary-600" {...register('contactFather')} />
            <span className="text-sm text-gray-600">לשלוח עדכונים על הקייטנה לאב</span>
          </label>
        )}
      </div>

      {/* Mother */}
      <div className="form-card space-y-4 !p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">👩</span>
          <h3 className="font-bold text-gray-700">פרטי האם</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">שם מלא</label>
            <input
              className="input-field"
              placeholder="שרה ישראלי"
              {...register('motherName')}
            />
            {errors.motherName && <p className="input-error">{errors.motherName.message}</p>}
          </div>
          <div>
            <label className="input-label">נייד</label>
            <input
              type="tel"
              className="input-field"
              placeholder="0501234567"
              dir="ltr"
              {...register('motherPhone')}
            />
            {errors.motherPhone && <p className="input-error">{errors.motherPhone.message}</p>}
          </div>
        </div>
        {motherName && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-primary-600" {...register('contactMother')} />
            <span className="text-sm text-gray-600">לשלוח עדכונים על הקייטנה לאם</span>
          </label>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="input-label">כתובת מגורים *</label>
        <input
          className="input-field"
          placeholder="רחוב, מספר, עיר"
          {...register('address')}
        />
        {errors.address && <p className="input-error">{errors.address.message}</p>}
      </div>

      {errors.fatherName?.message?.includes('לפחות') && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          {errors.fatherName.message}
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
          className="btn-secondary"
        >
          ← חזור
        </button>
        <button type="submit" className="btn-primary flex-1">
          המשך — הוספת ילדים ←
        </button>
      </div>
    </form>
  )
}
