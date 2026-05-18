import { NextRequest, NextResponse } from 'next/server'
import { verifyNedarimCallback, isPaymentApproved } from '@/lib/payments/verifyCallback'
import { updatePaymentStatus } from '@/lib/airtable/updatePaymentStatus'
import type { NedarimCallbackPayload } from '@/lib/payments/verifyCallback'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const rawBody = await req.text()

  let payload: NedarimCallbackPayload
  try {
    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody) as NedarimCallbackPayload
    } else {
      // Form-encoded callback
      const params = new URLSearchParams(rawBody)
      payload = Object.fromEntries(params.entries()) as NedarimCallbackPayload
    }
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  try {
    verifyNedarimCallback(payload, rawBody)
  } catch (err) {
    console.error('[payment/callback] verification failed', {
      ip: req.headers.get('x-forwarded-for'),
      at: new Date().toISOString(),
    })
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  // Extract registration ID from Zeout field (format: "{recordId}_{timestamp}")
  const zeout = payload.zeout ?? payload.Zeout ?? ''
  const registrationId = zeout.split('_')[0]

  if (!registrationId) {
    return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 })
  }

  const approved = isPaymentApproved(payload)
  const transactionId = payload.transactionId ?? payload.TransactionId ?? ''
  const amountStr = payload.sum ?? payload.Sum ?? '0'
  const amountPaid = parseFloat(amountStr)

  try {
    if (approved) {
      await updatePaymentStatus({
        recordId: registrationId,
        status: 'paid',
        transactionId,
        amountPaid: isNaN(amountPaid) ? undefined : amountPaid,
      })
    } else {
      await updatePaymentStatus({
        recordId: registrationId,
        status: payload.statusCode === 'cancelled' ? 'cancelled' : 'failed',
        failureReason: payload.statusCode,
      })
    }
  } catch (err) {
    console.error('[payment/callback] Airtable update failed', err)
    // Return 500 so Nedarim Plus can retry
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
