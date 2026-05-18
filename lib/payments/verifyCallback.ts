import { NextRequest } from 'next/server'
import { PaymentVerificationError } from '../errors'

const NEDARIM_CALLBACK_IP = '18.194.219.73'

export interface NedarimCallbackPayload {
  Param1?: string
  param1?: string
  TransactionId?: string
  transactionId?: string
  Amount?: string
  amount?: string
  StatusCode?: string
  statusCode?: string
  [key: string]: string | undefined
}

// Nedarim Plus authenticates callbacks by IP — verify the request comes from their server.
export function verifyNedarimCallback(req: NextRequest): void {
  if (process.env.NODE_ENV !== 'production') return

  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : (req.headers.get('x-real-ip') ?? '')

  if (ip !== NEDARIM_CALLBACK_IP) {
    throw new PaymentVerificationError(`Invalid callback IP: ${ip}`)
  }
}

export function isPaymentApproved(payload: NedarimCallbackPayload): boolean {
  const code = payload.StatusCode ?? payload.statusCode ?? ''
  return code === '0' || code === 'approved'
}
