import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, PageMasthead } from "@/components/site/chrome";

export const metadata: Metadata = { title: "FAQs" };

const FAQS = [
  {
    q: "Is this the official Indian visa website?",
    a: "No. Sahaj Visa is an independent hackathon prototype. Real visas are issued only through indianvisaonline.gov.in and Indian Missions.",
  },
  {
    q: "Will I lose my application if the tab closes?",
    a: "Not here. Fields autosave. Use your application ID on the Track page if you need to reopen a draft.",
  },
  {
    q: "Why isn’t the status “72 hours”?",
    a: "Travellers in 2025–26 often waited longer than the five-year average. This prototype shows an honest mocked range instead of a frozen promise.",
  },
  {
    q: "Was I charged twice?",
    a: "The mock gateway uses one idempotency key per application. If a charge looks unconfirmed, reconcile — do not pay again.",
  },
  {
    q: "Can I apply for a business or Afghan visa here?",
    a: "Those pages exist so the site matches the official information architecture. The working form is the 30-day e-Tourist visa.",
  },
  {
    q: "Do I need a CAPTCHA?",
    a: "Type the word INDIA. Distorted text CAPTCHAs are one of the most-complained-about details on the live site.",
  },
];

export default function FaqsPage() {
  return (
    <div>
      <PageMasthead title="FAQs" subtitle="Short answers for the citizen journey this prototype actually runs" />
      <Container className="max-w-3xl py-6 sm:py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "FAQs" }]} />
        <dl className="mt-6 space-y-3">
          {FAQS.map((item) => (
            <div key={item.q} className="rounded-xl border border-border bg-card p-5">
              <dt className="font-heading text-lg">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-muted-foreground">
          Still stuck?{" "}
          <Link href="/contact" className="font-medium text-primary underline-offset-2 hover:underline">
            Contact
          </Link>{" "}
          or{" "}
          <Link href="/apply" className="font-medium text-primary underline-offset-2 hover:underline">
            open the form
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
