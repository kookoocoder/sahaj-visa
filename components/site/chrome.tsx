import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, Info, Phone, ShieldCheck } from "lucide-react";
import { EVisaMark, SahajEmblem } from "@/components/site/logo";
import { SiteHeader } from "@/components/site/header";
import { BUILD_CREDIT, OFFICIAL_PORTAL, PRODUCT_NAME } from "@/lib/constants";
import { OFFICIAL_HELPDESK } from "@/lib/nav";
import { cn } from "@/lib/utils";

export { SiteHeader };

export function TrustBanner() {
  return (
    <div className="border-b border-accent/50 bg-warning px-4 py-2 text-sm text-warning-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 font-medium leading-snug">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            You are on an <strong>independent prototype</strong>, not a Government of India website.
            No real visa is issued here.
          </span>
        </p>
        <p className="pl-6 sm:pl-0">
          Official e-Visa:{" "}
          <a
            className="font-medium underline underline-offset-2"
            href={OFFICIAL_PORTAL}
            target="_blank"
            rel="noreferrer"
          >
            indianvisaonline.gov.in
          </a>
        </p>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto">
      <div className="border-t border-border bg-card px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 text-center text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:justify-between">
          <span>{BUILD_CREDIT}</span>
          <span>Independent prototype</span>
          <span>No official logos used as endorsement</span>
        </div>
      </div>
      <div className="bg-navy px-4 py-6 text-sm text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <SahajEmblem className="size-10" />
            <div className="max-w-xl space-y-2 text-white/80">
              <p>
                {PRODUCT_NAME} is a product prototype designed and built with ChatGPT. It is not affiliated with the
                Ministry of Home Affairs, the Bureau of Immigration, NIC, or indianvisaonline.gov.in.
              </p>
              <p>Payment, biometrics, IVFRT, and immigration clearance are mocked. Form session, status, and the deterministic pre-check are working in this demo.</p>
            </div>
          </div>
          <EVisaMark className="self-end" />
        </div>
        <div className="mx-auto mt-5 flex max-w-6xl flex-wrap gap-x-4 gap-y-1 border-t border-white/15 pt-4 text-xs text-white/70">
          <Link className="hover:text-white" href="/instructions">
            Privacy
          </Link>
          <Link className="hover:text-white" href="/instructions">
            Terms
          </Link>
          <Link className="hover:text-white" href="/faqs">
            Help
          </Link>
          <Link className="hover:text-white" href="/contact">
            Contact
          </Link>
          <span className="sm:ml-auto">Last updated 28 August 2026 · Demo only</span>
        </div>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden>›</span> : null}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageMasthead({
  kicker,
  title,
  subtitle,
  tone = "navy",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  tone?: "navy" | "green";
}) {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:py-8">
        <SahajEmblem className="hidden size-12 sm:block" />
        <div className="min-w-0 flex-1 text-center">
          {kicker ? (
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
          ) : null}
          <h1
            className={cn(
              "font-heading text-3xl sm:text-4xl",
              tone === "green" ? "text-[color:oklch(0.42_0.12_155)]" : "text-primary",
            )}
          >
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p> : null}
        </div>
        <EVisaMark className="hidden sm:flex" />
      </div>
    </div>
  );
}

export function InfoCallout({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3 rounded-xl border border-primary/15 bg-info px-4 py-4 text-info-foreground", className)}>
      <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0 text-sm leading-relaxed">
        {title ? <p className="font-heading text-base text-primary">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}

export function AdvisoryCallout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-accent/60 bg-warning px-4 py-4 text-warning-foreground",
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-accent-foreground" aria-hidden />
      <div className="min-w-0 text-sm leading-relaxed">
        <p className="font-heading text-base text-accent-foreground">Advisory</p>
        {children}
      </div>
    </div>
  );
}

export function HelpdeskCard({ dark = false }: { dark?: boolean }) {
  return (
    <aside
      className={cn(
        "rounded-xl p-4",
        dark ? "bg-navy text-primary-foreground" : "border border-border bg-card",
      )}
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Phone className="size-4" aria-hidden />
        Visa helpdesk
      </p>
      <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-white/80" : "text-muted-foreground")}>
        {OFFICIAL_HELPDESK.note}
      </p>
      <p className="mt-3 text-sm font-medium">
        <a className="underline-offset-2 hover:underline" href={OFFICIAL_HELPDESK.phoneHref}>
          {OFFICIAL_HELPDESK.phone}
        </a>
      </p>
      <p className="text-sm">
        <a className="underline-offset-2 hover:underline" href={OFFICIAL_HELPDESK.emailHref}>
          {OFFICIAL_HELPDESK.email}
        </a>
      </p>
    </aside>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4", className)}>{children}</div>;
}
