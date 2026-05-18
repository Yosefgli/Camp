# Skill: Security

## Triggers
Input validation, API key handling, webhook signature verification, digital signature storage, RLS, CORS, sensitive data, `lib/validation/`, sanitization

---

## Input Validation
- All user input validated with **Zod** at the API boundary (`app/api/`) before any processing
- Validate on the server even if the same schema was already used client-side — never trust client validation alone
- Phone numbers: Israeli format only — strip non-digits, assert 10 digits starting with `05`
- ID numbers (ת.ז.): validate with Luhn-like Israeli ID checksum (`lib/validation/israeliId.ts`)
- Dates: validate as ISO string, assert child is within allowed age range for the camp
- Free-text fields: strip HTML tags using `DOMPurify` on the server — never render unsanitized user input

---

## API Key Rules
- `AIRTABLE_API_KEY`, `PAYMENT_TERMINAL_ID`, `PAYMENT_KEY` — server env only
- These keys must never appear in: `NEXT_PUBLIC_*` env vars, client components, error messages returned to the client, or logs
- If any key is accidentally exposed in a log or response, treat it as compromised and rotate immediately

---

## Webhook / Callback Signature Verification
- Every inbound POST to `app/api/payment/callback/` must pass signature verification before any other processing
- Signature algorithm is gateway-specific (Tranzila/Cardcom) — implement in `lib/payments/verifySignature.ts`
- Use `crypto.timingSafeEqual` for all HMAC comparisons — never string equality
- Reject and log (without echoing the body) any request that fails verification

---

## Digital Signature Storage
- Signature stored as base64 PNG string in Airtable — field name: `parent_signature`
- Never store the signature in a client-accessible location (no `localStorage`, no cookie)
- The signature field must be write-once — do not allow overwrite after `paid` status is set
- Include timestamp alongside signature: `parent_signature_at` (ISO)

---

## CORS & Route Protection
- All `app/api/` routes that modify data must check `Content-Type: application/json` — reject others with 415
- Payment callback route must whitelist gateway IP ranges if the provider publishes them
- No API route should return a stack trace to the client — catch all unhandled errors at the route level and return `{ error: 'Internal server error' }` with HTTP 500

---

## Sensitive Data Handling
- Never log: parent ID numbers, payment transaction IDs (in full), signature blobs
- PII (name, phone, email) may be logged at debug level only — strip before sending to any third-party logging service
- Children's birthdates are PII — treat with the same care as parent ID numbers

---

## Forbidden Patterns
- No `eval()`, no `new Function()`, no dynamic `require()`
- No `dangerouslySetInnerHTML` anywhere in the codebase
- No open redirects — all post-payment redirects must go to a hardcoded allowlist of internal paths
