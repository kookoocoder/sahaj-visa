# Sahaj Visa — Project Report

**Product:** Sahaj Visa (independent prototype)  
**Event:** Build What Moves India  
**Deadline:** 28 August 2026, 8:00 PM IST  
**Live demo:** [https://sahaj-visa.vercel.app](https://sahaj-visa.vercel.app)  
**Demo login:** `demo@visa.test` / `sahaj-demo`

This is **not** a Government of India website. It is not affiliated with the Ministry of Home Affairs, the Bureau of Immigration, NIC, or [indianvisaonline.gov.in](https://indianvisaonline.gov.in/). No real visa is issued. No government logos are used as endorsement.

---

## 1. The problem (one sentence)

**“I don’t know what’s happening to my application, and if anything goes wrong I have to start over.”**

That sentence is the product brief. It is also the pattern in a decade of public complaints about the official e-Visa portal.

---

## 2. Real statistics (sourced)

Figures below are from the research dossier compiled 28 August 2026. Claims that are **not** official counts are marked. Prototype/mocked numbers used only inside the app for ETA phrasing are in §8, not here.

### 2.1 Volume

| Figure | What it is | Source |
|---|---|---|
| **9,644,567** | e-Visas issued, 2020 – 20 July 2025 | MoS Home (Bandi Sanjay Kumar), Lok Sabha / PIB-cited |
| **31.74 lakh (~3.174 million)** | Tourist e-visas, 1 Nov 2024 – 30 Nov 2025 | [PIB PRID 2202210](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202210), Bureau of Immigration |
| **1,697,175** | e-Visas in 2017 alone | Official nationality table |
| **174** | Eligible nationalities / territories | Same Lok Sabha answer |
| **9.51 million** | Foreign tourist arrivals, 2023 | Ministry of Tourism / India Tourism Data Compendium 2025 |
| **9.95 million** | Foreign tourist arrivals, 2024 | Same |
| **10.93 million** | Foreign tourist arrivals, 2019 (pre-COVID peak) | Same |
| **32 airports + 33 seaports** | Designated e-Visa entry points (as cited Apr 2026) | MHA / [The Hindu, 22 Apr 2026](https://www.thehindu.com/news/national/home-ministry-notifies-14-more-seaports-for-e%E2%80%90visa-entry/article70893825.ece) |

A government-adjacent claim that e-visas are **~78% of visas issued** is **unverified** unless it appears in an MHA annual report. Do not use 78% as an official figure.

e-Visa is now the default path for most leisure/business visitors. Scale of exposure: about **3.2 million tourist e-visas in 13 months**. There is **no** official count of abandoned applications, failed payments, or missed flights.

### 2.2 IVFRT — the real backend

The portal is the public face of **IVFRT (Immigration, Visa, Foreigners Registration & Tracking)**, a Mission Mode Project under NeGP. Nodal ministry: MHA. Implementing agency: **NIC**.

| Period | Outlay | Notes |
|---|---|---|
| 2010 – Sep 2014 (original) | **₹1,011 crore** | CCEA 13 May 2010 |
| 2015 revision, till Mar 2021 | **₹638.90 crore** | Spent **₹613.28 crore** |
| 1 Apr 2021 – 31 Mar 2026 | **₹1,365 crore** | Cabinet 19 Jan 2022 |
| 1 Apr 2026 – 31 Mar 2031 | **₹1,800 crore** | Cabinet 25 Mar 2026 |

**Coverage (Cabinet / PIB, 25 Mar 2026):** **117** Immigration Check Posts, **15** FRROs, **854** FROs / SPs / DCPs.

**Primary source:** [PIB PRID 2245088](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2245088) — *Cabinet approves Continuation of the Immigration, Visa, Foreigners Registration & Tracking (IVFRT) Scheme*, 25 March 2026.

Stated next-phase work includes **“revamping core application architecture.”** That is the closest official admission that the current citizen-facing stack is not fit.

### 2.3 Official performance claims vs traveller reality

| Claim | Number | Source | Caveat |
|---|---|---|---|
| e-Visa cleared within 72 hours | **91.24%** | Cabinet / PIB, 25 Mar 2026 | **Five-year average**, not current month |
| “Contactless and faceless” | 100% (stated) | Same PIB | Process claim, not UX quality |
| Immigration clearance time | 5–6 min → **2.5–3 min** (incl. biometrics) | Same PIB | At the airport, not the website |
| FTI-TTP e-gates | **13** major airports, ~**30 seconds** | Same PIB | Trusted traveller programme |
| Official apply-ahead rule | **At least 4 days** before arrival | Portal / missions | Fee paid later is not processed |
| Traveller wait, late 2025–26 | **7–10 working days**, sometimes **2 weeks** | Reddit, Facebook, travel blogs | Anecdotal, dense, consistent |
| Business-aviation wait | **8–10 days** minimum | [Universal Weather, 11 Dec 2025](https://www.universalweather.com/blog/india-e-visa-processing-times-now-require-8-10-days-for-approval/) | Pilot unable to travel; crew rotation |

Both can be true: a five-year 91.24%-in-72-hours average can hide a 2025–26 backlog. The portal copy was not updated. The **4-day-advance rule plus 8–10 day reality** is a structural trap.

### 2.4 2017 nationality split (official table)

| Nationality | e-Visas 2017 | Share |
|---|---|---|
| United Kingdom | 305,954 | 18% |
| United States | 202,508 | 11.9% |
| France | 93,964 | 5.5% |
| China | 91,509 | 5.4% |
| Russia | 88,604 | 5.2% |
| Germany | 76,295 | 4.5% |
| Australia | 72,647 | 4.3% |
| Others | 448,798 | 26.4% |
| **Total** | **1,697,175** | **100%** |

### 2.5 Public complaint metrics

| Metric | Number | Source |
|---|---|---|
| Trustpilot score | **1.3 / 5** | [trustpilot.com/review/indianvisaonline.gov.in](https://www.trustpilot.com/review/indianvisaonline.gov.in) |
| Trustpilot volume | **72 reviews** (32 in the last 12 months as of late Aug 2026) | Same |
| Russell tweet views | **~1.73 million** | [@raymondopolis](https://x.com/raymondopolis/status/1993378856200290392), 25 Nov 2025 |
| Russell engagement | 7,181 likes, 748 reposts, 379 quotes, 655 replies | Same fetch |
| Time to complete (Russell) | **~4 hours** per annual application | Same thread |
| Time to lodge (public) | **~2 hours** typical; **~3 days** for 2 applications (Jan 2026 `r/travel`) | Public forums |
| Fake / clone URLs | **140** | Government-circulated list via missions (CGI San Francisco and others) |
| Live e-Visa page footer | **“Updated as on May 16, 2019”** | Still on the live page as of late Aug 2026 |
| Official browser spec | Internet Explorer **9.0** (2011) and Adobe Acrobat Reader **7.0** (2005) | Live e-Visa technical requirements, 2026 |

Trustpilot is **not** a sample of all users. It is uniformly about crashes, lost data, photo rejection, and hours-to-days of retry. Reddit / TripAdvisor / Facebook show the same failure modes from **2018 through August 2026** — not a one-week outage.

### 2.6 Official fees and hard rules (portal / missions)

| Rule | Number |
|---|---|
| 30-day e-Tourist (July–March) | **USD 25** (CGI San Francisco published example) |
| 30-day e-Tourist (April–June) | **USD 10** |
| One-year e-Tourist | **USD 40** |
| Five-year e-Tourist | **USD 80** (some mission years have listed $200 — check live portal) |
| Bank / gateway surcharge | **2.5%** extra |
| Payment status lag before retry | **Up to 2 hours** |
| Informal lockout after failed pay | **30–120 minutes** (folk workaround, not a published SLA) |
| Photo size window | JPEG, typically **10 KB–300 KB / 1 MB** (caps conflict on live pages) |
| Passport validity | **Six months** from date of arrival |
| Refunds | **None**, including on rejection |

This prototype charges a flat **$25** and does not take real money.

### 2.7 What does **not** exist (do not invent)

There is **no** official or independent count of:

- Downtime hours
- Failed-payment counts
- Abandoned applications
- Double charges
- Missed flights or cancelled hotels
- Hours lost
- CAG performance audit of this specific portal
- WCAG accessibility audit
- Public NIC architecture / hosting diagram / SLA / incident log

**Loss is real, repeated, and economically non-trivial. A national statistic does not exist.** Anyone quoting “X million people lost Y crore” is guessing.

What can be said without inventing a number:

1. **Scale.** ~3.2 million tourist e-visas in 13 months. Even a 1% serious-failure rate would be tens of thousands of people. That 1% is **not measured**; it only shows the size of the pipe.
2. **Documented trip damage.** Universal Weather (Dec 2025): crew visa late, **pilot could not fly**. Facebook groups titled around missed flights. `r/travel` Nov 2025: flights in days, site crashing, still “under process.”
3. **Fake-site tax.** **140** clone URLs. Missions say fraud complaints have been rising. Clones overcharge (often 2–5×, as reported) or steal cards. Second-order cost of an official site that is both unusable and hard to distinguish from Google ads.
4. **Sunk fees.** Non-refundable. A failed or late application is the fee plus rebooked hotels/flights.

---

## 3. What we built

Sahaj Visa rebuilds **one** journey — 30-day e-Tourist Visa, one adult — around the official four steps:

1. Apply online  
2. Pay  
3. Receive ETA  
4. Present at a designated Immigration Check Post  

We do **not** rebuild immigration policy, biometrics, or IVFRT. We rebuild the citizen’s experience of applying and knowing where they stand.

### 3.1 Feature status

| Priority | Feature | Status |
|---|---|---|
| P0 | Resumable form — autosave on blur / step-change; survives kill-tab | **Shipped** |
| P0 | Status timeline: Submitted → Payment confirmed → Under review → ETA issued | **Shipped** |
| P0 | Mock payment with idempotency; decline; charged-but-not-confirmed + reconcile | **Shipped** |
| P0 | AI Feature 1 — OpenAI vision rejection-risk scanner | **Shipped** (needs `OPENAI_API_KEY`) |
| P0 | Mobile-first UI, large tap targets, no marquee / pop-up clutter | **Shipped** |
| P1 | AI Feature 2 — field co-pilot over a hand-written rules doc | **Shipped** |
| P1 | AI Feature 3 — honest ETA phrasing from **mocked** queue stats | **Shipped** |
| P1 | CAPTCHA replacement — type INDIA (accessible) | **Shipped** |
| P1 | Trust banner: independent prototype, official URL named | **Shipped** |
| P2 | Multilingual explainer, passport OCR, family batching | Not built |
| P2 | Officer admin queue, e-Arrival mini-flow | Skipped (judges test the citizen journey) |

### 3.2 Working vs mocked

**Working in this demo**

- Resumable application + stable ID (`SV-26-XXXXXX`)
- Status timeline and timestamped audit log
- OpenAI vision pre-check when `OPENAI_API_KEY` is set; rules-engine fallback without a key
- Field help from a hand-written mock rules document (not scraped from the live site)
- Accessible confirmation instead of a distorted text CAPTCHA

**Mocked on purpose**

- Payment gateway (deterministic state machine, $25, no 2.5% surcharge, no real charge)
- Biometrics, security clearance, IVFRT
- Immigration Check Posts and the live eligible-country list
- Queue throughput used for ETA copy (see §8)
- The ETA itself is **not** a travel document

We do not scrape or contact indianvisaonline.gov.in.

---

## 4. How the product answers each failure mode

| Live-portal failure (sourced) | What Sahaj Visa does |
|---|---|
| Session expired, restart from page 1 | Every field autosaves. Kill the tab, resume. ID is issued when the draft starts. |
| Money deducted, status not updated, 30-minute lockout | Idempotency key per application. “Charged, not confirmed” is a visible state. Reconcile without a second charge. Retry immediately on decline. |
| Photo/passport rejected with no reason | On-device square-crop + size window. Assistive pre-check names the issue next to the field (`{issue, severity, fix_suggestion}`). Not a decision-maker. |
| Distorted text CAPTCHA | Type **INDIA**. Readable, hearable, no sadism. |
| Frozen “72 hours” / apply 4 days before vs 7–10 day waits | Honest range from mocked queue stats, citing the Cabinet five-year 91.24% figure **and** the 2025–26 traveller reports. Not a promise. |
| No human support; missions bounce e-Visa queries | Narrow co-pilot that may only cite our mock rules doc. If the answer is not in the doc, it must say so. |
| 140 clone URLs | Persistent banner: this is an independent prototype; official site is indianvisaonline.gov.in. |
| Mobile “a total waste of time” | Single column, 48px tap targets, native `<select>` / `<input>`. |

---

## 5. Architecture

```
Citizen (mobile / desktop)
        │
        ▼
Next.js 16 App Router (Vercel-ready)
        │  autosave (debounced POST) + Zustand persist (kill-tab)
        ▼
API routes
  /api/application   draft + submit
  /api/payment       mock idempotent state machine
  /api/ai-review     OpenAI vision (gpt-4o) + rules engine
  /api/ai-assist     co-pilot (gpt-4o-mini, grounded on mock rules)
  /api/ai-status     honest ETA phrasing
  /api/auth          demo login
  /api/demo-eta      prototype shortcut
        │
        ▼
JSON application store (local file; /tmp on serverless)
  status: draft → submitted → payment_* → under_review → eta_issued
  audit_log: every transition, timestamped
```

The OpenAI key is server-side only. Payment outcomes are **not** model-driven.

**At scale (submission “how it scales” answer):** session state moves from a row/file to Redis; AI review is rate-limited and cached; the real ICP / biometric / security backend stays as strict as today. We are proposing the citizen-facing layer and state model that could sit in front of IVFRT — the same gap the March 2026 Cabinet note names.

### Tech stack

| Layer | Choice |
|---|---|
| App | Next.js 16.3, React 19, TypeScript |
| UI | Tailwind 4, shadcn/ui, Figtree + Newsreader |
| Client state | Zustand persist (localStorage) |
| Server state | JSON store, Postgres-shaped `Application` model |
| Validation | Zod on submit |
| AI Feature 1 | `gpt-4o` vision via `openai` SDK |
| AI Features 2–3 | `gpt-4o-mini` phrasing |
| Payments | Deterministic state machine |

### Routes

| Path | Role |
|---|---|
| `/` | Landing, problem, working vs mocked |
| `/apply` | Six-step wizard |
| `/status/[id]` | Timeline, ETA, audit log |
| `/login` | Demo credentials, shown on purpose |

---

## 6. How to run

```bash
npm install
cp .env.example .env.local   # set OPENAI_API_KEY for eligibility
npm run dev
```

Open http://localhost:3000.

**Demo:** `demo@visa.test` / `sahaj-demo`

Without an API key the form, autosave, payment machine, and rules-engine pre-check still work. **Feature 1 is not an OpenAI model until the key is set** — that is the eligibility-critical runtime call.

---

## 7. 250-word summary (submission form)

India’s authorised e-Visa site is the public face of IVFRT, a ₹1,800 crore programme whose March 2026 Cabinet note admits the core application architecture needs a revamp. Trustpilot sits at 1.3/5 from 72 reviews. About 3.17 million tourist e-visas were issued in the 13 months to November 2025; 9.64 million since 2020. Travellers describe session expiry that wipes the form, payments that charge without updating status, photo uploads rejected without a reason, and a 72-hour promise (91.24% over five years, per Cabinet) that in 2025–26 often meant 7–10 days. There is no citizen-facing incident log. Missions bounce queries to the portal. The government lists 140 clone URLs. People flee to scammers because the real site is unusable.

Sahaj Visa rebuilds one journey — 30-day e-Tourist, one adult — around: I don’t know what’s happening to my application, and if anything goes wrong I have to start over. Drafts autosave. Closing the tab does not send you to page 1. A timeline (Submitted → Paid → Under review → ETA) replaces a frozen countdown. Payment is a mocked idempotent machine that can show “charged but not confirmed” and reconcile without a second charge or lockout. Before submit, OpenAI vision plus a rules engine explain photo and passport problems next to the field. Queue language is honest: we do not promise 72 hours.

Payment, biometrics, and IVFRT stay mocked. Form, session, status, and the OpenAI pre-check are working. Independent prototype, not a government website.

---

## 8. Prototype-only numbers (not real; do not cite as official)

Used only to phrase Feature 3 (honest ETA). Calibrated to 2025–26 traveller reports, **not** claimed as MHA data.

| Mock field | Value in this build |
|---|---|
| As-of date | 28 August 2026 |
| Applications this month (seed) | 18,420 |
| Median days | 6 |
| p50 / p75 / p90 | 5 / 8 / 11 days |
| Share “similar window” | 78% of this seed |
| Mock share cleared in 72 hours *this month* | 41% |
| Contrasted with official five-year figure | 91.24% |

The UI must keep saying these are mocked.

---

## 9. Video plan (2 minutes)

**First 60 seconds — citizen**

1. Kill the tab mid-form; reopen; same ID and fields.  
2. Upload a bad photo; pre-check says *why* (size / not square / shadow), not a blank reject.  
3. Pay with “charged, not confirmed”; reconcile on the same key; no lockout.  
4. Status page: honest days-range, not 72 hours; audit log.

**Second 60 seconds — how we built it**

1. Name the OpenAI vision call on `POST /api/ai-review` (eligibility).  
2. Payment is a state machine, not a model.  
3. This is a citizen-facing layer in front of IVFRT, not a replacement for 117 check posts.  
4. Working vs mocked, on screen.

---

## 10. Primary sources

**Official**

- [indianvisaonline.gov.in e-Visa](https://indianvisaonline.gov.in/evisa/tvoa.html)
- [PIB IVFRT continuation, 25 Mar 2026, PRID 2245088](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2245088)
- [PIB 31.74 lakh tourist e-visas, PRID 2202210](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2202210)
- [MHA e-Visa](https://www.mha.gov.in/en/commoncontent/e-visa)
- [BOI](https://boi.gov.in)

**Public record of failure**

- [Trustpilot](https://www.trustpilot.com/review/indianvisaonline.gov.in)
- [Russell, 25 Nov 2025](https://x.com/raymondopolis/status/1993378856200290392)
- [The Economist, 28 Jun 2026](https://www.economist.com/asia/2026/06/28/why-cant-indias-government-build-a-decent-website)
- [Hacker News on that column](https://news.ycombinator.com/item?id=48713332)
- [Universal Weather, 11 Dec 2025](https://www.universalweather.com/blog/india-e-visa-processing-times-now-require-8-10-days-for-approval/)

Full citations: `indianvisaonline-gov-in-research.md`.

---

*Report generated 28 August 2026. Official figures as cited on that date. Prototype queue stats in §8 are fictional seed data for the demo.*
