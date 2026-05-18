import { NextRequest, NextResponse } from 'next/server'
import { buildNedarimPostMessage } from '@/lib/payments/nedarimPlus'

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

  const nameParts = (parentName ?? '').trim().split(' ')
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    const payload = buildNedarimPostMessage({
      registrationId,
      amountILS,
      firstName,
      lastName,
      callbackUrl: `${appUrl}/api/payment/callback`,
    })
    return NextResponse.json({ payload })
  } catch (err) {
    console.error('[payment/init]', err)
    return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 500 })
  }
}
