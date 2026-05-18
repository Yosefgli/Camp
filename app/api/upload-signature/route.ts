import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 })
  }

  const { dataUrl, registrationKey } = (await req.json()) as {
    dataUrl?: string
    registrationKey?: string
  }

  if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
    return NextResponse.json({ error: 'Invalid signature data' }, { status: 400 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    // Blob storage not configured — skip silently
    return NextResponse.json({ url: null })
  }

  try {
    const base64 = dataUrl.replace('data:image/png;base64,', '')
    const buffer = Buffer.from(base64, 'base64')
    const filename = `signatures/${registrationKey ?? Date.now()}.png`

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: 'image/png',
      token,
    })

    return NextResponse.json({ url: blob.url })
  } catch {
    return NextResponse.json({ url: null })
  }
}
