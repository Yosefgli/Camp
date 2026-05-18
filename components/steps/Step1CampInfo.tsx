'use client'

import { useState } from 'react'
import { useRegistration } from '@/context/RegistrationContext'
import { COPY } from '@/lib/copy'
import { formatILS } from '@/lib/pricing'
import { PRICES } from '@/lib/pricing'

export default function Step1CampInfo() {
  const { dispatch } = useRegistration()
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState(false)

  function handleContinue() {
    if (!checked) {
      setError(true)
      return
    }
    dispatch({ type: 'ACKNOWLEDGE_CAMP_INFO' })
    dispatch({ type: 'SET_STEP', step: 2 })
  }

  return (
    <div className="animate-slide-up space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-3">🏕️</div>
        <h1 className="text-2xl font-extrabold text-primary-700">{COPY.campName}</h1>
        <p className="text-accent-500 font-semibold text-lg">{COPY.campYear}</p>
      </div>

      {/* Info card */}
      <div className="form-card space-y-5 text-sm leading-relaxed text-gray-700">
        <InfoSection title="📅 תאריכים">
          <p>הקייטנה תפעל מיום רביעי <strong>23.07.2025</strong> עד יום שלישי <strong>12.08.2025</strong>.</p>
          <p className="text-red-600 font-semibold">⚠️ שימו לב! ביום רביעי 03.08.2025 לא תתקיים קייטנה — צו השעה.</p>
          <p>אפשרות להירשם לבלוק אחד בלבד:</p>
          <ul className="list-disc list-inside mr-4 space-y-0.5 text-gray-600">
            <li>בלוק ראשון: 23.07 – 31.07</li>
            <li>בלוק שני: 04.08 – 12.08</li>
          </ul>
        </InfoSection>

        <InfoSection title="⏰ שעות">
          <p>08:00 – 16:00. ניתן להוציא ולהכניס ילדים בכל שעות הקייטנה.</p>
        </InfoSection>

        <InfoSection title="📍 מיקום">
          <p>{COPY.campLocation}</p>
        </InfoSection>

        <InfoSection title="💳 עלויות">
          <div className="overflow-hidden rounded-xl border border-camp-border">
            <table className="w-full text-sm">
              <thead className="bg-primary-50">
                <tr>
                  <th className="text-right p-3 font-semibold text-primary-700">קבוצה</th>
                  <th className="text-center p-3 font-semibold text-primary-700">כל התקופה</th>
                  <th className="text-center p-3 font-semibold text-primary-700">בלוק אחד</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-camp-border">
                  <td className="p-3">גן (טרום חובה / חובה)</td>
                  <td className="p-3 text-center font-bold">{formatILS(PRICES.KAN_FULL)}</td>
                  <td className="p-3 text-center font-bold">{formatILS(PRICES.KAN_HALF)}</td>
                </tr>
                <tr className="border-t border-camp-border">
                  <td className="p-3">בית ספר (א׳–ה׳)</td>
                  <td className="p-3 text-center font-bold">{formatILS(PRICES.SCHOOL_FULL)}</td>
                  <td className="p-3 text-center font-bold">{formatILS(PRICES.SCHOOL_HALF)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-accent-600 font-medium">🎉 הנחה של 5% למשפחות עם שני ילדים ומעלה</p>
        </InfoSection>

        <InfoSection title="🎯 פעילויות">
          <p>קייסס, סנת שיקסוף, ריתם קצב, ועוד פעילויות מגוונות בתוך הקייטנה.</p>
          <p>עבור בגני ילדים: 6 פעילויות הרקציה מחוץ לקייטנה.</p>
        </InfoSection>

        <InfoSection title="📞 יצירת קשר">
          <p>
            וואטסאפ/טלפון:{' '}
            <a href="https://wa.me/972552770770" className="text-primary-600 font-semibold underline">
              055-2770770
            </a>
          </p>
          <p>
            מייל:{' '}
            <a href="mailto:office@chabadty.com" className="text-primary-600 underline">
              office@chabadty.com
            </a>
          </p>
        </InfoSection>
      </div>

      {/* Acknowledgment */}
      <div className={`rounded-xl border-2 p-4 transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-camp-border bg-white'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-5 h-5 accent-primary-600 flex-shrink-0"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked)
              if (e.target.checked) setError(false)
            }}
          />
          <span className="text-sm font-medium text-gray-700">
            קראתי את כל המידע לעיל והבנתי את תנאי הקייטנה, מדיניות הביטולים, והעלויות.
          </span>
        </label>
        {error && (
          <p className="mt-2 text-sm text-red-600 mr-8">יש לאשר שקראת את המידע לפני המשך ההרשמה</p>
        )}
      </div>

      <button type="button" onClick={handleContinue} className="btn-primary w-full text-base py-4">
        המשך להרשמה ←
      </button>
    </div>
  )
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
      <div className="space-y-1 text-gray-600">{children}</div>
    </div>
  )
}
