const BASE_URL = 'https://api.airtable.com/v0'

function getHeaders(): HeadersInit {
  const key = process.env.AIRTABLE_API_KEY
  if (!key) throw new Error('AIRTABLE_API_KEY is not set')
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

function getBaseId(): string {
  const id = process.env.AIRTABLE_BASE_ID
  if (!id) throw new Error('AIRTABLE_BASE_ID is not set')
  return id
}

export async function airtableCreate(
  tableId: string,
  fields: Record<string, unknown>,
): Promise<{ id: string; fields: Record<string, unknown> }> {
  const url = `${BASE_URL}/${getBaseId()}/${tableId}`
  const res = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fields }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Airtable create failed: ${JSON.stringify(err)}`)
  }

  return res.json() as Promise<{ id: string; fields: Record<string, unknown> }>
}

export async function airtableUpdate(
  tableId: string,
  recordId: string,
  fields: Record<string, unknown>,
): Promise<{ id: string; fields: Record<string, unknown> }> {
  const url = `${BASE_URL}/${getBaseId()}/${tableId}/${recordId}`

  let attempt = 0
  while (attempt < 2) {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ fields }),
    })

    if (res.status === 429 && attempt === 0) {
      await new Promise((r) => setTimeout(r, 1000))
      attempt++
      continue
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Airtable update failed: ${JSON.stringify(err)}`)
    }

    return res.json() as Promise<{ id: string; fields: Record<string, unknown> }>
  }

  throw new Error('Airtable rate limit exceeded after retry')
}
