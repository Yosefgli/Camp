import { NextRequest, NextResponse } from 'next/server'
import { createRegistration } from '@/lib/airtable/createRegistration'
import { parentSchema, childSchema, summarySchema, signatureSchema } from '@/lib/validation/schemas'
import { toUserMessage } from '@/lib/errors'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = (body as Record<string, unknown>) ?? {}

  const parentResult = parentSchema.safeParse(parsed.parent)
  if (!parentResult.success) {
    return NextResponse.json({ error: 'Invalid parent data', details: parentResult.error.flatten() }, { status: 400 })
  }

  const childrenRaw = parsed.children
  if (!Array.isArray(childrenRaw) || childrenRaw.length === 0) {
    return NextResponse.json({ error: 'At least one child is required' }, { status: 400 })
  }

  const children = []
  for (const c of childrenRaw) {
    const r = childSchema.safeParse(c)
    if (!r.success) {
      return NextResponse.json({ error: 'Invalid child data', details: r.error.flatten() }, { status: 400 })
    }
    children.push(r.data)
  }

  const summaryResult = summarySchema.safeParse(parsed.summary)
  if (!summaryResult.success) {
    return NextResponse.json({ error: 'Invalid summary data', details: summaryResult.error.flatten() }, { status: 400 })
  }

  const sigResult = signatureSchema.safeParse(parsed.signature)
  if (!sigResult.success) {
    return NextResponse.json({ error: 'Invalid signature data', details: sigResult.error.flatten() }, { status: 400 })
  }

  const signatureUrl = typeof parsed.signatureUrl === 'string' ? parsed.signatureUrl : undefined

  try {
    const result = await createRegistration({
      parent: parentResult.data,
      children,
      summary: summaryResult.data,
      signature: sigResult.data,
      signatureUrl,
      submissionId: randomUUID(),
    })

    return NextResponse.json({
      success: true,
      registrationId: result.parentRecordId,
      totalAmount: result.totalAmount,
    })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: toUserMessage(err) }, { status: 500 })
  }
}
