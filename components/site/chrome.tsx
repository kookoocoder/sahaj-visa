import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { OFFICIAL_PORTAL, PRODUCT_NAME } from "@/lib/constants";

export function TrustBanner() {
  return (
    <div className="border-b border-accent/40 bg-accent/30 px-4 py-2.5 text-sm text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
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
            className="underline underline-offset-2"
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

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-heading text-xl tracking-tight">{PRODUCT_NAME}</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">prototype</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {!compact && (
            <Link className="hidden text-muted-foreground hover:text-foreground sm:inline" href="/#mocked">
              What’s mocked
            </Link>
          )}
          <Link className="text-muted-foreground hover:text-foreground" href="/login">
            Demo login
          </Link>
          <Link
            className="inline-flex min-h-12 items-center rounded-lg bg-primary px-4 font-medium text-primary-foreground"
            href="/apply"
          >
            Apply
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card px-4 py-8 text-sm text-muted-foreground">
      <div className="mx-auto max-w-5xl space-y-3">
        <p>
          {PRODUCT_NAME} is a hackathon prototype for “Build What Moves India”. It is not affiliated
          with the Ministry of Home Affairs, the Bureau of Immigration, NIC, or indianvisaonline.gov.in.
          No government logos are used as endorsement.
        </p>
        <p>
          Payment, biometrics, IVFRT, and immigration clearance are mocked. Form session, status, and
          the OpenAI vision pre-check are working in this demo.
        </p>
      </div>
    </footer>
  );
}
