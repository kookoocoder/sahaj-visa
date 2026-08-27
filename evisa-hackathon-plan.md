# Build Plan — "Sahaj Visa" (working name)
### Reimagining indianvisaonline.gov.in's e-Visa journey
**Event:** Build What Moves India · Deadline: Aug 28, 2026, 8:00 PM IST

---

## 1. Eligibility constraint (read this first)

The brief requires the product to be **"built with Codex or powered by an OpenAI model."** IDE/model choice for actually writing code is entirely your call — that part of the plan is dropped per your steer.

The one thing that doesn't go away: the **live product itself needs an OpenAI model doing real work at runtime**, not just scaffolding. Regardless of what you build with, keep at least one of the AI features below running on an OpenAI model so the submission stays eligible. Everything else — which model does the reasoning-heavy work, which does the cheap phrasing — is your call.

---

## 2. The one problem (from your research)

**"I don't know what's happening to my application, and if anything goes wrong I have to start over."**

This single sentence explains almost every complaint in your dossier:
- Session expiry with no save → restart from page 1
- Payment charged but status not updated → no visibility, no recourse
- CAPTCHA / upload rejection loops → no clear reason given, no retry guidance
- 72-hour promise vs 7–10 day reality → no honest status tracking
- No human support → nowhere to ask "where is my visa"
- Fake-site tax → because the real site is unusable *and* unclear, people flee to scammers

You are not rebuilding immigration policy or a payment gateway. You are rebuilding **the citizen's experience of applying and knowing where they stand** — a guided, stateful, honest, mobile-first version of the same 4-step official process (Apply → Pay → ETA → Present at port), with the state management and transparency layer that's currently missing.

