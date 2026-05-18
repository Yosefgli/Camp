import { NextRequest, NextResponse } from 'next/server'
import { verifyNedarimCallback, isPaymentApproved } from '@/lib/payments/verifyCallback'
import { updatePaymentStatus } from '@/lib/airtable/updatePaymentStatus'
import type { NedarimCallbackPayload } from '@/lib/payments/verifyCallback'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    verifyNedarimCallback(req)
  } catch (err) {
    console.error('[payment/callback] verification failed', {
      ip: req.headers.get('x-forwarded-for'),
      at: new Date().toISOString(),
    })
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }

  const rawBody = await req.text()
  let payload: NedarimCallbackPayload
  try {
    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      payload = JSON.parse(rawBody) as NedarimCallbackPayload
    } else {
      const params = new URLSearchParams(rawBody)
      payload = Object.fromEntries(params.entries()) as NedarimCallbackPayload
    }
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  // Registration ID is passed via Param1 (as per Nedarim Plus docs)
  const registrationId = payload.Param1 ?? payload.param1 ?? ''
  if (!registrationId) {
    return NextResponse.json({ error: 'Missing registration ID' }, { status: 400 })
  }

  const approved = isPaymentApproved(payload)
  const transactionId = payload.TransactionId ?? payload.transactionId ?? ''
  const amountStr = payload.Amount ?? payload.amount ?? '0'
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
      const code = payload.StatusCode ?? payload.statusCode ?? ''
      await updatePaymentStatus({
        recordId: registrationId,
        status: code === 'cancelled' ? 'cancelled' : 'failed',
        failureReason: code,
      })
    }
  } catch (err) {
    console.error('[payment/callback] Airtable update failed', err)
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
