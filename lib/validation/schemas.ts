import { z } from 'zod'
import { GRADE_OPTIONS, SCHOOL_OPTIONS, SHIRT_SIZES, HEALTH_FUNDS, REGISTRATION_PERIODS } from '../airtable/tables'

const hebrewPhone = z
  .string()
  .min(1, 'שדה חובה')
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => /^05\d{8}$/.test(v), 'מספר טלפון לא תקין (דוגמה: 0501234567)')

const optionalPhone = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v === '' || /^05\d{8}$/.test(v), 'מספר טלפון לא תקין')

export const parentSchema = z
  .object({
    email: z.string().email('כתובת מייל לא תקינה'),
    fatherName: z.string().optional(),
    fatherPhone: optionalPhone.optional(),
    motherName: z.string().optional(),
    motherPhone: optionalPhone.optional(),
    address: z.string().min(5, 'כתובת נדרשת'),
    contactFather: z.boolean().default(false),
    contactMother: z.boolean().default(false),
  })
  .refine(
    (d) =>
      (d.fatherName && d.fatherName.length > 0 && d.fatherPhone && d.fatherPhone.length > 0) ||
      (d.motherName && d.motherName.length > 0 && d.motherPhone && d.motherPhone.length > 0),
    { message: 'יש למלא פרטי לפחות הורה אחד (שם + טלפון)', path: ['fatherName'] },
  )

export type ParentFormData = z.infer<typeof parentSchema>

const gradeEnum = z.enum([...GRADE_OPTIONS] as [string, ...string[]])
const periodEnum = z.enum([
  REGISTRATION_PERIODS.FULL,
  REGISTRATION_PERIODS.HALF_FIRST,
  REGISTRATION_PERIODS.HALF_SECOND,
])

export const childSchema = z
  .object({
    firstName: z.string().min(2, 'שם פרטי נדרש'),
    lastName: z.string().min(2, 'שם משפחה נדרש'),
    idNumber: z.string().optional(),
    gender: z.enum(['בן', 'בת']),
    birthDate: z.string().min(1, 'תאריך לידה נדרש'),
    grade: gradeEnum,
    kindergartenName: z.string().optional(),
    schoolName: z.string().optional(),
    classGroup: z.string().optional(),
    registrationPeriod: periodEnum,
    shirtSize: z.enum([...SHIRT_SIZES] as [string, ...string[]]),
    healthFund: z.enum([...HEALTH_FUNDS] as [string, ...string[]]),
    healthDeclaration: z.string().min(1, 'יש לבחור הצהרת בריאות'),
    hasAllergy: z.string().min(1, 'יש לציין אלרגיות'),
    allergyDetails: z.string().optional(),
    diagnosed: z.string().optional(),
    hasAide: z.string().optional(),
    aideCommitment: z.boolean().default(false),
    notes: z.string().optional(),
  })
  .refine(
    (d) => {
      if (d.grade.startsWith('עולה לגן')) return true
      return !!d.schoolName && d.schoolName.length > 0
    },
    { message: 'יש לבחור בית ספר', path: ['schoolName'] },
  )

export type ChildFormData = z.infer<typeof childSchema>

export const summarySchema = z.object({
  notes: z.string().optional(),
  paymentMethod: z.enum(['credit', 'cash']),
})

export type SummaryFormData = z.infer<typeof summarySchema>

export const signatureSchema = z.object({
  fatherSigned: z.boolean().default(false),
  motherSigned: z.boolean().default(false),
  signatureDataUrl: z.string().min(1, 'חתימה נדרשת'),
})

export type SignatureFormData = z.infer<typeof signatureSchema>