**Judging maps directly:**
- *Problem*: sourced by your dossier (Economist, HN, Trustpilot 1.3/5, Russell tweet, MHA's own Cabinet note admitting the architecture needs revamping).
- *End-to-end thinking*: you address backend/session/infra failure modes, not just paint a nicer form.
- *Honesty*: you already have the perfect disclosure material — mock everything sensitive, cite the government's own admission that "core application architecture" needs revamping.

---

## 3. Scope discipline — what you are NOT building

Do not touch, scrape, or simulate contact with the live government system (explicitly banned). No real Aadhaar/PAN/OTP/payment data. No claiming this is official.

Cut ruthlessly to **one visa category** (e-Tourist Visa, single applicant) for the working demo. Don't build all 10 sub-visa types. Depth on one journey beats breadth on ten mocked ones — judges are told to test "the citizen experience," not an admin panel, and they will click through one full journey.

---

## 4. What to build — priority-ordered

### P0 — Must work end-to-end (this is the demo)
1. **Resumable, saved application form** — every field autosaves to backend on blur/step-change. Kill the tab, reopen, resume exactly where you left off. This alone kills complaint #1 (session death) and is the single most visually convincing "before/after" moment for the video: show the old site's session-expiry horror story from your research, then show yours surviving a refresh.
2. **Real-time application status tracker** — a citizen-facing timeline (Submitted → Payment Confirmed → Under Review → ETA Issued), fed by AI Feature 3 below instead of a static "72 hours" lie.
3. **Mock payment flow with idempotency** — simulate the "charged but not confirmed" failure mode from your research, and show your system handling it gracefully (dedupe, clear status, no 30-minute lockout, no infinite retry). Keep this a deterministic state machine, not AI-driven — judges want to see robustness here, not a model deciding payment outcomes.
4. **AI Feature 1: pre-submission rejection-risk scanner** — see §4a. This is your eligibility-critical runtime AI feature and your strongest demo beat.
5. **Accessible, mobile-first, low-bandwidth UI** — single-column, large tap targets, works on 3G, no marquee/pop-ups/ministerial-portrait clutter, real form validation before submit instead of after. This is the brief's explicit ask ("mobile devices, slower connections, limited digital experience").

### P1 — Strong differentiators if time allows
6. **AI Feature 2: plain-language form co-pilot** — see §4a. Replaces "no human support" with something better than the real support (which, per your research, doesn't even answer).
7. **AI Feature 3: honest, dynamic ETA messaging** — see §4a. Direct rebuttal to the exact contradiction your research surfaced (91%-in-72-hours claim vs. 7–10 day reality).
8. **CAPTCHA replacement** — invisible/behavioral or simple accessible challenge instead of distorted text. Small build, high symbolic payoff (it's the single most-mocked detail in your research, quoted by both the Economist and Anish Gawande).
9. **"Verify this is the real portal" trust banner** — directly addresses your fake-site-tax finding (140 clone URLs). Cheap to build, strong honesty/product-thinking signal, and a great 10-second video beat.

### P2 — Only if P0/P1 are done early
10. **AI Feature 4: multilingual explainer** — same co-pilot as Feature 2, auto-detects/offers Hindi, Tamil, etc. Directly serves "designed for real Indian users... limited digital experience." Cheap once Feature 2 exists — just pass a `language` param into the same prompt.
11. **AI Feature 5: smart form-fill from passport scan (OCR + extraction)** — auto-populate name/DOB/passport number/expiry from the uploaded scan, with a confirm-not-blind-trust step. Cuts form friction directly.
12. Multi-applicant / family application batching.
13. Officer-side mock review queue (skip — brief says reviewers test the citizen journey, not an admin panel; don't spend time here).
14. e-Arrival card mini-flow as a bonus second journey.

---

## 4a. AI feature details (the part that makes this stand out)

These are ranked by how much they change the *outcome* of the journey, not just how impressive they look.

**Feature 1 — Pre-submission rejection-risk scanner (Tier 1, P0)**
Feeds the uploaded photo + passport scan + form answers to a vision-capable model before submit. Doesn't just say "photo invalid" — says *why*, in plain language, with a fix: "Your photo has a shadow behind you and looks ~420×380px, not square — here's a cropped preview that should pass." This recreates the exact failure mode from your research (hours of blind resizing, upload rejection loops) and beats it live on camera.
- Structured output per field: `{issue, severity, fix_suggestion}`, rendered as inline warnings next to the relevant form field — not a wall of errors at the end.
- Frame explicitly as an assistive pre-check, not a decision-maker — the real backend still does final validation.

**Feature 2 — Plain-language form co-pilot (Tier 1, P1)**
Not a generic chatbot — a narrow assistant that only knows *your* mocked visa rules (validity windows, category differences, document requirements) and answers inline, next to the field being filled.
- RAG over a small hand-written rules doc you author yourself — not the live scraped government site — so it can't hallucinate real policy.
- Reuses the same model integration as Feature 1, so it's cheap to add once that exists.

**Feature 3 — Honest, dynamic ETA messaging (Tier 1, P1)**
Instead of a fixed "72 hours" promise, generate a dynamic, confidence-qualified estimate from mocked historical throughput data you seed yourself: "current queue depth suggests 4–6 days, similar to 78% of applications this month" instead of a flat lie.
- Doesn't need a heavyweight model — a lightweight call turning mocked queue stats into a natural-language, honest status message. Could even be templated/rules-based with the model only doing the phrasing.
- This is a pointed, sourced rebuttal to the exact contradiction your research surfaced (Cabinet's 91.24%-in-72-hours five-year average vs. Universal Weather's 8–10 day reality in practice) — strong "honesty" + "product thinking" signal.

**Feature 4 — Multilingual explainer (Tier 2, P2)**
Same engine as Feature 2, with a `language` param. Serves the brief's explicit "limited digital experience" user directly.

**Feature 5 — Smart form-fill from passport scan (Tier 2, P2)**
OCR/extraction from the uploaded scan to auto-populate name/DOB/passport number/expiry, with a confirm-before-save step so it's assistive, not blind-trust.

**What to skip entirely:** a general-purpose "AI assistant for everything" (unfocused, hallucination risk, dilutes the demo), and any AI involvement in the payment logic (keep that deterministic — see P0 item 3).

**Do not start P1 until every P0 item works start-to-finish in a live deployed link.** A working 5-item journey beats an impressive but broken 10-item one — "Working build: does the main journey actually work?" is a named judging criterion.

---

## 5. Tech stack (fast to build, fast to deploy, plays to Cursor + Codex)

| Layer | Choice | Why |
|---|---|---|
| Frontend | **Next.js 14 (App Router) + TypeScript + Tailwind** | One repo, SSR for speed on slow connections, huge Codex/Cursor training coverage = fastest AI-assisted velocity |
| UI components | **shadcn/ui** | Accessible primitives out of the box, minimal custom a11y work |
| State/autosave | Next.js Server Actions + optimistic client state (Zustand) | Simple resumable-form architecture, no over-engineering |
| Backend/DB | **Supabase** (Postgres + Auth + Storage) | Mock accounts, file uploads (photo/passport), row-level security, generous free tier, deploys same-day |
| AI runtime — Feature 1 (rejection-risk scanner) | **OpenAI vision-capable model** (e.g. `gpt-5`), called server-side from a Next.js API route | Satisfies the eligibility requirement; vision input needed for photo/passport checks; keep the key server-side, never expose it client-side |
| AI runtime — Features 2–5 | Any capable model of your choice (can be the same OpenAI model, or something else if only Feature 1 needs to be OpenAI-powered) | Reasoning quality here matters more than provider — pick whatever you trust most, as long as Feature 1 stays on an OpenAI model |
| Payments (mocked) | Simple state machine you control (no real gateway) — simulate delay, decline, "charged-unconfirmed," and success states | Explicitly required: mock where real payment would be unsafe |
| Hosting | **Vercel** (frontend+API) | One-click deploy, gives you the required "live public link that opens without requesting access" |
| Mock auth | Supabase magic-link or simple demo login (`demo@visa.test` / shown password) | Brief explicitly allows/expects mock consumer credentials |

---

## 6. Architecture sketch (for your "end-to-end thinking" answer)

```
Citizen (mobile/desktop browser)
   │
   ▼
Next.js frontend (Vercel)
   │  autosave on every step (debounced Server Action)
   ▼
Next.js API routes
   ├── /api/application  → Supabase (Postgres) — draft state, resumable
   ├── /api/upload        → Supabase Storage — photo/passport, mocked validation
   ├── /api/payment       → mock idempotent state machine (pending/charged/confirmed/failed)
   ├── /api/ai-review     → OpenAI vision model — Feature 1: pre-submit document/answer check
   ├── /api/ai-assist     → LLM (any provider) — Feature 2/4: plain-language help, form Q&A, multilingual
   └── /api/ai-status     → LLM (any provider) — Feature 3: dynamic ETA phrasing from mocked queue data
   │
   ▼
Supabase Postgres
   - applications (status enum: draft → submitted → payment_pending → payment_confirmed → under_review → eta_issued)
   - audit_log (every state transition, timestamped — this is your answer to "no SLA/incident log exists" from your own research)
```

Two things from your dossier to explicitly narrate in the submission ("what's mocked / how it scales"):
- You're not claiming to replace IVFRT (₹1,800 crore, 117 check posts, biometrics, security clearance) — you're proposing the **citizen-facing layer + state model** that could sit in front of it, the same way the government's own March 2026 Cabinet note admits the "core application architecture" needs a rebuild.
- At scale: session state moves from a table row to Redis/session cache, AI review calls get rate-limited/cached, and the real ICP/biometric/security backend stays exactly as strict as today — you're only fixing the citizen-facing failure modes (session loss, opacity, payment confusion), not immigration security policy.

---

## 7. Suggested timeline (assuming you're building this over the coming days, not literally today)

| Phase | Focus |
|---|---|
| Day 1 | Repo scaffold, Supabase schema, deploy skeleton to Vercel immediately (get the live link working on day 1, not day 5) |
| Day 2 | P0 items 1–3: resumable form, status tracker, mock payment state machine |
| Day 3 | P0 item 4 / AI Feature 1: vision-based rejection-risk scanner — do this early, not last, since it's your eligibility-critical, riskiest integration |
| Day 4 | P0 item 5: mobile/a11y polish + P1 items 6–9 (AI Features 2 & 3, CAPTCHA replacement, trust banner) if time allows |
| Day 5 | Cut scope hard, freeze features, write the 250-word summary, record the 2-min video |
| Buffer | Test the live link in incognito on mobile data before submitting — "every link must work without requesting access" |

---

## 8. Submission checklist (from the brief, don't lose points here)

- [ ] Live public link, opens without login/access request (mock demo creds included in the submission text)
- [ ] 2-min video: **first 60s** = citizen demo (show the resumable form surviving a kill-tab, show the honest status tracker, show the AI pre-check catching a bad photo); **second 60s** = how you built it, explicitly naming where the OpenAI model runs in the live product and your architecture choices
- [ ] 250-word summary: name the real problem (cite your own research — session loss, payment opacity, 72hr-vs-7-10-day gap), what you changed, why it's better
- [ ] Clearly labeled mocked vs working pieces (payment, biometrics/security backend, ICP integration = mocked; form/session/status/AI-review = working)
- [ ] No government logos used in a way implying endorsement — style-inspired, clearly labeled as an independent prototype
- [ ] Partner's registered email (if team of two)

---

## 9. Fast next step

Want me to write the actual prompt/schema design for AI Features 1 and 2 — system prompts, structured output shape, and how they wire into the form UI — so you have something concrete to hand to whatever model/IDE you're building with? Or scaffold the Next.js + Supabase repo structure (schema, API routes, folder layout) first?
