"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Circle, Loader2 } from "lucide-react";
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
          <p className="mt-3 text-muted-foreground">
            Server memory on a free host can reset. Your browser draft on /apply may still be there.
          </p>
          <Link className="mt-6 inline-block underline" href="/apply">Back to the form</Link>
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
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Application</p>
        <h1 className="font-heading text-4xl">{app.publicId}</h1>
        <p className="mt-2 text-muted-foreground">
          {app.form.givenNames} {app.form.surname} · 30-day e-Tourist · updated {formatWhen(app.updatedAt)}
        </p>

        {app.status === "payment_charged_unconfirmed" && (
          <div className="mt-6 rounded-xl border border-accent bg-accent/30 p-4">
            A charge may have gone through and is not yet confirmed.{" "}
            <Link className="underline" href="/apply">Return to payment</Link> to reconcile on the same key.
          </div>
        )}

        <ol className="mt-10 space-y-4">
          {TRACK.map((item, i) => {
            const done = current > i;
            const active = current === i;
            return (
              <li key={item.key} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-8 items-center justify-center rounded-full border",
                    done || active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                  )}
                >
                  {done || active ? <Check className="size-4" /> : <Circle className="size-3" />}
                </span>
                <div>
                  <p className={cn("font-medium", active && "text-primary")}>{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.hint}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <section className="mt-10 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl">When might this move?</h2>
          <p className="mt-3 leading-relaxed">{app.etaMessage || "Fetching an honest estimate…"}</p>
          <p className="mt-4 text-sm text-muted-foreground">{QUEUE_STATS.sourceNote}</p>
        </section>

        {app.status === "under_review" && (
          <Button className="mt-6 h-12 px-5 text-base" disabled={busy} onClick={() => void issueEta()}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Issue mock ETA (demo shortcut)
          </Button>
        )}

        {app.status === "eta_issued" && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-5">
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

        <section className="mt-10">
          <h2 className="font-heading text-2xl">Audit log</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Public research found no citizen-facing SLA log on the live portal. Every transition here is timestamped.
          </p>
          <ol className="mt-4 space-y-3 border-l border-border pl-4">
            {[...app.auditLog].reverse().map((event) => (
              <li key={event.id}>
                <p className="text-sm font-medium">{event.event}</p>
                <p className="text-sm text-muted-foreground">
                  {formatWhen(event.at)}
                  {event.detail ? ` · ${event.detail}` : ""}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
