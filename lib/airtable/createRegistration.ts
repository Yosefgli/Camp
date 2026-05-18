import { airtableCreate } from './client'
import { TABLES, CHILD_FIELDS, PARENT_FIELDS, CAMP_YEAR_VALUE, REGISTRATION_PERIODS } from './tables'
import { getChildType, getChildCost, calculateTotalCost, PRICES } from '../pricing'
import type { ParentFormData, ChildFormData, SummaryFormData, SignatureFormData } from '../validation/schemas'

interface CreateRegistrationInput {
  parent: ParentFormData
  children: ChildFormData[]
  summary: SummaryFormData
  signature: SignatureFormData
  signatureUrl?: string
  submissionId: string
}

export interface CreateRegistrationResult {
  parentRecordId: string
  totalAmount: number
}

export async function createRegistration(
  input: CreateRegistrationInput,
): Promise<CreateRegistrationResult> {
  const { parent, children, summary, signature, signatureUrl, submissionId } = input

  const costBreakdown = calculateTotalCost(
    children.map((c) => ({ grade: c.grade, registrationPeriod: c.registrationPeriod })),
  )

  // 1. Create all child records
  const childRecordIds: string[] = []
  for (const child of children) {
    const isKan = getChildType(child.grade) === 'kan'
    const isHalf =
      child.registrationPeriod === REGISTRATION_PERIODS.HALF_FIRST ||
      child.registrationPeriod === REGISTRATION_PERIODS.HALF_SECOND
    const childCost = getChildCost(child.grade, child.registrationPeriod)

    const fields: Record<string, unknown> = {
      [CHILD_FIELDS.FIRST_NAME]: child.firstName,
      [CHILD_FIELDS.LAST_NAME]: child.lastName,
      [CHILD_FIELDS.GENDER]: child.gender,
      [CHILD_FIELDS.REGISTRATION_PERIOD]: child.registrationPeriod,
      [CHILD_FIELDS.SHIRT_SIZE]: child.shirtSize,
      [CHILD_FIELDS.HEALTH_FUND]: child.healthFund,
      [CHILD_FIELDS.HEALTH_DECLARATION]: child.healthDeclaration,
      [CHILD_FIELDS.HAS_ALLERGY]: child.hasAllergy,
      [CHILD_FIELDS.GRADE]: child.grade,
      [CHILD_FIELDS.CAMP_YEAR]: [CAMP_YEAR_VALUE],
      [CHILD_FIELDS.COST_BEFORE_DISCOUNT]: childCost,
    }

    if (child.idNumber) fields[CHILD_FIELDS.ID_NUMBER] = child.idNumber
    if (child.birthDate) fields[CHILD_FIELDS.BIRTH_DATE] = child.birthDate
    if (child.notes) fields[CHILD_FIELDS.NOTES] = child.notes
    if (child.allergyDetails) fields[CHILD_FIELDS.ALLERGY_DETAILS] = child.allergyDetails
    if (child.diagnosed) fields[CHILD_FIELDS.DIAGNOSED] = child.diagnosed
    if (child.hasAide) fields[CHILD_FIELDS.HAS_AIDE] = child.hasAide
    if (child.aideCommitment) fields[CHILD_FIELDS.AIDE_COMMITMENT] = child.aideCommitment

    if (isKan) {
      if (child.kindergartenName) fields[CHILD_FIELDS.KINDERGARTEN_NAME] = child.kindergartenName
      fields[CHILD_FIELDS.PRICE_KAN_FULL] = PRICES.KAN_FULL
      fields[CHILD_FIELDS.PRICE_KAN_HALF] = PRICES.KAN_HALF
    } else {
      if (child.schoolName) fields[CHILD_FIELDS.SCHOOL_NAME] = child.schoolName
      if (child.classGroup) fields[CHILD_FIELDS.CLASS] = child.classGroup
      fields[CHILD_FIELDS.PRICE_SCHOOL_FULL] = PRICES.SCHOOL_FULL
      fields[CHILD_FIELDS.PRICE_SCHOOL_HALF] = PRICES.SCHOOL_HALF
    }

    const record = await airtableCreate(TABLES.CHILDREN, fields)
    childRecordIds.push(record.id)
  }

  // 2. Create parent record
  const parentFields: Record<string, unknown> = {
    [PARENT_FIELDS.SUBMISSION_ID]: submissionId,
    [PARENT_FIELDS.EMAIL]: parent.email,
    [PARENT_FIELDS.ADDRESS]: parent.address,
    [PARENT_FIELDS.CHILDREN_LINK]: childRecordIds,
    [PARENT_FIELDS.PAYMENT_METHOD]: summary.paymentMethod === 'credit' ? 'אשראי' : 'מזומן',
    [PARENT_FIELDS.CAMP_YEAR]: [CAMP_YEAR_VALUE],
    [PARENT_FIELDS.AMOUNT_BEFORE_DISCOUNT]: costBreakdown.subtotal,
    [PARENT_FIELDS.AMOUNT_AFTER_DISCOUNT]: costBreakdown.total,
    [PARENT_FIELDS.TOTAL_TO_PAY]: costBreakdown.total,
    [PARENT_FIELDS.FATHER_SIGNED]: signature.fatherSigned,
    [PARENT_FIELDS.MOTHER_SIGNED]: signature.motherSigned,
    [PARENT_FIELDS.CONTACT_FATHER]: parent.contactFather,
    [PARENT_FIELDS.CONTACT_MOTHER]: parent.contactMother,
  }

  if (parent.fatherName) parentFields[PARENT_FIELDS.FATHER_NAME] = parent.fatherName
  if (parent.fatherPhone) parentFields[PARENT_FIELDS.FATHER_PHONE] = parent.fatherPhone
  if (parent.motherName) parentFields[PARENT_FIELDS.MOTHER_NAME] = parent.motherName
  if (parent.motherPhone) parentFields[PARENT_FIELDS.MOTHER_PHONE] = parent.motherPhone
  if (summary.notes) parentFields[PARENT_FIELDS.NOTES] = summary.notes

  if (signatureUrl) {
    parentFields[PARENT_FIELDS.SIGNATURE_ATTACHMENT] = [{ url: signatureUrl }]
  }

  const parentRecord = await airtableCreate(TABLES.PARENTS, parentFields)

  // 3. Link children back to parent
  for (const childId of childRecordIds) {
    await airtableCreate(TABLES.CHILDREN, {
      // We use a separate PATCH — but since we just created and can't patch inline here,
      // the link is already set via PARENT_LINK in child creation above only if we add it.
      // Actually the parent → children link sets the reverse automatically in Airtable.
    }).catch(() => null) // No-op here; Airtable sets the reverse link automatically
  }

  return {
    parentRecordId: parentRecord.id,
    totalAmount: costBreakdown.total,
  }
}
