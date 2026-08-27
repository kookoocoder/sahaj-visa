"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudOff,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextArea, TextInput } from "@/components/apply/field";
import { useDraft, draftToPayload } from "@/lib/draft-store";
import {
  getApplicationApi,
  payApi,
  reconcileApi,
  reviewApi,
  saveApplicationApi,
  submitApplicationApi,
} from "@/lib/api";
import { STEPS, type VisaForm } from "@/lib/types";
import { GENDERS } from "@/lib/types";
import {
  DEMO_EMAIL,
  FEE_USD,
  HUMAN_CHECK_PROMPT,
  NATIONALITIES,
  PORTS,
  VISA_PRODUCT_LABEL,
} from "@/lib/constants";
import { daysFromToday, formatMoney } from "@/lib/id";
import { fileToUpload } from "@/lib/photo";
import { cn } from "@/lib/utils";
import type { AiIssue } from "@/lib/types";

const GENDER_LABEL: Record<(typeof GENDERS)[number], string> = {
  female: "Female",
  male: "Male",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

function issuesByField(issues: AiIssue[] | undefined, field: string) {
  return issues?.filter((i) => i.field === field) ?? [];
}

function IssueList({ issues }: { issues: AiIssue[] }) {
  if (!issues.length) return null;
  return (
    <ul className="mt-1 space-y-1">
      {issues.map((issue) => (
        <li
          key={issue.issue}
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            issue.severity === "error" && "bg-destructive/10 text-destructive",
            issue.severity === "warning" && "bg-accent/40 text-foreground",
            issue.severity === "info" && "bg-muted text-muted-foreground",
          )}
        >
          <strong className="font-medium">{issue.issue}</strong>
          <span className="block">{issue.fix_suggestion}</span>
        </li>
      ))}
    </ul>
  );
}

