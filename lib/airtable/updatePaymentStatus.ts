import { airtableUpdate } from './client'
import { TABLES, PARENT_FIELDS } from './tables'

export type PaymentStatus = 'paid' | 'failed' | 'cancelled'

interface UpdatePaymentInput {
  recordId: string
  status: PaymentStatus
  transactionId?: string
  amountPaid?: number
  failureReason?: string
}

export async function updatePaymentStatus(input: UpdatePaymentInput): Promise<void> {
  const { recordId, status, transactionId, amountPaid, failureReason } = input

  const fields: Record<string, unknown> = {}

  if (status === 'paid') {
    fields[PARENT_FIELDS.TRANSACTION_ID] = transactionId ?? ''
    if (amountPaid !== undefined) {
      fields[PARENT_FIELDS.AMOUNT_PAID_NEDARIM] = amountPaid
    }
  }

  if (status === 'failed' || status === 'cancelled') {
    if (failureReason) {
      fields[PARENT_FIELDS.NOTES] = `שגיאת תשלום: ${failureReason}`
    }
  }

  if (Object.keys(fields).length === 0) return

  await airtableUpdate(TABLES.PARENTS, recordId, fields)
}
