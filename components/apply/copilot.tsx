"use client";

import { useState } from "react";
import { HelpCircle, Loader2, X } from "lucide-react";
import { assistApi } from "@/lib/api";
import { FIELD_HELP } from "@/lib/visa-rules";

export function Copilot({ field }: { field: string }) {
  const canned = FIELD_HELP[field];
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState(canned?.body ?? "");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("rules");

  async function ask() {
    setOpen(true);
    setLoading(true);
    try {
      const res = await assistApi(field, canned?.title || `Help me with ${field}`);
      setAnswer(res.answer);
      setSource(res.source);
    } catch {
      setAnswer(canned?.body || "The co-pilot could not reach the server. Read the field hint, or try again.");
      setSource("rules");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="inline-flex size-12 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-expanded={open}
        aria-label={`Help with ${canned?.title ?? field}`}
        onClick={() => (open ? setOpen(false) : ask())}
      >
        <HelpCircle className="size-4" />
      </button>
      {open && (
        <div
          role="note"
          className="absolute top-14 right-0 z-20 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-3 text-left text-sm shadow-lg"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="font-medium text-foreground">{canned?.title ?? "Help"}</p>
            <button type="button" className="rounded p-2 hover:bg-muted" onClick={() => setOpen(false)} aria-label="Close help">
              <X className="size-3.5" />
            </button>
          </div>
          {loading ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Looking at the mock rules…
            </p>
          ) : (
            <p className="leading-relaxed text-muted-foreground">{answer}</p>
          )}
          <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground/80">
            {source === "openai-text" ? "Phrased by a language model from our mock rules" : "From the mock rules document"}
          </p>
        </div>
      )}
    </span>
  );
}
