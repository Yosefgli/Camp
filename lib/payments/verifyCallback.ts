import crypto from 'crypto'
import { PaymentVerificationError } from '../errors'

export interface NedarimCallbackPayload {
  mosadID: string
  sum: string
  zeout: string
  statusCode: string
  transactionId: string
  [key: string]: string
}

// Verifies the Nedarim Plus callback using HMAC-SHA256.
// Update this function once Nedarim Plus provides their exact algorithm.
export function verifyNedarimCallback(payload: NedarimCallbackPayload, rawBody: string): void {
  const secret = process.env.NEDARIM_SECRET
  if (!secret) {
    // If no secret is configured, skip verification (development only)
    if (process.env.NODE_ENV !== 'production') return
    throw new PaymentVerificationError('NEDARIM_SECRET is not configured')
  }

  // Nedarim Plus uses a signature field in the payload — verify against it
  const receivedSig = payload['signature'] ?? payload['sig'] ?? ''
  if (!receivedSig) {
    // Some Nedarim Plus integrations don't send a signature in the body.
    // In that case, verify mosadID matches our terminal.
    const expectedTerminal = process.env.NEDARIM_TERMINAL_ID
    if (expectedTerminal && payload.mosadID !== expectedTerminal) {
      throw new PaymentVerificationError('Terminal ID mismatch')
    }
    return
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')

  const expectedBuf = Buffer.from(expected, 'utf8')
  const receivedBuf = Buffer.from(receivedSig, 'utf8')

  if (
    expectedBuf.length !== receivedBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    throw new PaymentVerificationError('Callback signature mismatch')
  }
}

export function isPaymentApproved(payload: NedarimCallbackPayload): boolean {
  // StatusCode 0 or '0' = approved in Nedarim Plus
  return payload.statusCode === '0' || payload.statusCode === 'approved'
}
