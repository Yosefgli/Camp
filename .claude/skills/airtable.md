# Skill: Airtable

## Triggers
`lib/airtable/`, Airtable API client, record creation, base config, table config, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

---

## Write Pattern — When Data Goes to Airtable
**One write, one update — nothing else:**
1. **On form submission** (after all steps are complete + signature collected): write the full registration record to Airtable in a single call — all parent fields, all children, selected track, cost, signature, payment method choice
2. **After payment confirmed** (Nedarim Plus callback): update only the `status` field + payment fields on the existing record — no re-sending of form data

Never write partial data mid-form. Never read from Airtable during the form flow.

---

## Client Setup
- Single Airtable client instance in `lib/airtable/client.ts` — never instantiate inline in route handlers
- API key read from `process.env.AIRTABLE_API_KEY` — never passed as a parameter or hardcoded
- Base ID read from `process.env.AIRTABLE_BASE_ID`
- All table names stored as constants in `lib/airtable/tables.ts` — never use raw strings in queries

---

## Table Constants (`lib/airtable/tables.ts`)
```ts
export const TABLES = {
  REGISTRATIONS: 'Registrations',
} as const
```
All data (parent + children + payment) lives in one Registration record using structured fields — no linked tables unless explicitly required.

---

## Record Operations
- All Airtable operations are in `lib/airtable/` — one file per operation type
- `lib/airtable/createRegistration.ts` — full record write on form submit
- `lib/airtable/updatePaymentStatus.ts` — status update only, called from payment callback
- Every function has an explicit TypeScript return type — no inferred `any` from Airtable SDK
- Never call Airtable directly from a Client Component — always via a Next.js Route Handler (`app/api/`)

---

## Field Naming Convention
- All field names in snake_case, matching form field names exactly — no mapping layer
- Parent fields: `parent_name`, `parent_phone`, `parent_email`, `parent_id`
- Child fields (if multiple children, use JSON array in a long-text field or separate fields per child): `child_1_name`, `child_1_birthdate`, etc.
- Payment fields written only by callback: `status`, `paid_at`, `transaction_id`, `payment_method`

---

## Error Handling
- Wrap every Airtable call in try/catch
- On `INVALID_REQUEST_MISSING_FIELDS` or `UNKNOWN_FIELD_NAME`: throw named `AirtableFieldError` with field name — never swallow
- On HTTP 429 (rate limit): retry once after 1 second, then throw `AirtableRateLimitError`
- Log raw Airtable error server-side; return sanitized Hebrew message to client

---

## Forbidden Patterns
- No Airtable reads during the form flow — write-only until submission
- No direct Airtable calls from `use client` components
- No storing the API key in `localStorage`, cookies, or any client-accessible location
- No multiple writes of the same registration record — create once, update once
