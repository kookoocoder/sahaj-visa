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
      toast.error("No saved application matches that ID. Check every character and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={compact ? "sahaj-resume-inline" : "ux4g-d-flex ux4g-flex-column ux4g-gap-y-s"}
    >
      <div className="ux4g-min-w-0 ux4g-flex-1">
        <Field label="Resume with application ID" htmlFor="resume-id" hint={compact ? undefined : FORMAT_SPECS.applicationId.hint}>
          <TextInput
            id="resume-id"
            format="applicationId"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder={FORMAT_SPECS.applicationId.placeholder}
            autoComplete="off"
            spellCheck={false}
          />
        </Field>
      </div>
      <button type="submit" disabled={busy} className="ux4g-btn ux4g-btn-primary ux4g-btn-md">
        {busy ? "Looking…" : "Open"}
      </button>
    </form>
  );
}
