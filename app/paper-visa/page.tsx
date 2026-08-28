import type { Metadata } from "next";
import Link from "next/link";
import { CloudUpload, FileText, IdCard, Monitor, Printer } from "lucide-react";
import {
  AdvisoryCallout,
  Breadcrumbs,
  Container,
  HelpdeskCard,
  InfoCallout,
  PageMasthead,
} from "@/components/site/chrome";

export const metadata: Metadata = { title: "Regular / Paper visa" };

const SIDEBAR = [
  { href: "/apply", label: "Apply here for Regular / Paper Visa", icon: Monitor },
  { href: "/track", label: "Complete partially filled form", icon: FileText },
  { href: "/track", label: "Check your visa status", icon: IdCard },
  { href: "/track", label: "Print visa application", icon: Printer },
  { href: "/apply", label: "Re-upload data", icon: CloudUpload },
];

export default function PaperVisaPage() {
  return (
    <div>
      <PageMasthead title="Regular / Paper Visa Application" subtitle="Mission or Post submission — mapped, not fully implemented" />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/#visa-services", label: "Visa Categories" },
            { label: "Regular / Paper Visa Application" },
          ]}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)_16rem]">
          <aside className="space-y-4">
            <nav className="overflow-hidden rounded-xl bg-navy text-primary-foreground">
              <ul>
                {SIDEBAR.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="border-b border-white/10 last:border-0">
                      <Link
                        href={item.href}
                        className="flex min-h-12 items-center gap-3 px-4 py-3 text-sm hover:bg-white/10"
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <HelpdeskCard dark />
          </aside>

          <div className="space-y-6">
            <ol className="grid gap-3 sm:grid-cols-3">
              {[
                { n: "1", t: "Apply online", d: "Fill the form. In this prototype the working path is still e-Tourist." },
                { n: "2", t: "Submit documents", d: "A real paper visa is lodged at a Mission or Post with the printed form." },
                { n: "3", t: "Receive passport / visa", d: "Collection is handled by the Mission. We do not simulate that queue." },
              ].map((step) => (
                <li key={step.n} className="rounded-xl border border-border bg-card p-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {step.n}
                  </span>
                  <p className="mt-3 font-heading text-lg">{step.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.d}</p>
                </li>
              ))}
            </ol>
            <InfoCallout title="Instructions">
              <p>
                A regular visa is applied online and then submitted in person or by post to an Indian
                Mission. That physical step is why this category is informational in the demo. If you
                want to feel the resumable form, use the e-Visa path.
              </p>
              <Link href="/apply" className="mt-3 inline-flex font-medium text-primary underline-offset-2 hover:underline">
                Open the working e-Tourist form →
              </Link>
            </InfoCallout>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="font-heading text-base">Useful weblinks</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a className="text-primary underline-offset-2 hover:underline" href="https://www.mha.gov.in/" target="_blank" rel="noreferrer">
                    Ministry of Home Affairs
                  </a>
                </li>
                <li>
                  <a className="text-primary underline-offset-2 hover:underline" href="https://www.mea.gov.in/" target="_blank" rel="noreferrer">
                    Ministry of External Affairs
                  </a>
                </li>
                <li>
                  <a className="text-primary underline-offset-2 hover:underline" href="https://www.boi.gov.in/" target="_blank" rel="noreferrer">
                    Bureau of Immigration
                  </a>
                </li>
              </ul>
            </div>
            <AdvisoryCallout>
              <p>
                There are no extra fees for “emergency” processing on this prototype, and none you
                should pay to an agent for a real visa either.
              </p>
            </AdvisoryCallout>
          </aside>
        </div>
      </Container>
    </div>
  );
}
