import Link from "next/link";
import { SiteFooter, SiteHeader, TrustBanner } from "@/components/site/chrome";
import { DEMO_EMAIL, DEMO_PASSWORD, PRODUCT_NAME } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <TrustBanner />
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-primary">
              Build What Moves India · citizen journey
            </p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight sm:text-6xl">
              Your e-Visa should survive a closed tab.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {PRODUCT_NAME} is a working prototype of the Indian e-Tourist Visa, rebuilt around one
              sentence from public research: <em>“I don’t know what’s happening to my application, and if anything goes wrong I have to start over.”</em>
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground"
              >
                Start a 30-day e-Tourist Visa
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-card px-6 text-base font-medium"
              >
                Resume / demo login
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Demo: {DEMO_EMAIL} · {DEMO_PASSWORD} · no real money, no official visa.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-14 sm:grid-cols-3">
          {[
            {
              title: "Drafts that don’t die",
              body: "Every field autosaves. Kill the tab, come back, continue. The live portal’s session expiry is the #1 restart-from-page-1 complaint.",
            },
            {
              title: "A status you can read",
              body: "Submitted → paid → under review → ETA. Honest queue language instead of a frozen “72 hours” that travellers in 2025–26 often experienced as 7–10 days.",
            },
            {
              title: "Pre-check before you pay",
              body: "Photo and passport are scanned with an OpenAI vision model before submit. It says why something would fail, next to the field — not after a rejection loop.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-heading text-2xl">{item.title}</h2>
              <p className="mt-2 text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="font-heading text-3xl">The same four official steps. The missing state layer.</h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-4">
              {[
                "Apply — resumable form, one adult, e-Tourist only",
                "Pay — mocked, idempotent, no lockout",
                "ETA — honest range from mocked queue stats",
                "Present at port — out of scope; we do not pretend to be IVFRT",
              ].map((step, i) => (
                <li key={step} className="rounded-xl border border-border bg-background p-4">
                  <span className="text-sm text-muted-foreground">Step {i + 1}</span>
                  <p className="mt-1 font-medium">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="mocked" className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="font-heading text-3xl">Working vs mocked</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-medium">Working in this demo</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Resumable application + application ID</li>
                <li>Status timeline and timestamped audit log</li>
                <li>OpenAI vision pre-submission check (when an API key is set)</li>
                <li>Plain-language field help from a hand-written rules doc</li>
                <li>Accessible confirmation instead of a text CAPTCHA</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-medium">Mocked on purpose</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Payment gateway (state machine only)</li>
                <li>Biometrics, security clearance, IVFRT</li>
                <li>Immigration Check Posts and the live country list</li>
                <li>We do not scrape or contact indianvisaonline.gov.in</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
            The March 2026 Cabinet note on IVFRT (₹1,800 crore continuation) already admits the core
            application architecture needs a revamp. This prototype is a citizen-facing layer that could
            sit in front of that backend — not a replacement for 117 check posts.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
