"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { SiteFooter, SiteHeader, TrustBanner } from "@/components/site/chrome";
import { Button } from "@/components/ui/button";
import { etaApi, getApplicationApi } from "@/lib/api";
import { useDraft } from "@/lib/draft-store";
import type { Application, ApplicationStatus } from "@/lib/types";
import { QUEUE_STATS } from "@/lib/constants";
import { formatWhen } from "@/lib/id";
import { cn } from "@/lib/utils";

const TRACK: { key: ApplicationStatus; label: string; hint: string }[] = [
  { key: "submitted", label: "Submitted", hint: "Answers locked. You will not be sent back to page 1." },
  { key: "payment_confirmed", label: "Payment confirmed", hint: "Idempotent. A glitch cannot quietly charge you twice." },
  { key: "under_review", label: "Under review", hint: "Mock queue — not IVFRT, not a security clearance." },
  { key: "eta_issued", label: "ETA issued", hint: "Prototype only. Print nothing; this is not a travel document." },
];

function rank(status: ApplicationStatus) {
  if (status === "eta_issued") return 3;
  if (status === "under_review") return 2;
  if (status === "payment_confirmed") return 1;
  if (
    status === "submitted" ||
    status === "payment_charged_unconfirmed" ||
    status === "payment_failed" ||
    status === "payment_pending"
  ) {
    return 0;
  }
  return -1;
}

export default function StatusPage() {
  const params = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loaded = useRef(false);

  async function load() {
    try {
      const { application } = await getApplicationApi(params.id);
      setApp(application);
      if (!application.etaMessage && application.status !== "draft") {
        const { application: next } = await etaApi(application.id);
        setApp(next);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not found");
    }
  }

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function issueEta() {
    if (!app) return;
    setBusy(true);
    try {
      const res = await fetch("/api/demo-eta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not issue ETA");
      setApp(body.application);
      toast.success("Mock ETA issued for the demo.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (error) {
    return (
      <>
        <TrustBanner />
        <SiteHeader />
        <main className="mx-auto max-w-lg flex-1 px-4 py-16">
          <h1 className="font-heading text-3xl">We could not find that application</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The ID in the address bar may be mistyped, or this draft was never saved. Your form on
            this device may still be on the apply page — you have not lost the day.
          </p>
          <Link
            className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-primary px-5 font-medium text-primary-foreground"
            href="/apply"
          >
            Return to the form
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!app) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" /> Loading status…
      </div>
    );
  }

  const current = rank(app.status);

  return (
    <>
      <TrustBanner />
      <SiteHeader compact />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Application {app.publicId}</p>
        <h1 className="mt-2 font-heading text-4xl leading-tight sm:text-5xl">
          About {QUEUE_STATS.p50}–{QUEUE_STATS.p90} days
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Median in this mock queue is {QUEUE_STATS.medianDays} days. This is not a promise, and it is
          not 72 hours.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {app.form.givenNames} {app.form.surname} · 30-day e-Tourist · updated {formatWhen(app.updatedAt)}
        </p>

        {app.status === "payment_charged_unconfirmed" && (
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <p className="font-medium">A charge may have gone through, and it is not yet confirmed.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              You do not need to pay again. Return to payment and confirm on the same key.
            </p>
            <Link className="mt-3 inline-flex min-h-12 items-center underline" href="/apply">
              Return to payment
            </Link>
          </div>
        )}

        <ol className="relative mt-10 space-y-0 border-l-2 border-border pl-6">
          {TRACK.map((item, i) => {
            const done = current > i;
            const active = current === i;
            return (
              <li key={item.key} className="relative pb-8 last:pb-0">
                <span
                  className={cn(
                    "absolute top-0 -left-[1.9rem] flex size-8 items-center justify-center rounded-full border",
                    done || active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                  )}
                >
                  {done || active ? <Check className="size-4" /> : <span className="text-xs">{i + 1}</span>}
                </span>
                <p className={cn("font-heading text-xl", active && "text-primary")}>{item.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
                {active ? (
                  <p className="mt-2 text-sm font-medium">You are here.</p>
                ) : null}
              </li>
            );
          })}
        </ol>

        <section className="mt-4 rounded-2xl border border-border bg-card p-5 sm:p-7">
          <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Honest estimate
          </h2>
          <p className="mt-3 font-heading text-2xl leading-snug sm:text-3xl">
            {app.etaMessage || "Fetching an honest estimate…"}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{QUEUE_STATS.sourceNote}</p>
        </section>

        {app.status === "under_review" && (
          <Button className="mt-6 h-12 px-5 text-base" disabled={busy} onClick={() => void issueEta()}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Issue mock ETA (demo shortcut)
          </Button>
        )}

        {app.status === "eta_issued" && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-card p-5">
            <h2 className="font-heading text-2xl">Electronic Travel Authorisation (mock)</h2>
            <p className="mt-2">
              This is not valid for travel. A real ETA is emailed by the Bureau of Immigration after
              clearance you will not get from this website.
            </p>
            {app.etaIssuedAt && <p className="mt-2 text-sm text-muted-foreground">Issued {formatWhen(app.etaIssuedAt)}</p>}
            <Link
              href="/apply"
              className="mt-4 inline-flex h-12 items-center rounded-lg bg-primary px-5 text-base font-medium text-primary-foreground"
              onClick={() => useDraft.getState().reset()}
            >
              Start a new application
            </Link>
          </div>
        )}

        <details className="mt-10 rounded-2xl border border-border bg-card open:pb-1">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 py-3 text-left">
            <span>
              <span className="font-heading text-xl">Audit log</span>
              <span className="mt-0.5 block text-sm font-normal text-muted-foreground">
                {app.auditLog.length} timestamped events · collapsed so the estimate stays readable
              </span>
            </span>
            <span className="text-sm text-muted-foreground">Show</span>
          </summary>
          <ol className="space-y-3 border-t border-border px-5 py-4">
            {[...app.auditLog].reverse().map((event) => (
              <li key={event.id} className="border-b border-border/70 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium">{event.event}</p>
                <p className="text-sm text-muted-foreground">
                  {formatWhen(event.at)}
                  {event.detail ? ` · ${event.detail}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </details>
      </main>
      <SiteFooter />
    </>
  );
}
