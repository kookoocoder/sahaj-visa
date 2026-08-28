import Link from "next/link";
import { FileText, Landmark, Plane, UserRound } from "lucide-react";
import { AdvisoryCallout, Container, HelpdeskCard, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { QuickActions } from "@/components/site/quick-actions";
import { DEMO_EMAIL, DEMO_PASSWORD, PRODUCT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    href: "/paper-visa",
    title: "Regular / Paper Visa",
    body: "For applicants who must apply through an Indian Mission or Post. The paper journey is mapped here; the working demo is e-Tourist.",
    cta: "Apply Here",
    icon: FileText,
    iconClass: "bg-info text-primary",
  },
  {
    href: "/e-visa",
    title: "e-Visa",
    body: "Tourism, business, medical and conference categories. This prototype runs the 30-day e-Tourist path end to end.",
    cta: "Apply e-Visa",
    icon: Landmark,
    iconClass: "bg-success text-success-foreground",
  },
  {
    href: "/visa-on-arrival",
    title: "Visa on Arrival",
    body: "Facility for eligible nationals of Japan, South Korea and the UAE at selected airports.",
    cta: "View Eligibility",
    icon: Plane,
    iconClass: "bg-warning text-accent-foreground",
  },
  {
    href: "/afghanistan",
    title: "Afghan Visa",
    body: "Entry, medical, student and other categories for Afghanistan nationals, explained in plain language.",
    cta: "Apply Here",
    icon: UserRound,
    iconClass: "bg-info text-primary",
  },
];

export default function HomePage() {
  return (
    <div>
      <PageMasthead
        kicker="Designed and built with ChatGPT"
        title="Portal for Visa Application to India"
        subtitle={`${PRODUCT_NAME} · not indianvisaonline.gov.in`}
      />

      <Container className="py-6 sm:py-8">
        <InfoCallout>
          <p>
            All foreign nationals need a valid passport and an appropriate visa or ETA before travel,
            except where the Government of India has notified otherwise. This site does not issue
            either.
          </p>
          <p className="mt-2">
            The live government e-Arrival card is on the official portal — we link out, we do not
            scrape it.
          </p>
        </InfoCallout>

        <section id="visa-services" className="mt-8 scroll-mt-28">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="portal-shadow portal-shadow-hover flex flex-col rounded-xl border border-border bg-card p-5"
                >
                  <span className={cn("flex size-12 items-center justify-center rounded-xl", service.iconClass)}>
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h2 className="mt-4 font-heading text-xl">{service.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{service.body}</p>
                  <Link
                    href={service.href}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    {service.cta} →
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <AdvisoryCallout className="mt-8">
          <p>
            Do not pay anyone who claims they can “speed up” or “guarantee” an Indian visa. The live
            government portal charges only the notified fee. This prototype takes no real money.
            Fake lookalike sites are common — if you need a real visa, use{" "}
            <a
              className="font-medium underline underline-offset-2"
              href="https://indianvisaonline.gov.in/evisa/tvoa.html"
              target="_blank"
              rel="noreferrer"
            >
              indianvisaonline.gov.in
            </a>{" "}
            only.
          </p>
        </AdvisoryCallout>

        <section className="mt-10">
          <h2 className="mb-4 font-heading text-2xl">Continue an application</h2>
          <QuickActions />
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_16rem]">
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h2 className="font-heading text-2xl">The same four official steps. A state layer that does not forget you.</h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { n: "1", t: "Apply online", d: "Resumable form, one adult, e-Tourist only" },
                  { n: "2", t: "Pay the fee", d: "Mocked, idempotent, no 30-minute lockout" },
                  { n: "3", t: "Receive ETA", d: "Honest range from mocked queue stats" },
                  { n: "4", t: "Fly to India", d: "Out of scope — we do not pretend to be IVFRT" },
                ].map((step) => (
                  <li key={step.n} className="rounded-lg border border-border bg-background p-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {step.n}
                    </span>
                    <p className="mt-3 font-medium">{step.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{step.d}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div id="mocked" className="grid gap-4 scroll-mt-28 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading text-lg">Working in this demo</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Resumable application and application ID</li>
                  <li>Status timeline and timestamped audit log</li>
                  <li>Deterministic pre-submission validation</li>
                  <li>Plain-language field help from a hand-written rules doc</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-heading text-lg">Mocked on purpose</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>Payment gateway (state machine only)</li>
                  <li>Biometrics, security clearance, IVFRT</li>
                  <li>Immigration Check Posts and the live country list</li>
                  <li>We do not scrape or contact indianvisaonline.gov.in</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Demo login {DEMO_EMAIL} · {DEMO_PASSWORD} · no real money, no official visa.
            </p>
          </div>
          <HelpdeskCard />
        </section>
      </Container>
    </div>
  );
}
