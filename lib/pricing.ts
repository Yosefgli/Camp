import { REGISTRATION_PERIODS } from './airtable/tables'

export const PRICES = {
  KAN_FULL: 2150,
  KAN_HALF: 1190,
  SCHOOL_FULL: 2350,
  SCHOOL_HALF: 1285,
  DISCOUNT_RATE: 0.05,
} as const

export const COUPON_CODE = '770'
export const COUPON_PRICE = 1

export type ChildType = 'kan' | 'school'

export function getChildType(grade: string): ChildType {
  return grade.startsWith('עולה לגן') ? 'kan' : 'school'
}

export function isHalfPeriod(period: string): boolean {
  return (
    period === REGISTRATION_PERIODS.HALF_FIRST ||
    period === REGISTRATION_PERIODS.HALF_SECOND
  )
}

export function getChildCost(grade: string, period: string): number {
  const type = getChildType(grade)
  const half = isHalfPeriod(period)

  if (type === 'kan') return half ? PRICES.KAN_HALF : PRICES.KAN_FULL
  return half ? PRICES.SCHOOL_HALF : PRICES.SCHOOL_FULL
}

export interface CostBreakdown {
  subtotal: number
  discountAmount: number
  total: number
  hasDiscount: boolean
}

export function calculateTotalCost(
  children: Array<{ grade: string; registrationPeriod: string }>,
): CostBreakdown {
  const subtotal = children.reduce(
    (sum, c) => sum + getChildCost(c.grade, c.registrationPeriod),
    0,
  )
  const hasDiscount = children.length >= 2
  const discountAmount = hasDiscount ? Math.round(subtotal * PRICES.DISCOUNT_RATE) : 0
  return { subtotal, discountAmount, total: subtotal - discountAmount, hasDiscount }
}

export function formatILS(amount: number): string {
  return amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 })
}
