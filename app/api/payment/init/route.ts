import { NextRequest, NextResponse } from 'next/server'
import { buildNedarimPaymentUrl } from '@/lib/payments/nedarimPlus'

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 })
  }

  const { registrationId, amountILS, parentName } = (await req.json()) as {
    registrationId?: string
    amountILS?: number
    parentName?: string
  }

  if (!registrationId || !amountILS || amountILS <= 0) {
    return NextResponse.json({ error: 'Missing required payment params' }, { status: 400 })
  }

  try {
    const config = buildNedarimPaymentUrl({
      registrationId,
      amountILS,
      parentName: parentName ?? 'הורה',
    })
    return NextResponse.json({ iframeUrl: config.iframeUrl })
  } catch (err) {
    console.error('[payment/init]', err)
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
  }
}
