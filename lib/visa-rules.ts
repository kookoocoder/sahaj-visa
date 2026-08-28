/** Hand-authored mock policy for this prototype. Not scraped from the live government site. */

export const RULES_DOC = `
Sahaj Visa — mocked e-Tourist Visa rules (prototype only)
This document is the only policy the in-form co-pilot may cite.
It is a simplified, good-faith reconstruction of publicly stated e-Visa rules
for a single product: 30-day e-Tourist Visa, one applicant.
It is not official, not complete, and not legal advice.

PRODUCT
- Category: e-Tourist Visa, 30 days, double entry.
- Fee in this prototype: USD 25 (July–March published example from CGI San Francisco). April–June can be USD 10 on the live portal. We do not calculate seasonal fees here.
- Bank / gateway surcharge on the live portal is often 2.5% extra. This prototype charges a flat $25 and says so.
- Fees are non-refundable on the live system, including after rejection. This prototype does not take real money.

WHO THIS DEMO COVERS
- One adult applicant. No family batching, no minors as primary, no e-Business / e-Medical / e-Student.
- Nationality must be on the mocked eligible list in the form. The live portal's country list is longer and changes; we do not scrape it.

TIMING
- Apply at least 4 days before the intended arrival date. Payment completed later than that is not processed on the live system.
- Traveller reports in late 2025–2026 often cite 7–10 working days, sometimes two weeks. The official five-year average claimed 91.24% cleared in 72 hours. Both can be true: a long average can hide a current backlog. This prototype therefore never promises 72 hours.
- Passport must be valid for at least six months from the date of arrival.

PHOTO (the live portal's most common rejection)
- JPEG, typically 10 KB to 300 KB (some pages say 1 MB — the live caps conflict, which is itself a problem).
- Square, plain light background, full face, no borders, no heavy shadows, no hats/sunglasses.
- This prototype: we square-crop and resize on your device, then a deterministic pre-check validates dimensions and file size before you submit. The pre-check is not a decision and does not inspect image contents.

PASSPORT SCAN
- Clear biodata page. Live portal often wants PDF with tight size caps (10–300/500 KB) and rejects without saying why.
- This prototype accepts a photo or PDF-as-image, stores it with the draft, and validates available file metadata. It cannot determine readability from image contents.

AFTER SUBMIT
- No edits after submit on the live system. We keep that rule.
- You get a stable, unguessable application ID (starting with SV-26) the moment the draft is created, not after a session roulette.
- Drafts autosave. Closing the tab does not wipe the form.

PAYMENT (mocked)
- Live failure mode: money deducted, status not updated, 30-minute lockout, “wait 2 hours”.
- This prototype: every pay attempt has an idempotency key. Retrying does not double-charge. A “charged but not confirmed” state is visible, reconcilable, and never locks you out.

STATUS
- Timeline: Submitted → Payment confirmed → Under review → ETA issued.
- ETA messaging is calculated from fixed mocked queue statistics, with a confidence range, never a fake countdown to 72 hours.

SUPPORT
- The live helpdesks often do not pick up; missions say they do not process e-visas.
- This prototype answers field-level questions from THIS document only. If the answer is not here, it must say so.

OUT OF SCOPE (mocked / not built)
- Names, international phone numbers, and passport numbers are format-checked. OTP, biometrics, IVFRT, Immigration Check Posts, real payment gateways, and security clearance are not built.
- We are proposing the citizen-facing layer and state model that could sit in front of IVFRT, matching the March 2026 Cabinet note that the core application architecture needs a revamp.
`.trim();

export const FIELD_HELP: Record<string, { title: string; body: string }> = {
  arrivalDate: {
    title: "When should I apply?",
    body: "The live rule is: apply (and finish paying) at least 4 days before arrival. Travellers in 2025–26 often needed 7–10 days. Pick an arrival date at least 4 days out; we will still warn you if the mocked queue suggests longer.",
  },
  passportExpiryDate: {
    title: "Passport validity",
    body: "Your passport must be valid for at least six months from your arrival date. If it expires sooner, the live system will refuse the application — we flag this before you pay.",
  },
  photo: {
    title: "Photo rules",
    body: "Square JPEG, plain light background, full face, roughly 10–300 KB. The live site often rejects without saying why. Here we crop on your phone and tell you what is still wrong.",
  },
  passportScan: {
    title: "Passport scan",
    body: "A clear photo of the biodata page is enough in this prototype. Avoid glare and cropped numbers. On the live portal this is usually a size-capped PDF.",
  },
  visaProduct: {
    title: "Which visa is this?",
    body: "This prototype is only the 30-day e-Tourist Visa for one adult. Other categories (business, medical, student, family) are intentionally out of scope so the journey can be deep, not a menu of empty forms.",
  },
  fee: {
    title: "What do I pay?",
    body: "USD 25 in this demo, no 2.5% surcharge, no real charge. On the live portal fees are non-refundable even if the application is rejected or unused.",
  },
  nationality: {
    title: "Eligible nationalities",
    body: "The live e-Visa country list is long and changes. This demo uses a short mocked list so we never scrape or claim to mirror the official eligibility table.",
  },
  givenNames: {
    title: "Name format",
    body: "Official e-Visa forms accept English letters and spaces only. No numbers, no Mr/Mrs/Dr, no special characters. Copy the passport biodata page exactly.",
  },
  phone: {
    title: "Mobile number",
    body: "Enter an international mobile number with its country code. Spaces and dashes are removed automatically.",
  },
  passportNumber: {
    title: "Passport number",
    body: "6–9 letters and numbers only, matching the biodata page. Spaces, hyphens, and symbols are rejected.",
  },
  email: {
    title: "Email format",
    body: "Use a standard email (name@example.com). This is where a real ETA would be sent.",
  },
  humanCheck: {
    title: "Why this instead of a CAPTCHA?",
    body: "The live text CAPTCHA is the most-mocked detail in public coverage — it blocks humans more reliably than bots. We use a plain-language confirmation you can read, type, and hear with a screen reader.",
  },
};

export function searchRules(question: string): string {
  const q = question.toLowerCase();
  const hits = Object.entries(FIELD_HELP).filter(
    ([key, value]) =>
      q.includes(key.toLowerCase()) ||
      value.title.toLowerCase().split(" ").some((w) => w.length > 3 && q.includes(w)) ||
      value.body.toLowerCase().split(" ").some((w) => w.length > 5 && q.includes(w)),
  );
  if (hits.length) {
    return hits.map(([, v]) => `${v.title}\n${v.body}`).join("\n\n");
  }
  return RULES_DOC;
}
