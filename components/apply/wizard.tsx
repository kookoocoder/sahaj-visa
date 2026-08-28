"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ReactNode } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  CloudOff,
  CreditCard,
  ImageIcon,
  Loader2,
  Plane,
  Sparkles,
  UserRound,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextArea, TextInput, SavePulseContext } from "@/components/apply/field";
import { HelpdeskCard, InfoCallout } from "@/components/site/chrome";
import { useDraft, draftToPayload } from "@/lib/draft-store";
import {
  getApplicationApi,
  payApi,
  reconcileApi,
  reviewApi,
  reviewStatusApi,
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

const STEP_ICONS = [UserRound, BookOpen, Plane, ImageIcon, ClipboardCheck, CreditCard] as const;

function AccordionStep({
  index,
  title,
  active,
  done,
  onOpen,
  children,
}: {
  index: number;
  title: string;
  active: boolean;
  done: boolean;
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <h2>
        <button
          type="button"
          className={cn(
            "flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors",
            active ? "bg-info text-primary" : "hover:bg-muted/70",
          )}
          aria-expanded={active}
          onClick={onOpen}
        >
          <span className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                active || done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {done && !active ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className="font-heading text-sm uppercase tracking-wide sm:text-base">{title}</span>
          </span>
          <ChevronRight className={cn("size-4 shrink-0 transition-transform duration-200", active && "rotate-90")} />
        </button>
      </h2>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          {active ? <div className="border-t border-border px-4 py-5 sm:px-6">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

function GuidelinesPanel({ step }: { step: number }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="font-heading text-sm uppercase tracking-wide text-primary">Documents to be uploaded</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Face photograph (JPEG, square, light background)</li>
          <li>Passport biodata page (all four corners visible)</li>
        </ul>
      </div>
      <div className="rounded-xl border border-accent/50 bg-warning p-4 text-sm text-warning-foreground">
        <p className="font-heading text-primary">Photo guidelines</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Recent, colour, face clearly visible</li>
          <li>We can square-crop on this device — no desktop required</li>
          <li>A rejection here is explained next to the field, not after you pay</li>
        </ul>
      </div>
      <div className="rounded-xl border border-[color:oklch(0.55_0.12_155/0.35)] bg-success p-4 text-sm text-success-foreground">
        {step < 5
          ? "You can save and continue later. Closing the tab does not restart page 1."
          : "After payment, status lives on its own page so you are not sent back to the form."}
      </div>
    </div>
  );
}

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
  const [lastTouched, setLastTouched] = useState<string | null>(null);
  const [pulsedField, setPulsedField] = useState<string | null>(null);
  const [hasVision, setHasVision] = useState<boolean | null>(null);
  const savingLock = useRef(false);
  const issues = store.aiReview?.issues;

  useEffect(() => {
    if (!store.hydrated) {
      const t = setTimeout(() => useDraft.setState({ hydrated: true }), 400);
      return () => clearTimeout(t);
    }
  }, [store.hydrated]);

  useEffect(() => {
    void reviewStatusApi()
      .then((s) => setHasVision(s.hasOpenAI))
      .catch(() => setHasVision(false));
  }, []);

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
      if (lastTouched) setPulsedField(lastTouched);
    } catch (err) {
      store.markError(err instanceof Error ? err.message : "Could not save");
    } finally {
      savingLock.current = false;
    }
  }

  function set<K extends keyof VisaForm>(key: K, value: VisaForm[K]) {
    store.setForm(key, value);
    setLastTouched(key);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        setPaymentStatus("failed");
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

  const nav = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button variant="outline" className="h-12 px-4 text-base" disabled={step === 0 || step === 5 || busy} onClick={back}>
        <ChevronLeft className="size-4" /> Back
      </Button>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          className="h-12 px-4 text-base"
          disabled={busy}
          onClick={() => {
            void persist().then(() => {
              router.push("/");
            });
          }}
        >
          Save & exit
        </Button>
        {step < 4 && (
          <Button className="h-12 px-5 text-base" disabled={busy} onClick={() => void next()}>
            Save & Continue <ChevronRight className="size-4" />
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

  return (
    <SavePulseContext.Provider value={pulsedField}>
    <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 lg:pb-10">
      <div className="grid items-start gap-6 lg:grid-cols-[15.5rem_minmax(0,1fr)_15.5rem]">
        <aside className="hidden space-y-4 lg:block lg:self-start">
          <nav className="overflow-hidden rounded-xl border border-border bg-card" aria-label="Application steps">
            <p className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Application progress
            </p>
            <ol>
              {STEPS.map((s, i) => {
                const Icon = STEP_ICONS[i];
                const done = i < step;
                const active = i === step;
                return (
                  <li key={s.id} className="border-b border-border last:border-0">
                    <button
                      type="button"
                      onClick={() => store.setStep(i)}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                        active && "bg-info font-medium text-primary",
                        done && !active && "text-foreground",
                        !active && !done && "text-muted-foreground hover:bg-muted/60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          active ? "bg-primary text-primary-foreground" : done ? "bg-primary/15 text-primary" : "bg-muted",
                        )}
                      >
                        {done && !active ? <Check className="size-4" /> : <Icon className="size-4" />}
                      </span>
                      <span>
                        <span className="block text-[11px] uppercase tracking-wide opacity-70">Step {i + 1}</span>
                        {s.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
          <HelpdeskCard />
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
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

          <InfoCallout>
            <p>
              Note down your Application ID when it appears. Fields marked <span className="text-destructive">*</span>{" "}
              are required. One adult, e-Tourist Visa only.
            </p>
          </InfoCallout>

          <div className="space-y-2">
            <AccordionStep
              index={0}
              title={STEPS[0].label}
              active={step === 0}
              done={step > 0}
              onOpen={() => store.setStep(0)}
            >
              <p className="mb-4 text-sm text-muted-foreground">
                Copy the passport. This draft is yours even if the tab dies.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Field label="Full name (as in passport)" htmlFor="fullName" hint="Filled from given name and surname.">
                  <TextInput
                    id="fullName"
                    readOnly
                    value={[store.form.givenNames, store.form.surname].filter(Boolean).join(" ")}
                    className="bg-muted/60"
                  />
                </Field>
                <Field label="Given names" htmlFor="givenNames" error={errors.givenNames} required>
                  <TextInput id="givenNames" autoComplete="given-name" value={store.form.givenNames} error={errors.givenNames} onChange={(e) => set("givenNames", e.target.value)} onBlur={() => void persist()} />
                  <IssueList issues={issuesByField(issues, "givenNames")} />
                </Field>
                <Field label="Surname / family name" htmlFor="surname" error={errors.surname} required>
                  <TextInput id="surname" autoComplete="family-name" value={store.form.surname} error={errors.surname} onChange={(e) => set("surname", e.target.value)} onBlur={() => void persist()} />
                </Field>
                <Field label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth} required>
                  <TextInput id="dateOfBirth" type="date" value={store.form.dateOfBirth} error={errors.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} onBlur={() => void persist()} />
                </Field>
                <Field label="Gender" htmlFor="gender" error={errors.gender} required>
                  <SelectInput id="gender" value={store.form.gender} error={errors.gender} onChange={(e) => set("gender", e.target.value as VisaForm["gender"])}>
                    <option value="">Select</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>{GENDER_LABEL[g]}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Nationality" htmlFor="nationality" error={errors.nationality} copilotField="nationality" required>
                  <SelectInput id="nationality" value={store.form.nationality} error={errors.nationality} onChange={(e) => set("nationality", e.target.value)}>
                    <option value="">Select (mocked list)</option>
                    {NATIONALITIES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Country of birth" htmlFor="countryOfBirth" error={errors.countryOfBirth} required>
                  <TextInput id="countryOfBirth" value={store.form.countryOfBirth} error={errors.countryOfBirth} onChange={(e) => set("countryOfBirth", e.target.value)} onBlur={() => void persist()} />
                </Field>
                <Field label="Place of birth" htmlFor="cityOfBirth" error={errors.cityOfBirth} required>
                  <TextInput id="cityOfBirth" value={store.form.cityOfBirth} error={errors.cityOfBirth} onChange={(e) => set("cityOfBirth", e.target.value)} onBlur={() => void persist()} />
                </Field>
                <Field label="Email" htmlFor="email" hint="Where a real ETA would be sent." error={errors.email} required>
                  <TextInput id="email" type="email" autoComplete="email" inputMode="email" value={store.form.email} error={errors.email} onChange={(e) => set("email", e.target.value)} onBlur={() => void persist()} />
                </Field>
                <Field label="Phone" htmlFor="phone" error={errors.phone} required>
                  <TextInput id="phone" type="tel" autoComplete="tel" value={store.form.phone} error={errors.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => void persist()} />
                </Field>
              </div>
              <div className="mt-6 hidden lg:block">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={1}
              title={STEPS[1].label}
              active={step === 1}
              done={step > 1}
              onOpen={() => store.setStep(1)}
            >
              <p className="mb-4 text-sm text-muted-foreground">Must stay valid six months after you land.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Passport number"
                  htmlFor="passportNumber"
                  error={errors.passportNumber}
                  required
                  why="We match this to the biodata page so a mistyped number is caught before you pay, not at the airport."
                >
                  <TextInput id="passportNumber" value={store.form.passportNumber} error={errors.passportNumber} onChange={(e) => set("passportNumber", e.target.value.toUpperCase())} onBlur={() => void persist()} />
                </Field>
                <Field label="Place of issue" htmlFor="passportPlaceOfIssue" error={errors.passportPlaceOfIssue} required>
                  <TextInput id="passportPlaceOfIssue" value={store.form.passportPlaceOfIssue} error={errors.passportPlaceOfIssue} onChange={(e) => set("passportPlaceOfIssue", e.target.value)} onBlur={() => void persist()} />
                </Field>
                <Field label="Issue date" htmlFor="passportIssueDate" error={errors.passportIssueDate} required>
                  <TextInput id="passportIssueDate" type="date" value={store.form.passportIssueDate} error={errors.passportIssueDate} onChange={(e) => set("passportIssueDate", e.target.value)} />
                </Field>
                <Field label="Expiry date" htmlFor="passportExpiryDate" error={errors.passportExpiryDate} copilotField="passportExpiryDate" required>
                  <TextInput id="passportExpiryDate" type="date" value={store.form.passportExpiryDate} error={errors.passportExpiryDate} onChange={(e) => set("passportExpiryDate", e.target.value)} />
                  <IssueList issues={issuesByField(issues, "passportExpiryDate")} />
                </Field>
              </div>
              <div className="mt-6 hidden lg:block">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={2}
              title={STEPS[2].label}
              active={step === 2}
              done={step > 2}
              onOpen={() => store.setStep(2)}
            >
              <p className="mb-4 text-sm text-muted-foreground">
                {VISA_PRODUCT_LABEL}. Apply with more than four days in hand — recent waits are often longer.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Intended arrival" htmlFor="arrivalDate" error={errors.arrivalDate} copilotField="arrivalDate" required>
                  <TextInput id="arrivalDate" type="date" value={store.form.arrivalDate} error={errors.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} />
                  <IssueList issues={issuesByField(issues, "arrivalDate")} />
                </Field>
                <Field label="Intended departure" htmlFor="departureDate" error={errors.departureDate} required>
                  <TextInput id="departureDate" type="date" value={store.form.departureDate} error={errors.departureDate} onChange={(e) => set("departureDate", e.target.value)} />
                  <IssueList issues={issuesByField(issues, "departureDate")} />
                </Field>
                <Field label="Port of arrival" htmlFor="portOfArrival" error={errors.portOfArrival} required>
                  <SelectInput id="portOfArrival" value={store.form.portOfArrival} error={errors.portOfArrival} onChange={(e) => set("portOfArrival", e.target.value)}>
                    <option value="">Select airport</option>
                    {PORTS.map((p) => (
                      <option key={p.code} value={p.code}>{p.label}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="City in India" htmlFor="cityInIndia" error={errors.cityInIndia} required>
                  <TextInput id="cityInIndia" value={store.form.cityInIndia} error={errors.cityInIndia} onChange={(e) => set("cityInIndia", e.target.value)} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="First address in India" htmlFor="addressInIndia" error={errors.addressInIndia} required>
                    <TextInput id="addressInIndia" value={store.form.addressInIndia} error={errors.addressInIndia} onChange={(e) => set("addressInIndia", e.target.value)} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Purpose of visit" htmlFor="purpose" error={errors.purpose} required>
                    <TextArea id="purpose" value={store.form.purpose} error={errors.purpose} onChange={(e) => set("purpose", e.target.value)} />
                  </Field>
                </div>
              </div>
              <div className="mt-6 hidden lg:block">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={3}
              title={STEPS[3].label}
              active={step === 3}
              done={step > 3}
              onOpen={() => store.setStep(3)}
            >
              <p className="mb-4 text-sm text-muted-foreground">
                The live site rejects uploads for pixels and kilobytes without saying why. We square-crop on your phone first.
              </p>
              <div className="space-y-4">
                <UploadCard
                  title="Face photograph"
                  hint="JPEG, square, light background. We can prepare that here."
                  why="The live portal often rejects photos without saying why. We store this on your draft so a closed tab does not mean starting the photo again."
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
              </div>
              <div className="mt-6 hidden lg:block">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={4}
              title={STEPS[4].label}
              active={step === 4}
              done={step > 4}
              onOpen={() => store.setStep(4)}
            >
              <p className="mb-4 text-sm text-muted-foreground">
                This pre-check is assistive, not a decision. On a real system the backend would still do the final validation.
              </p>
              {hasVision === false && (
                <p className="mb-4 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm">
                  OpenAI vision is not configured on this deployment. The scan will use the rules engine and will say so
                  in the result — it will not pretend to be an AI photo check.
                </p>
              )}
              {hasVision === true && (
                <p className="mb-4 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  OpenAI vision is on. The result will name the model if the photo check actually ran.
                </p>
              )}
              <Button type="button" className="h-12 px-5 text-base" disabled={reviewing} onClick={() => void runPrecheck()}>
                {reviewing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Run rejection-risk scan
              </Button>
              {store.aiReview && (
                <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">
                    {store.aiReview.source === "openai-vision"
                      ? `OpenAI vision ran (${store.aiReview.model})`
                      : "Rules engine — OpenAI vision did not run (no API key, the model failed, or no images)."}
                  </p>
                  <p className="mt-2 text-lg font-medium">{store.aiReview.summary}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Risk: {store.aiReview.overall_risk}
                    {store.aiReview.can_submit ? " · clear to submit" : " · blocking issues remain"}
                  </p>
                  <IssueList issues={store.aiReview.issues} />
                </div>
              )}
              <div className="mt-5">
                <Field label={HUMAN_CHECK_PROMPT} htmlFor="humanCheck" error={errors.humanCheck} copilotField="humanCheck" required>
                  <TextInput id="humanCheck" value={store.form.humanCheck} error={errors.humanCheck} onChange={(e) => set("humanCheck", e.target.value)} autoComplete="off" />
                </Field>
              </div>
              <label className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
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
              {errors.declaration && <p className="mt-2 text-sm text-destructive">{errors.declaration}</p>}
              <div className="mt-6 hidden lg:block">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={5}
              title={STEPS[5].label}
              active={step === 5}
              done={false}
              onOpen={() => store.setStep(5)}
            >
              <p className="mb-4 text-sm text-muted-foreground">
                Mock gateway. Same idempotency key on every retry: {store.id ? "locked to this application" : "will lock after save"}.
                No 30-minute lockout. No silent double charge.
              </p>
              <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
                <p><strong>Product</strong> {VISA_PRODUCT_LABEL}</p>
                <p><strong>Amount</strong> {formatMoney(FEE_USD)} (no 2.5% surcharge in this demo)</p>
                <p><strong>Status</strong> {store.id ? "application submitted, waiting for payment" : "save first"}</p>
              </div>
              <div className="mt-4 grid gap-3">
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
                <div className="mt-4 space-y-3 rounded-xl border border-accent bg-warning p-4">
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
                <div className="mt-4 space-y-3 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="font-medium">The card was declined.</p>
                  <p className="text-sm text-muted-foreground">
                    Nothing was taken. You can try again now. We will not lock you out for 30 minutes.
                  </p>
                </div>
              )}
            </AccordionStep>
          </div>
        </div>

        <aside className="hidden lg:block lg:self-start">
          <GuidelinesPanel step={step} />
        </aside>
      </div>

      <div className="mt-6 lg:hidden">
        <GuidelinesPanel step={step} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        {nav}
      </div>
    </div>
    </SavePulseContext.Provider>
  );
}

function UploadCard({
  title,
  hint,
  why,
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
  why?: string;
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
      <Field label={title} hint={hint} copilotField={copilotField} why={why}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className={cn("relative inline-flex h-12 min-h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-input bg-background px-4 text-sm font-medium", busy && "opacity-50")}>
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
          <label className={cn("relative inline-flex h-12 min-h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground", busy && "opacity-50")}>
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
