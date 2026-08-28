import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, FileCheck, Plane, ScrollText } from "lucide-react";
import { Breadcrumbs, Container, HelpdeskCard, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { QuickActions } from "@/components/site/quick-actions";

export const metadata: Metadata = { title: "e-Visa application process" };

const STEPS = [
  { icon: ScrollText, title: "Apply online", body: "Fill a resumable form. Close the tab — your draft is still there." },
  { icon: CreditCard, title: "Pay e-Visa fee online", body: "Mock gateway. Same payment key on every retry. No lockout." },
  { icon: FileCheck, title: "Receive ETA online", body: "An honest range from mocked queue stats, not a frozen 72 hours." },
  { icon: Plane, title: "Fly to India", body: "Present a real ETA at a real airport. That part is out of scope here." },
];

const CATEGORIES = [
  "e-Tourist (working demo)",
  "e-Business",
  "e-Medical",
  "e-Medical Attendant",
  "e-Conference",
  "e-Ayush",
  "e-Emergency",
  "e-Credit",
];

export default function EVisaPage() {
  return (
    <div>
      <PageMasthead title="e-Visa Application" subtitle="Apply for e-Visa to India — prototype of the citizen journey" />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "e-Visa Application" }]} />

        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="relative rounded-xl border border-border bg-card p-5">
                <span className="absolute -top-3 left-4 flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <Icon className="mt-2 size-8 text-primary" aria-hidden />
                <p className="mt-3 font-heading text-lg">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_16rem]">
          <div className="space-y-6">
            <div className="rounded-xl border border-accent/50 bg-warning p-5">
              <p className="font-heading text-lg text-accent-foreground">Who this prototype covers</p>
              <p className="mt-2 text-sm leading-relaxed text-warning-foreground">
                The live portal lists several e-Visa categories. Only the 30-day e-Tourist visa is a
                working form here. The rest are shown so the information architecture matches the
                official site without pretending we issue those visas.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <li
                    key={c}
                    className="rounded-full bg-info px-3 py-1 text-xs font-medium text-info-foreground"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <InfoCallout title="Technical notes">
              <p>
                The live site still mentions Internet Explorer. This prototype is built for current
                browsers, phones, and slower connections. Drafts autosave. You do not need Adobe
                Acrobat to continue.
              </p>
            </InfoCallout>
            <Link
              href="/apply"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground"
            >
              Apply here for e-Visa →
            </Link>
            <QuickActions />
          </div>
          <HelpdeskCard />
        </div>
      </Container>
    </div>
  );
}
