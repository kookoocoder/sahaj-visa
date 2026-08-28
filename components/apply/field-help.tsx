"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { FIELD_HELP } from "@/lib/visa-rules";

export function FieldHelp({ field }: { field: string }) {
  const canned = FIELD_HELP[field];
  const [open, setOpen] = useState(false);
  const answer = canned?.body || "No additional guidance is available for this field.";

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="inline-flex size-12 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-expanded={open}
        aria-label={`Help with ${canned?.title ?? field}`}
        onClick={() => setOpen((value) => !value)}
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
          <p className="leading-relaxed text-muted-foreground">{answer}</p>
          <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground/80">
            From the mock rules document
          </p>
        </div>
      )}
    </span>
  );
}
