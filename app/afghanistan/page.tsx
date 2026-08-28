import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  CloudUpload,
  DoorOpen,
  FileText,
  Globe,
  GraduationCap,
  HeartPulse,
  Monitor,
  Printer,
  Search,
  Stethoscope,
} from "lucide-react";
import { Breadcrumbs, Container, HelpdeskCard, InfoCallout, PageMasthead } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Visa for Afghanistan" };

const SERVICES = [
  { n: "1", label: "Business Visa", icon: Briefcase },
  { n: "2", label: "Student Visa", icon: GraduationCap },
  { n: "3", label: "Medical Visa", icon: Stethoscope },
  { n: "4", label: "Medical Attendant Visa", icon: HeartPulse },
  { n: "5", label: "Entry Visa", icon: DoorOpen },
  { n: "6", label: "UN Diplomat Visa", icon: Globe },
];

const ACTIONS = [
  { href: "/apply", label: "Apply here for Visa", icon: Monitor },
  { href: "/track", label: "Complete partially", icon: FileText },
  { href: "/track", label: "Print visa application", icon: Printer },
  { href: "/track", label: "Check your visa status", icon: Search },
  { href: "/apply", label: "Reupload data", icon: CloudUpload },
];

export default function AfghanistanPage() {
  return (
    <div>
      <PageMasthead title="Visa for Afghanistan" subtitle="Information architecture from the official portal, rebuilt for clarity" />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/#visa-services", label: "Visa Categories" },
            { label: "Visa for Afghanistan" },
          ]}
        />

        <h2 className="mt-6 font-heading text-xl">Afghanistan nationals can avail the following visa services</h2>
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.label} className="flex flex-col items-center text-center">
                <span className="relative flex size-16 items-center justify-center rounded-full border-2 border-primary bg-info text-primary">
                  <span className="absolute -top-1 -left-1 flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {s.n}
                  </span>
                  <Icon className="size-7" aria-hidden />
                </span>
                <span className="mt-3 text-sm font-medium">{s.label}</span>
              </li>
            );
          })}
        </ul>

        <InfoCallout title="Instructions" className="mt-8">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Confirm current policy on boi.gov.in before you travel — this page is not legal advice.</li>
            <li>Fill one application per person. A family cannot share a single form.</li>
            <li>Copy passport names and numbers exactly. A typo here is how drafts die on the live site.</li>
            <li>Write down your application ID. On this prototype it is how you resume after a closed tab.</li>
          </ul>
          <Link href="/instructions" className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
            Read more →
          </Link>
        </InfoCallout>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <li key={action.label}>
                <Link
                  href={action.href}
                  className="portal-shadow-hover flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-5 text-center"
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-info text-primary">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex justify-center">
          <HelpdeskCard />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          The working demo is still the e-Tourist form.{" "}
          <Link href="/apply" className="font-medium text-primary underline-offset-2 hover:underline">
            Start it here
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
