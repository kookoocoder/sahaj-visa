import type { Metadata } from "next";
import Link from "next/link";
import { CloudUpload, FileText, Monitor, Printer, Search } from "lucide-react";
import { Breadcrumbs, Container, InfoCallout, PageMasthead } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Visa on Arrival" };

const COUNTRIES = [
  {
    name: "Japan",
    flag: "🇯🇵",
    body: "Eligible Japanese nationals may obtain Visa on Arrival at selected Indian airports, subject to live government rules.",
  },
  {
    name: "South Korea",
    flag: "🇰🇷",
    body: "Eligible Republic of Korea nationals may use the same facility at selected airports.",
  },
  {
    name: "UAE",
    flag: "🇦🇪",
    body: "Eligible UAE nationals may obtain Visa on Arrival where notified, with additional conditions on prior visas.",
  },
];

const ACTIONS = [
  { href: "/apply", label: "Apply here for Visa-on-Arrival", icon: FileText },
  { href: "/track", label: "Complete partially filled application", icon: Monitor },
  { href: "/track", label: "Print visa application", icon: Printer },
  { href: "/track", label: "Check your visa status", icon: Search },
  { href: "/apply", label: "Re-upload documents", icon: CloudUpload },
];

export default function VisaOnArrivalPage() {
  return (
    <div>
      <PageMasthead
        tone="green"
        title="Visa on Arrival"
        subtitle="For eligible nationals of Japan, South Korea & UAE"
      />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Visa on Arrival" }]} />

        <div className="mt-6 rounded-xl border border-[color:oklch(0.55_0.12_155/0.35)] bg-success px-4 py-4 text-success-foreground">
          <InfoCallout className="border-0 bg-transparent p-0">
            <p>
              Visa on Arrival is a live government facility at selected airports. This page explains
              it in the same shape as the official portal. The working application in this prototype
              remains the 30-day e-Tourist visa.
            </p>
          </InfoCallout>
          <p className="mt-3 text-sm font-medium">Available at selected airports · 🇯🇵 🇰🇷 🇦🇪</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {COUNTRIES.map((c) => (
            <article key={c.name} className="portal-shadow-hover flex flex-col rounded-xl border border-border bg-card p-5">
              <p className="flex items-center gap-3 font-heading text-xl">
                <span className="text-3xl" aria-hidden>
                  {c.flag}
                </span>
                {c.name}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              <Link
                href="/instructions"
                className="mt-4 inline-flex h-10 items-center justify-end text-sm font-medium text-[color:oklch(0.42_0.12_155)]"
              >
                Know more →
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-[color:oklch(0.55_0.12_155/0.35)] bg-card p-5 sm:p-6">
          <h2 className="font-heading text-xl">Notes</h2>
          <div className="mt-4 grid gap-6 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            <ul className="list-disc space-y-2 pl-5">
              <li>Eligibility is set by the Government of India, not by this prototype.</li>
              <li>Persons of Pakistani origin are typically excluded from this facility.</li>
              <li>Ordinary passports only — diplomatic and official passports follow a different route.</li>
              <li>Prior visa history can matter for UAE nationals. Check the live portal before you fly.</li>
            </ul>
            <ul className="list-disc space-y-2 pl-5">
              <li>Do not confuse Visa on Arrival with an e-Visa. They are different products.</li>
              <li>This demo will not generate a VOA sticker or an ETA for VOA.</li>
              <li>
                If you want to try the resumable form,{" "}
                <Link href="/apply" className="font-medium text-primary underline-offset-2 hover:underline">
                  start the e-Tourist application
                </Link>
                .
              </li>
            </ul>
          </div>
        </section>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <li key={action.label}>
                <Link
                  href={action.href}
                  className="portal-shadow-hover flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-5 text-center"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-success text-success-foreground">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}
