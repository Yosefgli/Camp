# CLAUDE.md — Router & Protocol

## Pre-Code Protocol
Before writing or modifying any code:
1. Identify which domain the task belongs to (see routing table below).
2. Read the corresponding skill file in full from `.claude/skills/`.
3. Only then proceed with implementation.

---

## `!resume` Command
If the user types `!resume` at the start of a session:
- READ `docs/BIG_PICTURE.md`. Do not print it.
- Reply with a short status summary and ask: "What are we working on this session?"
- Never read it again during the session unless explicitly asked.

---

## Session Discipline
One session = one task. Do not let the conversation sprawl across multiple features or fixes.
When the task is complete, say so explicitly.

---

## Routing Table

| Trigger | Skill File |
|---|---|
| `app/`, `components/`, `.tsx`, `.jsx`, multi-step form, Tailwind, UI rendering, digital signature, cost calculation | `.claude/skills/frontend.md` |
| `lib/airtable/`, Airtable API, record creation, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, table config | `.claude/skills/airtable.md` |
| `app/api/payment/`, `lib/payments/`, Nedarim Plus, נדרים פלוס, callback, payment status, cash payment | `.claude/skills/payments.md` |
| Input validation, API key handling, webhook signature, digital signature storage, sanitization, CORS | `.claude/skills/security.md` |

---

## Auto-Logging & Session Close
After every completed task:
1. APPEND a 1-liner to `docs/CHANGELOG.md`. Never read it.
2. Optionally APPEND out-of-scope ideas as 1-liners to `docs/BACKLOG.md`.
3. Tell the user: "Task complete. Log updated. Please close this chat and open a new one — keep the context window clean."
