'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { childSchema, type ChildFormData } from '@/lib/validation/schemas'
import { GRADE_OPTIONS, SCHOOL_OPTIONS, SHIRT_SIZES, HEALTH_FUNDS, REGISTRATION_PERIODS } from '@/lib/airtable/tables'

interface Props {
  initial?: ChildFormData
  onSave: (child: ChildFormData) => void
  onCancel: () => void
}

const HEALTH_DECL_OPTIONS = [
  'אין לבני/לבתי מגבלה בריאותית המונעת השתתפות בפעילות הנדרשת בקייטנה/במחנה.',
  'יש לבני/לבתי מגבלה בריאותית המונעת השתתפות חלקית/מלאה בפעילות הנדרשת בקייטנה/במחנה.',
] as const

const ALLERGY_OPTIONS = [
  'אין לבני/לבתי אלרגיה/רגישות למזון/לתרופה/אחר.',
  'יש לבני/לבתי אלרגיה/רגישות שאינה מסכנת חיים למזון/לתרופה/אחר.',
] as const

export default function AddChildForm({ initial, onSave, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: initial ?? { gender: 'בן', aideCommitment: false },
  })

  const grade = watch('grade') ?? ''
  const hasAllergy = watch('hasAllergy') ?? ''
  const diagnosed = watch('diagnosed') ?? ''
  const isKan = grade.startsWith('עולה לגן')

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="space-y-5 animate-slide-up"
      noValidate
    >
      <h3 className="font-bold text-lg text-primary-700 border-b border-camp-border pb-2">
        {initial ? 'עריכת פרטי ילד/ה' : 'הוספת ילד/ה'}
      </h3>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">שם פרטי *</label>
          <input className="input-field" placeholder="ישראל" {...register('firstName')} />
          {errors.firstName && <p className="input-error">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="input-label">שם משפחה *</label>
          <input className="input-field" placeholder="ישראלי" {...register('lastName')} />
          {errors.lastName && <p className="input-error">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Gender + Birthdate + ID */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="input-label">מגדר *</label>
          <select className="input-field" {...register('gender')}>
            <option value="בן">בן</option>
            <option value="בת">בת</option>
          </select>
        </div>
        <div>
          <label className="input-label">תאריך לידה *</label>
          <input type="date" className="input-field" {...register('birthDate')} />
          {errors.birthDate && <p className="input-error">{errors.birthDate.message}</p>}
        </div>
        <div>
          <label className="input-label">תעודת זהות</label>
          <input className="input-field" placeholder="000000000" {...register('idNumber')} />
        </div>
      </div>

      {/* Grade */}
      <div>
        <label className="input-label">עולה לכיתה/גן *</label>
        <select className="input-field" {...register('grade')}>
          <option value="">-- בחר --</option>
          {GRADE_OPTIONS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        {errors.grade && <p className="input-error">{errors.grade.message}</p>}
      </div>

      {/* Kindergarten / School based on grade */}
      {grade && isKan && (
        <div>
          <label className="input-label">שם הגן</label>
          <input className="input-field" placeholder="גן ילדים" {...register('kindergartenName')} />
        </div>
      )}

      {grade && !isKan && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">בית ספר *</label>
            <select className="input-field" {...register('schoolName')}>
              <option value="">-- בחר --</option>
              {SCHOOL_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.schoolName && <p className="input-error">{errors.schoolName.message}</p>}
          </div>
          <div>
            <label className="input-label">כיתה</label>
            <input className="input-field" placeholder="א׳" {...register('classGroup')} />
          </div>
        </div>
      )}

      {/* Registration period */}
      <div>
        <label className="input-label">תקופת הרשמה *</label>
        <select className="input-field" {...register('registrationPeriod')}>
          <option value="">-- בחר תקופה --</option>
          <option value={REGISTRATION_PERIODS.FULL}>כל התקופה — 23.07 עד 12.08</option>
          <option value={REGISTRATION_PERIODS.HALF_FIRST}>חלק ראשון — 23.07 עד 31.07</option>
          <option value={REGISTRATION_PERIODS.HALF_SECOND}>חלק שני — 04.08 עד 12.08</option>
        </select>
        {errors.registrationPeriod && <p className="input-error">{errors.registrationPeriod.message}</p>}
      </div>

      {/* Shirt + Health fund */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">מידת חולצה *</label>
          <select className="input-field" {...register('shirtSize')}>
            <option value="">-- בחר --</option>
            {SHIRT_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.shirtSize && <p className="input-error">{errors.shirtSize.message}</p>}
        </div>
        <div>
          <label className="input-label">קופת חולים *</label>
          <select className="input-field" {...register('healthFund')}>
            <option value="">-- בחר --</option>
            {HEALTH_FUNDS.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
          {errors.healthFund && <p className="input-error">{errors.healthFund.message}</p>}
        </div>
      </div>

      {/* Health declaration */}
      <div>
        <label className="input-label">הצהרת בריאות *</label>
        <select className="input-field" {...register('healthDeclaration')}>
          <option value="">-- בחר --</option>
          {HEALTH_DECL_OPTIONS.map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        {errors.healthDeclaration && <p className="input-error">{errors.healthDeclaration.message}</p>}
      </div>

      {/* Allergy */}
      <div>
        <label className="input-label">אלרגיות *</label>
        <select className="input-field" {...register('hasAllergy')}>
          <option value="">-- בחר --</option>
          {ALLERGY_OPTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {errors.hasAllergy && <p className="input-error">{errors.hasAllergy.message}</p>}
      </div>

      {hasAllergy.includes('יש') && (
        <div>
          <label className="input-label">פרט את האלרגיה</label>
          <input className="input-field" placeholder="תיאור האלרגיה..." {...register('allergyDetails')} />
        </div>
      )}

      {/* Diagnosis */}
      <div>
        <label className="input-label">אובחן/ה?</label>
        <select className="input-field" {...register('diagnosed')}>
          <option value="">-- בחר --</option>
          <option value="לא אובחן">לא אובחן</option>
          <option value="כן אובחן">כן אובחן</option>
        </select>
      </div>

      {diagnosed === 'כן אובחן' && (
        <div>
          <label className="input-label">יש סייעת?</label>
          <select className="input-field" {...register('hasAide')}>
            <option value="">-- בחר --</option>
            <option value="כן. יש סייעת">כן. יש סייעת</option>
            <option value="הגשנו דרישה לסייעת">הגשנו דרישה לסייעת</option>
            <option value="אין סייעת">אין סייעת</option>
          </select>
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-primary-600" {...register('aideCommitment')} />
            <span className="text-sm text-gray-700">אני מתחייב/ת שהסייעת תהיה נוכחת כל היום</span>
          </label>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="input-label">הערות</label>
        <textarea
          className="input-field resize-none"
          rows={2}
          placeholder="הערות נוספות..."
          {...register('notes')}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          ביטול
        </button>
        <button type="submit" className="btn-primary">
          {initial ? 'שמור שינויים' : 'הוסף ילד/ה'}
        </button>
      </div>
    </form>
  )
}
