# Skill: Payments

## Triggers
`app/api/payment/`, `lib/payments/`, Nedarim Plus, נדרים פלוס, callback, registration status update, cash payment, תשלום במזומן

---

## Payment Method Choice
At the final step of the form, the user selects one of two options:
- **אשראי** — proceeds to Nedarim Plus embedded payment
- **מזומן** — skips payment, registration saved with `status: pending_cash`

This choice is stored in the Airtable field `payment_method` (`credit` | `cash`).

---

## Credit Card Flow — Nedarim Plus (Embedded iFrame)
Nedarim Plus is **not** a simple redirect — it is an embedded iFrame that communicates back via `postMessage` or server-side callback.

**Flow:**
1. Form submitted → full registration written to Airtable with `status: pending`
2. Server generates Nedarim Plus payment params and returns them to the client
3. Client renders the Nedarim Plus iFrame inside the app (payment step)
4. User completes payment inside the iFrame
5. Nedarim Plus POSTs to `app/api/payment/callback/route.ts`
6. Callback verifies, updates Airtable `status → paid`, returns redirect instructions
7. User sees success page

**Never redirect away from the app before payment is confirmed.**

---

## Cash Flow
1. Form submitted → full registration written to Airtable with `status: pending_cash`, `payment_method: cash`
2. User is shown a confirmation page with payment instructions (amount, how to pay, contact info)
3. No callback expected — status remains `pending_cash` until manually updated

---

## Callback Handler (`app/api/payment/callback/route.ts`)
- **POST only** — reject GET with 405
- Step 1: Verify Nedarim Plus signature — if invalid, return 400 immediately and log
- Step 2: Check idempotency — if registration already `paid`, return 200 and stop
- Step 3: Update Airtable — `status: paid`, `paid_at`, `transaction_id`
- Step 4: Return `{ success: true, redirectUrl: '/success' }` — client handles the redirect
- On Airtable failure: return 500 so Nedarim Plus can retry

---

## Nedarim Plus Integration (`lib/payments/nedarimPlus.ts`)
- Terminal ID and secret from `process.env.NEDARIM_TERMINAL_ID` and `process.env.NEDARIM_SECRET`
- Amount in **agorot** (integer ×100) — never floating point
- Include `registrationId` in the `mosad` / `comment` field so the callback can identify the record
- Generate unique `transaction_id` per attempt: `${registrationId}_${Date.now()}`

---

## Signature Verification (`lib/payments/verifyCallback.ts`)
- Implement Nedarim Plus callback signature algorithm exactly per their docs
- Use `crypto.timingSafeEqual` for HMAC comparison — never string `===`
- Any request failing verification: log with timestamp + IP, return 400, no further processing

---

## Airtable Status Updates
| Event | `status` value | Additional fields written |
|---|---|---|
| Form submitted (credit) | `pending` | `payment_method: credit` |
| Form submitted (cash) | `pending_cash` | `payment_method: cash` |
| Callback: payment approved | `paid` | `paid_at`, `transaction_id` |
| Callback: payment failed | `failed` | `failure_reason` (gateway code) |
| Callback: payment cancelled | `cancelled` | — |

---

## Forbidden Patterns
- No card data (PAN, CVV, expiry) ever touches this server
- No payment logic in frontend components
- No `NEDARIM_SECRET` in any client-accessible location or log
- No skipping the signature verification step even in development
- No setting `status: paid` without a verified Nedarim Plus callback
