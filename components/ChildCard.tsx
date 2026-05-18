'use client'

import { getChildCost, getChildType, formatILS } from '@/lib/pricing'
import type { ChildFormData } from '@/lib/validation/schemas'

interface Props {
  child: ChildFormData
  index: number
  onRemove: (index: number) => void
  onEdit: (index: number) => void
}

export default function ChildCard({ child, index, onRemove, onEdit }: Props) {
  const cost = getChildCost(child.grade, child.registrationPeriod)
  const type = getChildType(child.grade)

  const periodShort =
    child.registrationPeriod.includes('לכל התקופה')
      ? 'כל התקופה'
      : child.registrationPeriod.includes('ראשון')
      ? 'חלק ראשון'
      : 'חלק שני'

  return (
    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-camp-border shadow-sm animate-fade-in">
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl ${
          child.gender === 'בת' ? 'bg-pink-100' : 'bg-blue-100'
        }`}
      >
        {child.gender === 'בת' ? '👧' : '👦'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800">
          {child.firstName} {child.lastName}
        </p>
        <p className="text-sm text-gray-500">
          {child.grade} · {periodShort}
        </p>
        {type === 'kan' && child.kindergartenName && (
          <p className="text-xs text-gray-400">{child.kindergartenName}</p>
        )}
        {type === 'school' && child.schoolName && (
          <p className="text-xs text-gray-400">{child.schoolName}</p>
        )}
      </div>

      {/* Cost */}
      <div className="text-left">
        <span className="font-bold text-primary-600 text-sm">{formatILS(cost)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onEdit(index)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition"
          title="ערוך"
        >
          ✏️
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
          title="הסר"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