export function Wizard() {
  const router = useRouter();
  const store = useDraft();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("idle");
  const [reviewing, setReviewing] = useState(false);
  const savingLock = useRef(false);
  const issues = store.aiReview?.issues;

  useEffect(() => {
    if (!store.hydrated) {
      const t = setTimeout(() => useDraft.setState({ hydrated: true }), 400);
      return () => clearTimeout(t);
    }
  }, [store.hydrated]);

  useEffect(() => {
    if (!store.hydrated || !store.id) return;
    getApplicationApi(store.id)
      .then(({ application }) => {
        if (application.status !== "draft" && application.payment.status === "confirmed") {
          router.replace(`/status/${application.id}`);
          return;
        }
        if (application.updatedAt > (store.lastSavedAt || "")) {
          store.hydrateFromServer(application);
        }
        setPaymentStatus(application.payment.status);
      })
      .catch(() => {
        /* local draft still applies */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.hydrated, store.id]);

  useEffect(() => {
    if (!store.hydrated) return;
    const handle = setTimeout(() => {
      void persist();
    }, 600);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.hydrated,
    store.form,
    store.photo,
    store.passportScan,
    store.currentStep,
  ]);

  async function persist() {
    if (!store.hydrated || savingLock.current) return;
    savingLock.current = true;
    store.markSaving();
    try {
      const { application } = await saveApplicationApi(draftToPayload());
      store.markSaved(application);
    } catch (err) {
      store.markError(err instanceof Error ? err.message : "Could not save");
    } finally {
      savingLock.current = false;
    }
  }

  function set<K extends keyof VisaForm>(key: K, value: VisaForm[K]) {
    store.setForm(key, value);
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function required(fields: (keyof VisaForm)[]) {
    const next: Record<string, string> = {};
    for (const key of fields) {
      const value = store.form[key];
      if (value === false || value === "" || value == null) {
        next[key] = "This field is needed to continue.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function next() {
    const step = store.currentStep;
    const ok =
      step === 0
        ? required(["givenNames", "surname", "dateOfBirth", "gender", "nationality", "email", "phone", "cityOfBirth", "countryOfBirth"])
        : step === 1
          ? required(["passportNumber", "passportIssueDate", "passportExpiryDate", "passportPlaceOfIssue"])
          : step === 2
            ? required(["arrivalDate", "departureDate", "portOfArrival", "addressInIndia", "cityInIndia", "purpose"])
            : step === 3
              ? store.photo && store.passportScan
                ? true
                : (toast.error("Add both a photo and a passport scan first."), false)
              : true;
    if (!ok) return;
    if (step === 3) await persist();
    store.setStep(Math.min(step + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    store.setStep(Math.max(store.currentStep - 1, 0));
  }

  async function onUpload(kind: "photo" | "passport", file: File, square: boolean) {
    setBusy(true);
    try {
      const upload = await fileToUpload(file, square);
      if (kind === "photo") store.setPhoto(upload);
      else store.setPassportScan(upload);
      toast.success(square ? "Square photo prepared on this device." : "File attached to your saved draft.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not read that file.");
    } finally {
      setBusy(false);
    }
  }

  async function runPrecheck() {
    setReviewing(true);
    try {
      const { application: saved } = await saveApplicationApi(draftToPayload());
      store.markSaved(saved);
      const { application } = await reviewApi(saved.id);
      store.hydrateFromServer(application);
      if (application.aiReview?.can_submit) {
        toast.success("Pre-check looks clear. You can submit.");
      } else {
        toast.message("Pre-check found issues — they are next to the fields, not dumped at the end.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Pre-check failed");
    } finally {
      setReviewing(false);
    }
  }

  async function submit() {
    if (!store.form.declaration) {
      setErrors({ declaration: "Confirm the declaration to submit." });
      return;
    }
    if (store.form.humanCheck.trim().toUpperCase() !== "INDIA") {
      setErrors({ humanCheck: "Type INDIA to confirm you are a person applying for yourself." });
      return;
    }
    setBusy(true);
    try {
      const { application: saved } = await saveApplicationApi(draftToPayload());
      const { application } = await submitApplicationApi(saved.id);
      store.hydrateFromServer(application);
      store.setStep(5);
      toast.success("Submitted. Your answers are locked. Pay when you are ready.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  async function pay(scenario: "success" | "decline" | "charged_unconfirmed") {
    if (!store.id) return;
    setBusy(true);
    try {
      const { application } = await payApi(store.id, scenario);
      if (application.payment.status === "confirmed") {
        toast.success("Payment confirmed. Opening your status.");
        router.push(`/status/${application.id}`);
        return;
      }
      store.hydrateFromServer(application);
      setPaymentStatus(application.payment.status);
      if (application.payment.status === "failed") {
        toast.error(application.payment.lastError || "Declined — retry is immediate.");
      } else {
        toast.message("Charged but not confirmed — the failure the live portal hides.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment error");
    } finally {
      setBusy(false);
    }
  }

  async function reconcile() {
    if (!store.id) return;
    setBusy(true);
    try {
      const { application } = await reconcileApi(store.id);
      toast.success("Reconciled on the same payment key. You were not charged twice.");
      router.push(`/status/${application.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reconcile");
    } finally {
      setBusy(false);
    }
  }

  function fillSample() {
    store.patchForm({
      givenNames: "Priya Anand",
      surname: "Shah",
      dateOfBirth: "1992-04-17",
      gender: "female",
      nationality: "United States of America",
      cityOfBirth: "Boston",
      countryOfBirth: "United States of America",
      email: DEMO_EMAIL,
      phone: "+1 415 555 0199",
      passportNumber: "X1234567",
      passportIssueDate: "2021-01-12",
      passportExpiryDate: "2031-01-11",
      passportPlaceOfIssue: "New York",
      arrivalDate: daysFromToday(14),
      departureDate: daysFromToday(24),
      portOfArrival: "DEL",
      addressInIndia: "12 Khan Market, New Delhi",
      cityInIndia: "New Delhi",
      purpose: "Tourism — family visit and museums.",
      declaration: true,
      humanCheck: "INDIA",
    });
    toast.message("Sample answers filled. Add a photo still — that’s the interesting part.");
  }

  const saveLabel = useMemo(() => {
    if (store.saveState === "saving") return "Saving…";
    if (store.saveState === "error") return store.saveError || "Save failed";
    if (store.saveState === "saved" && store.publicId) return `Saved · ${store.publicId}`;
    return "Draft saves as you go";
  }, [store.saveState, store.saveError, store.publicId]);

  if (!store.hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" /> Restoring your draft…
      </div>
    );
  }

  const step = store.currentStep;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
            store.saveState === "error"
              ? "border-destructive/40 text-destructive"
              : "border-border bg-card text-muted-foreground",
          )}
        >
          {store.saveState === "saving" ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : store.saveState === "error" ? (
            <CloudOff className="size-3.5" />
          ) : (
            <Cloud className="size-3.5" />
          )}
          {saveLabel}
        </p>
        <div className="flex gap-4">
          <button type="button" className="text-sm underline underline-offset-2" onClick={fillSample}>
            Fill sample answers
          </button>
          <button
            type="button"
            className="text-sm underline underline-offset-2"
            onClick={() => {
              store.reset();
              toast.message("Started a fresh draft on this device.");
            }}
          >
            Start over
          </button>
        </div>
      </div>

      <ol className="mb-8 grid grid-cols-6 gap-1">
        {STEPS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => store.setStep(i)}
              className={cn(
                "w-full rounded-lg px-1 py-2 text-center text-[11px] leading-tight sm:text-xs",
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/15 text-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              <span className="hidden sm:inline">{s.short}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="space-y-4">
          <h1 className="font-heading text-3xl">Who is travelling?</h1>
          <p className="text-muted-foreground">
            One adult, e-Tourist Visa only. Copy the passport. This draft is yours even if the tab dies.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Given names" htmlFor="givenNames" error={errors.givenNames}>
              <TextInput id="givenNames" autoComplete="given-name" value={store.form.givenNames} error={errors.givenNames} onChange={(e) => set("givenNames", e.target.value)} onBlur={() => void persist()} />
              <IssueList issues={issuesByField(issues, "givenNames")} />
            </Field>
            <Field label="Surname" htmlFor="surname" error={errors.surname}>
              <TextInput id="surname" autoComplete="family-name" value={store.form.surname} error={errors.surname} onChange={(e) => set("surname", e.target.value)} onBlur={() => void persist()} />
            </Field>
            <Field label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth}>
              <TextInput id="dateOfBirth" type="date" value={store.form.dateOfBirth} error={errors.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} onBlur={() => void persist()} />
            </Field>
            <Field label="Gender" htmlFor="gender" error={errors.gender}>
              <SelectInput id="gender" value={store.form.gender} error={errors.gender} onChange={(e) => set("gender", e.target.value as VisaForm["gender"])}>
                <option value="">Select</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{GENDER_LABEL[g]}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Nationality" htmlFor="nationality" error={errors.nationality} copilotField="nationality">
              <SelectInput id="nationality" value={store.form.nationality} error={errors.nationality} onChange={(e) => set("nationality", e.target.value)}>
                <option value="">Select (mocked list)</option>
                {NATIONALITIES.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Email" htmlFor="email" hint="Where a real ETA would be sent." error={errors.email}>
              <TextInput id="email" type="email" autoComplete="email" inputMode="email" value={store.form.email} error={errors.email} onChange={(e) => set("email", e.target.value)} onBlur={() => void persist()} />
            </Field>
            <Field label="Phone" htmlFor="phone" error={errors.phone}>
              <TextInput id="phone" type="tel" autoComplete="tel" value={store.form.phone} error={errors.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => void persist()} />
            </Field>
            <Field label="City of birth" htmlFor="cityOfBirth" error={errors.cityOfBirth}>
              <TextInput id="cityOfBirth" value={store.form.cityOfBirth} error={errors.cityOfBirth} onChange={(e) => set("cityOfBirth", e.target.value)} onBlur={() => void persist()} />
            </Field>
            <Field label="Country of birth" htmlFor="countryOfBirth" error={errors.countryOfBirth}>
              <TextInput id="countryOfBirth" value={store.form.countryOfBirth} error={errors.countryOfBirth} onChange={(e) => set("countryOfBirth", e.target.value)} onBlur={() => void persist()} />
            </Field>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <h1 className="font-heading text-3xl">Passport</h1>
          <p className="text-muted-foreground">Must stay valid six months after you land.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Passport number" htmlFor="passportNumber" error={errors.passportNumber}>
              <TextInput id="passportNumber" value={store.form.passportNumber} error={errors.passportNumber} onChange={(e) => set("passportNumber", e.target.value.toUpperCase())} onBlur={() => void persist()} />
            </Field>
            <Field label="Place of issue" htmlFor="passportPlaceOfIssue" error={errors.passportPlaceOfIssue}>
              <TextInput id="passportPlaceOfIssue" value={store.form.passportPlaceOfIssue} error={errors.passportPlaceOfIssue} onChange={(e) => set("passportPlaceOfIssue", e.target.value)} onBlur={() => void persist()} />
            </Field>
            <Field label="Issue date" htmlFor="passportIssueDate" error={errors.passportIssueDate}>
              <TextInput id="passportIssueDate" type="date" value={store.form.passportIssueDate} error={errors.passportIssueDate} onChange={(e) => set("passportIssueDate", e.target.value)} />
            </Field>
            <Field label="Expiry date" htmlFor="passportExpiryDate" error={errors.passportExpiryDate} copilotField="passportExpiryDate">
              <TextInput id="passportExpiryDate" type="date" value={store.form.passportExpiryDate} error={errors.passportExpiryDate} onChange={(e) => set("passportExpiryDate", e.target.value)} />
              <IssueList issues={issuesByField(issues, "passportExpiryDate")} />
            </Field>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h1 className="font-heading text-3xl">Travel</h1>
          <p className="text-muted-foreground">{VISA_PRODUCT_LABEL}. Apply with more than four days in hand — recent waits are often longer.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Intended arrival" htmlFor="arrivalDate" error={errors.arrivalDate} copilotField="arrivalDate">
              <TextInput id="arrivalDate" type="date" value={store.form.arrivalDate} error={errors.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} />
              <IssueList issues={issuesByField(issues, "arrivalDate")} />
            </Field>
            <Field label="Intended departure" htmlFor="departureDate" error={errors.departureDate}>
              <TextInput id="departureDate" type="date" value={store.form.departureDate} error={errors.departureDate} onChange={(e) => set("departureDate", e.target.value)} />
              <IssueList issues={issuesByField(issues, "departureDate")} />
            </Field>
            <Field label="Port of arrival" htmlFor="portOfArrival" error={errors.portOfArrival}>
              <SelectInput id="portOfArrival" value={store.form.portOfArrival} error={errors.portOfArrival} onChange={(e) => set("portOfArrival", e.target.value)}>
                <option value="">Select airport</option>
                {PORTS.map((p) => (
                  <option key={p.code} value={p.code}>{p.label}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="City in India" htmlFor="cityInIndia" error={errors.cityInIndia}>
              <TextInput id="cityInIndia" value={store.form.cityInIndia} error={errors.cityInIndia} onChange={(e) => set("cityInIndia", e.target.value)} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="First address in India" htmlFor="addressInIndia" error={errors.addressInIndia}>
                <TextInput id="addressInIndia" value={store.form.addressInIndia} error={errors.addressInIndia} onChange={(e) => set("addressInIndia", e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Purpose of visit" htmlFor="purpose" error={errors.purpose}>
                <TextArea id="purpose" value={store.form.purpose} error={errors.purpose} onChange={(e) => set("purpose", e.target.value)} />
              </Field>
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-6">
          <div>
            <h1 className="font-heading text-3xl">Photo and passport scan</h1>
            <p className="mt-2 text-muted-foreground">
              The live site rejects uploads for pixels and kilobytes without saying why. We square-crop on your phone first.
            </p>
          </div>
          <UploadCard
            title="Face photograph"
            hint="JPEG, square, light background. We can prepare that here."
            preview={store.photo}
            busy={busy}
            copilotField="photo"
            issues={issuesByField(issues, "photo")}
            onRaw={(f) => onUpload("photo", f, false)}
            onPrepare={(f) => onUpload("photo", f, true)}
            prepareLabel="Prepare a square photo"
          />
          <UploadCard
            title="Passport biodata page"
            hint="All four corners, no flash glare."
            preview={store.passportScan}
            busy={busy}
            copilotField="passportScan"
            issues={issuesByField(issues, "passportScan")}
            onRaw={(f) => onUpload("passport", f, false)}
            onPrepare={(f) => onUpload("passport", f, true)}
            prepareLabel="Square-crop the scan"
          />
        </section>
      )}

      {step === 4 && (
        <section className="space-y-5">
          <h1 className="font-heading text-3xl">Check, then submit</h1>
          <p className="text-muted-foreground">
            This pre-check is assistive, not a decision. On a real system the backend would still do the final validation.
          </p>
          <Button type="button" className="h-12 px-5 text-base" disabled={reviewing} onClick={() => void runPrecheck()}>
            {reviewing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Run rejection-risk scan
          </Button>
          {store.aiReview && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                {store.aiReview.source === "openai-vision" ? `OpenAI vision (${store.aiReview.model})` : "Rules engine (no API key, or images skipped)"}
              </p>
              <p className="mt-2 text-lg font-medium">{store.aiReview.summary}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Risk: {store.aiReview.overall_risk}
                {store.aiReview.can_submit ? " · clear to submit" : " · blocking issues remain"}
              </p>
              <IssueList issues={store.aiReview.issues} />
            </div>
          )}
          <Field label={HUMAN_CHECK_PROMPT} htmlFor="humanCheck" error={errors.humanCheck} copilotField="humanCheck">
            <TextInput id="humanCheck" value={store.form.humanCheck} error={errors.humanCheck} onChange={(e) => set("humanCheck", e.target.value)} autoComplete="off" />
          </Field>
          <label className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <input
              type="checkbox"
              className="mt-1 size-5"
              checked={store.form.declaration}
              onChange={(e) => set("declaration", e.target.checked)}
            />
            <span>
              I understand this is a prototype, answers cannot be edited after submit, and a real e-Visa fee is
              non-refundable. No real payment will be taken here.
            </span>
          </label>
          {errors.declaration && <p className="text-sm text-destructive">{errors.declaration}</p>}
        </section>
      )}

      {step === 5 && (
        <section className="space-y-5">
          <h1 className="font-heading text-3xl">Pay {formatMoney(FEE_USD)}</h1>
          <p className="text-muted-foreground">
            Mock gateway. Same idempotency key on every retry: {store.id ? "locked to this application" : "will lock after save"}.
            No 30-minute lockout. No silent double charge.
          </p>
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <p><strong>Product</strong> {VISA_PRODUCT_LABEL}</p>
            <p><strong>Amount</strong> {formatMoney(FEE_USD)} (no 2.5% surcharge in this demo)</p>
            <p><strong>Status</strong> {store.id ? "application submitted, waiting for payment" : "save first"}</p>
          </div>
          <div className="grid gap-3">
            <Button className="h-12 px-5 text-base" disabled={busy} onClick={() => void pay("success")}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              Pay successfully
            </Button>
            <Button variant="outline" className="h-12 px-5 text-base" disabled={busy} onClick={() => void pay("decline")}>
              Simulate decline (retry immediately)
            </Button>
            <Button variant="secondary" className="h-12 px-5 text-base" disabled={busy} onClick={() => void pay("charged_unconfirmed")}>
              Simulate “charged, not confirmed”
            </Button>
          </div>
          {paymentStatus === "charged_unconfirmed" && (
            <div className="space-y-3 rounded-xl border border-accent bg-accent/20 p-4">
              <p className="font-medium">We can see a charge may have gone through.</p>
              <p className="text-sm text-muted-foreground">
                The live portal would leave you guessing and lock retries for 30–120 minutes. We keep the same
                payment key and let you reconcile — not pay again.
              </p>
              <Button className="h-12 px-5 text-base" disabled={busy} onClick={() => void reconcile()}>
                Confirm payment received (no second charge)
              </Button>
            </div>
          )}
          {paymentStatus === "failed" && (
            <p className="text-sm text-destructive">
              Declined in this simulation. Retry whenever you want — there is no lockout.
            </p>
          )}
        </section>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="outline" className="h-12 px-4 text-base" disabled={step === 0 || step === 5 || busy} onClick={back}>
          <ChevronLeft className="size-4" /> Back
        </Button>
        {step < 4 && (
          <Button className="h-12 px-5 text-base" disabled={busy} onClick={() => void next()}>
            Continue <ChevronRight className="size-4" />
          </Button>
        )}
        {step === 4 && (
          <Button className="h-12 px-5 text-base" disabled={busy} onClick={() => void submit()}>
            Submit application <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function UploadCard({
  title,
  hint,
  preview,
  busy,
  onRaw,
  onPrepare,
  prepareLabel,
  issues,
  copilotField,
}: {
  title: string;
  hint: string;
  preview: { dataUrl: string; bytes: number; width?: number; height?: number; fileName: string; prepared?: boolean } | null;
  busy: boolean;
  onRaw: (file: File) => void;
  onPrepare: (file: File) => void;
  prepareLabel: string;
  issues: AiIssue[];
  copilotField: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Field label={title} hint={hint} copilotField={copilotField}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className={cn("relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-input bg-background px-4 text-sm font-medium", busy && "opacity-50")}>
            Upload as-is
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onRaw(file);
              }}
            />
          </label>
          <label className={cn("relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground", busy && "opacity-50")}>
            {prepareLabel}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPrepare(file);
              }}
            />
          </label>
        </div>
      </Field>
      {preview && (
        <div className="mt-4 flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.dataUrl} alt="" className="size-28 rounded-lg object-cover ring-1 ring-border" />
          <p className="text-sm text-muted-foreground">
            {preview.fileName}
            <br />
            {preview.width && preview.height ? `${preview.width}×${preview.height}px · ` : ""}
            {Math.round(preview.bytes / 1024)} KB
            {preview.prepared ? " · prepared on this device" : " · original file"}
          </p>
        </div>
      )}
      <IssueList issues={issues} />
    </div>
  );
}
