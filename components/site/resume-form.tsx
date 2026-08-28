"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApplicationApi } from "@/lib/api";
import { useDraft } from "@/lib/draft-store";
import { FORMAT_SPECS } from "@/lib/input-format";
import { Field, TextInput } from "@/components/apply/field";

export function ResumeForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const needle = FORMAT_SPECS.applicationId.sanitize(id);
    const formatError = FORMAT_SPECS.applicationId.validate(needle);
    if (formatError) {
      toast.error(formatError);
      return;
    }
    setBusy(true);
    try {
      const { application } = await getApplicationApi(needle);
      useDraft.getState().hydrateFromServer(application);
      if (application.status === "draft") {
        router.push("/apply");
      } else {
        router.push(`/status/${application.id}`);
      }
    } catch {
      toast.error("No application with that ID on this server. Drafts live in this demo’s memory.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "flex flex-col gap-3 sm:flex-row sm:items-end" : "space-y-3"}>
      <div className="min-w-0 flex-1">
        <Field label="Resume with application ID" htmlFor="resume-id" hint={compact ? undefined : "Printed as SV-26-XXXXXX on the form once it first saves."}>
          <TextInput
            id="resume-id"
            format="applicationId"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="SV-26-XXXXXX"
            autoComplete="off"
            spellCheck={false}
          />
        </Field>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg border border-border bg-card px-5 text-base font-medium disabled:opacity-50"
      >
        {busy ? "Looking…" : "Open"}
      </button>
    </form>
  );
}
