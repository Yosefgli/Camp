# Skill: Frontend

## Triggers
`app/`, `components/`, `.tsx`, `.jsx`, multi-step form, Tailwind, UI rendering, digital signature, cost calculation

---

## Stack Constraints
- Next.js 15 App Router only — no Pages Router patterns, no `getServerSideProps`, no `getStaticProps`
- TypeScript strict mode — no `any`, no `as unknown as X` casts without a comment explaining why
- Tailwind CSS only — no inline `style={{}}` except for dynamic values that Tailwind cannot express (e.g., calculated pixel widths)
- Form management: **React Hook Form + Zod** — no uncontrolled inputs, no manual `useState` per field

---

## Multi-Step Form Rules
- Each step is its own component under `components/steps/Step<N><Name>.tsx`
- Step state lives in a single top-level context (`RegistrationContext`) — never prop-drilled more than one level
- Each step validates with its own Zod schema before allowing navigation forward — never skip validation on back-navigation
- Step index is tracked in URL search params (`?step=2`) so the browser back button works correctly
- Never allow the user to jump to a step ahead of the furthest validated step

## Field Naming Convention
- All form field names match the Airtable field names exactly (snake_case) — no mapping layer needed
- Parent fields prefix: `parent_` (e.g., `parent_name`, `parent_phone`)
- Child fields use index suffix: `child_0_name`, `child_0_birthdate`, `child_1_name`

---

## Cost Calculation
- All cost logic lives in `lib/pricing.ts` — never inline arithmetic in components
- Display price with `toLocaleString('he-IL', { style: 'currency', currency: 'ILS' })`
- Cost recalculates reactively on every relevant field change — never cache until submission

---

## Digital Signature
- Use `react-signature-canvas` — no other signature libraries
- Signature is saved as a base64 PNG string on form submission
- Canvas must display a clear instruction in Hebrew above it
- If the canvas is empty on submission, block and show a field-level error

---

## Forbidden Patterns
- No `useEffect` for form validation — use Zod resolver in React Hook Form
- No `alert()` or `confirm()` — use inline error messages or modal components
- No hardcoded Hebrew strings scattered in JSX — all copy goes in `lib/copy.ts`
- No loading spinners that block the entire page — use skeleton loaders per section

---

## Error Display
- Field-level errors: red text below the input, `text-sm text-red-600`
- Step-level errors (e.g., Airtable submission failed): a dismissible banner at the top of the step
- Never expose raw API error messages to the user — map them to Hebrew user-facing messages in `lib/errors.ts`
