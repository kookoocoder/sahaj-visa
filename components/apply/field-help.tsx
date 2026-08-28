"use client";

import { useState } from "react";
import { FIELD_HELP } from "@/lib/visa-rules";
import { Icon } from "@/components/site/icon";

export function FieldHelp({ field }: { field: string }) {
  const canned = FIELD_HELP[field];
  const [open, setOpen] = useState(false);
  const answer = canned?.body || "No additional guidance is available for this field.";

  return (
    <span className="ux4g-relative ux4g-d-inline-flex">
      <button
        type="button"
        className="ux4g-icon-btn ux4g-icon-btn-text-primary ux4g-icon-btn-md"
        aria-expanded={open}
        aria-label={`Help with ${canned?.title ?? field}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="help" />
      </button>
      {open && (
        <div role="note" className="ux4g-card ux4g-card-outline" style={{ position: "absolute", top: "3.5rem", right: 0, zIndex: 20, width: "min(18rem, calc(100vw - 2rem))" }}>
          <div className="ux4g-card-body">
            <div className="ux4g-d-flex ux4g-jc-between ux4g-ai-center">
              <p className="ux4g-card-title">{canned?.title ?? "Help"}</p>
              <button type="button" className="ux4g-icon-btn ux4g-icon-btn-text-primary ux4g-icon-btn-sm" onClick={() => setOpen(false)} aria-label="Close help">
                <Icon name="close" />
              </button>
            </div>
            <p className="ux4g-card-sub-title">{answer}</p>
            <p className="ux4g-body-xs-default ux4g-mt-xs">Application guidance</p>
          </div>
        </div>
      )}
    </span>
  );
}
