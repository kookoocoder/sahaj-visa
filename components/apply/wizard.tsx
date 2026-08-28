"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ReactNode } from "react";
import { Field, SelectInput, TextArea, TextInput, SavePulseContext } from "@/components/apply/field";
import { HelpdeskCard, InfoCallout } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";
import { useDraft, draftToPayload } from "@/lib/draft-store";
import {
  getApplicationApi,
  precheckApi,
  saveApplicationApi,
  submitApplicationApi,
} from "@/lib/api";
import { STEPS, type VisaForm } from "@/lib/types";
import { GENDERS } from "@/lib/types";
import { FORMAT_SPECS, sanitizeFormValue, validateVisaFields } from "@/lib/input-format";
import { HUMAN_CHECK_PROMPT, NATIONALITIES, OFFICIAL_PORTAL, PORTS, VISA_PRODUCT_LABEL } from "@/lib/constants";
import { fileToUpload } from "@/lib/photo";
import { cn } from "@/lib/utils";
import type { ReviewIssue } from "@/lib/types";

const STEP_ICONS = ["person", "menu_book", "flight", "photo_camera", "fact_check", "open_in_new"] as const;

function AccordionStep({
  index,
  title,
  active,
  done,
  disabled = false,
  onOpen,
  children,
}: {
  index: number;
  title: string;
  active: boolean;
  done: boolean;
  disabled?: boolean;
  onOpen: () => void;
  children: ReactNode;
}) {
  return (
    <section className="ux4g-accordion__item">
      <h2 className="ux4g-accordion__header">
        <button
          type="button"
          className={cn("ux4g-accordion__button", !active && "collapsed")}
          aria-expanded={active}
          disabled={disabled}
          onClick={onOpen}
        >
          <span className="ux4g-accordion__button-content ux4g-d-flex ux4g-ai-center ux4g-gap-x-s">
            <span className="ux4g-stepper-head-icon">{done && !active ? <Icon name="check" /> : index + 1}</span>
            <span className="ux4g-accordion__title">{title}</span>
          </span>
        </button>
      </h2>
      {active ? <div className="ux4g-accordion__body">{children}</div> : null}
    </section>
  );
}

function GuidelinesPanel({ step }: { step: number }) {
  return (
    <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-s">
      <div className="ux4g-card ux4g-card-outline ux4g-card-vertical">
        <div className="ux4g-card-body">
          <p className="ux4g-card-title">Documents to be uploaded</p>
          <ul className="sahaj-list ux4g-body-xs-default ux4g-mt-xs">
            <li>Face photograph (JPEG, square, light background)</li>
            <li>Passport biodata page (all four corners visible)</li>
          </ul>
        </div>
      </div>
      <div className="ux4g-alert ux4g-alert-warning">
        <Icon name="photo_camera" className="ux4g-alert-icon" />
        <div className="ux4g-alert-content ux4g-d-flex ux4g-flex-column">
          <p className="ux4g-alert-title">Photo guidelines</p>
          <ul className="sahaj-list ux4g-alert-message">
            <li>Recent, colour, face clearly visible</li>
            <li>We can square-crop on this device — no desktop required</li>
            <li>File issues are explained before you continue to submission</li>
          </ul>
        </div>
      </div>
      <div className="ux4g-alert ux4g-alert-success">
        <Icon name="cloud_done" className="ux4g-alert-icon" />
        <p className="ux4g-alert-message">
          {step < 5
            ? "You can save and continue later. Your application ID lets you return to this record."
            : "Your checked record remains available after you continue to the official application service."}
        </p>
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

function issuesByField(issues: ReviewIssue[] | undefined, field: string) {
  return issues?.filter((i) => i.field === field) ?? [];
}

function IssueList({ issues }: { issues: ReviewIssue[] }) {
  if (!issues.length) return null;
  return (
    <ul className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-xs ux4g-mt-xs">
      {issues.map((issue) => (
        <li key={issue.issue}>
          <div
            className={cn(
              "ux4g-alert ux4g-alert-wide",
              issue.severity === "error" && "ux4g-alert-error",
              issue.severity === "warning" && "ux4g-alert-warning",
              issue.severity === "info" && "ux4g-alert-info",
            )}
            role="status"
          >
            <div className="ux4g-alert-content ux4g-d-flex ux4g-flex-column">
              <p className="ux4g-alert-title">{issue.issue}</p>
              <p className="ux4g-alert-message">{issue.fix_suggestion}</p>
            </div>
          </div>
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
  const [reviewing, setReviewing] = useState(false);
  const [lastTouched, setLastTouched] = useState<string | null>(null);
  const [pulsedField, setPulsedField] = useState<string | null>(null);
  const savingPromise = useRef<Promise<boolean> | null>(null);
  const issues = store.precheck?.issues;

  useEffect(() => {
    if (!store.hydrated) {
      const t = setTimeout(() => useDraft.setState({ hydrated: true }), 400);
      return () => clearTimeout(t);
    }
    if (store.status === "draft" && store.currentStep > 4) {
      useDraft.setState({ currentStep: 4 });
    }
  }, [store.hydrated, store.status, store.currentStep]);

  useEffect(() => {
    if (!store.hydrated || !store.id) return;
    getApplicationApi(store.id)
      .then(({ application }) => {
        if (application.updatedAt > (store.lastSavedAt || "")) {
          store.hydrateFromServer(application);
        }
      })
      .catch(() => {
        /* local draft still applies */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.hydrated, store.id]);

  useEffect(() => {
    if (!store.hydrated || store.status !== "draft") return;
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
    store.status,
  ]);

  function persist(): Promise<boolean> {
    if (!store.hydrated) return Promise.resolve(false);
    if (store.status !== "draft") return Promise.resolve(true);
    if (savingPromise.current) {
      return savingPromise.current.then(() => persist());
    }

    const operation = (async () => {
      store.markSaving();
      try {
        const { application } = await saveApplicationApi(draftToPayload());
        store.markSaved(application);
        if (lastTouched) setPulsedField(lastTouched);
        return true;
      } catch (err) {
        store.markError(err instanceof Error ? err.message : "Could not save");
        return false;
      } finally {
        savingPromise.current = null;
      }
    })();
    savingPromise.current = operation;
    return operation;
  }

  function set<K extends keyof VisaForm>(key: K, value: VisaForm[K]) {
    store.setForm(key, sanitizeFormValue(key, value));
    setLastTouched(key);
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  }

  function checkFields(fields: (keyof VisaForm)[]) {
    const next = validateVisaFields(store.form, fields);
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function blurField(key: keyof VisaForm) {
    const message = validateVisaFields(store.form, [key])[key];
    setErrors((e) => {
      if (message) return { ...e, [key]: message };
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
    void persist();
  }

  async function next() {
    const step = store.currentStep;
    const ok =
      step === 0
        ? checkFields(["givenNames", "surname", "dateOfBirth", "gender", "nationality", "email", "phone", "cityOfBirth", "countryOfBirth"])
        : step === 1
          ? checkFields(["passportNumber", "passportIssueDate", "passportExpiryDate", "passportPlaceOfIssue"])
          : step === 2
            ? checkFields(["arrivalDate", "departureDate", "portOfArrival", "addressInIndia", "cityInIndia", "purpose"])
            : step === 3
              ? store.photo && store.passportScan
                ? true
                : (toast.error("Add both a photo and a passport scan first."), false)
              : true;
    if (!ok) return;
    if (step === 3 && !(await persist())) {
      toast.error("Your documents could not be saved. Check your connection and try again.");
      return;
    }
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
      const { application } = await precheckApi(saved.id);
      store.hydrateFromServer(application);
      if (application.precheck?.can_submit) {
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
    const submitErrors = validateVisaFields(store.form, [
      "givenNames",
      "surname",
      "dateOfBirth",
      "gender",
      "nationality",
      "email",
      "phone",
      "cityOfBirth",
      "countryOfBirth",
      "passportNumber",
      "passportIssueDate",
      "passportExpiryDate",
      "passportPlaceOfIssue",
      "arrivalDate",
      "departureDate",
      "portOfArrival",
      "addressInIndia",
      "cityInIndia",
      "purpose",
      "declaration",
      "humanCheck",
    ]);
    if (Object.keys(submitErrors).length) {
      setErrors(submitErrors);
      toast.error("Fix the highlighted fields. Each one must match the official format.");
      return;
    }
    setBusy(true);
    try {
      const { application: saved } = await saveApplicationApi(draftToPayload());
      const { application } = await submitApplicationApi(saved.id);
      store.hydrateFromServer(application);
      store.setStep(5);
      toast.success("Preparation complete. Your checked application record is ready.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setBusy(false);
    }
  }

  const saveLabel = useMemo(() => {
    if (store.saveState === "saving") return "Saving…";
    if (store.saveState === "error") return store.saveError || "Save failed";
    if (store.saveState === "saved" && store.publicId) return `Saved · ${store.publicId}`;
    return "Draft saves as you go";
  }, [store.saveState, store.saveError, store.publicId]);

  if (!store.hydrated) {
    return (
      <div className="ux4g-d-flex ux4g-ai-center ux4g-jc-center ux4g-gap-x-xs" style={{ minHeight: "40vh" }}>
        <Icon name="progress_activity" className="ux4g-spinner-xs" /> Restoring your draft…
      </div>
    );
  }

  const step = store.currentStep;

  const nav = (
    <div className="ux4g-d-flex ux4g-flex-wrap ux4g-jc-between ux4g-ai-center ux4g-gap-x-s ux4g-gap-y-xs">
      <button type="button" className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" disabled={step === 0 || step === 5 || busy} onClick={back}>
        <Icon name="arrow_back" /> Back
      </button>
      <div className="ux4g-d-flex ux4g-flex-wrap ux4g-ai-center ux4g-gap-x-xs">
        <button
          type="button"
          className="ux4g-btn ux4g-btn-outline-neutral ux4g-btn-md"
          disabled={busy}
          onClick={() => {
            void persist().then((saved) => {
              if (saved) router.push("/");
              else toast.error("Save failed. Your draft is still open so you can try again.");
            });
          }}
        >
          Save & exit
        </button>
        {step < 4 && (
          <button type="button" className="ux4g-btn ux4g-btn-primary ux4g-btn-md" disabled={busy} onClick={() => void next()}>
            Save & Continue <Icon name="arrow_forward" />
          </button>
        )}
        {step === 4 && (
          <button type="button" className="ux4g-btn ux4g-btn-primary ux4g-btn-md" disabled={busy} onClick={() => void submit()}>
            Submit application <Icon name="arrow_forward" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <SavePulseContext.Provider value={pulsedField}>
    <div className="sahaj-wizard">
      <div className="sahaj-wizard-layout">
        <aside className="sahaj-wizard-sidebar">
          <nav className="ux4g-card ux4g-card-outline ux4g-card-vertical sahaj-step-nav" aria-label="Application steps">
            <div className="ux4g-card-header">
              <p lang="hi" className="sahaj-brand-hi">आवेदन प्रगति</p>
              <p className="ux4g-label-m-strong ux4g-mt-xs">Application progress</p>
            </div>
            <div className="ux4g-card-body">
              <ol>
                {STEPS.map((s, i) => {
                  const icon = STEP_ICONS[i];
                  const done = i < step;
                  const active = i === step;
                  const locked =
                    (store.status !== "draft" && i < 5) ||
                    (store.status === "draft" && i === 5);
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => store.setStep(i)}
                        disabled={locked}
                        aria-current={active ? "step" : undefined}
                        data-done={done && !active ? "true" : undefined}
                      >
                        <span className="sahaj-step-icon">
                          {done && !active ? <Icon name="check" /> : active ? <Icon name={icon} /> : i + 1}
                        </span>
                        <span>
                          <span className="ux4g-body-xs-default ux4g-text-neutral-tertiary">Step {i + 1}</span>
                          <span className="ux4g-label-m-default ux4g-d-block">{s.label}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </nav>
          <div className="ux4g-mt-s">
            <HelpdeskCard />
          </div>
        </aside>

        <div className="ux4g-min-w-0 ux4g-d-flex ux4g-flex-column ux4g-gap-y-s">
          <div className="ux4g-stepper ux4g-stepper-horizontal ux4g-stepper-bottom-line ux4g-stepper-mobile sahaj-wizard-mobile-only">
            {STEPS.slice(0, 5).map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "ux4g-stepper-step",
                  i < step && "completed",
                  i === step && "active",
                )}
              >
                {s.label}
              </div>
            ))}
          </div>

          <div className="ux4g-d-flex ux4g-flex-wrap ux4g-jc-between ux4g-ai-center ux4g-gap-x-s ux4g-gap-y-xs">
            <span
              className={cn(
                "ux4g-tag-tonal-neutral ux4g-d-inline-flex ux4g-ai-center ux4g-gap-x-xs",
                store.saveState === "error" && "ux4g-tag-tonal-error",
                store.saveState === "saved" && "ux4g-tag-tonal-success",
              )}
            >
              {store.saveState === "saving" ? (
                <Icon name="progress_activity" />
              ) : store.saveState === "error" ? (
                <Icon name="cloud_off" />
              ) : (
                <Icon name="cloud_done" />
              )}
              {saveLabel}
            </span>
            <button
              type="button"
              className="ux4g-btn ux4g-btn-text-neutral ux4g-btn-sm"
              onClick={() => {
                store.reset();
                toast.message("Started a fresh draft on this device.");
              }}
            >
              Start over
            </button>
          </div>

          <InfoCallout>
            <p>
              Note down your Application ID when it appears. Fields marked <span className="ux4g-text-error">*</span>{" "}
              are required. This guided form currently supports one adult applying for a 30-day e-Tourist Visa.
            </p>
          </InfoCallout>

          <div className="ux4g-accordion ux4g-accordion-arrow-right space-y-2">
            <AccordionStep
              index={0}
              title={STEPS[0].label}
              active={step === 0}
              done={step > 0}
              disabled={store.status !== "draft"}
              onOpen={() => store.setStep(0)}
            >
              <p className="ux4g-body-m-default ux4g-mb-s">
                Enter each detail exactly as it appears in your passport.
              </p>
              <div className="sahaj-form-grid-3">
                <Field label="Full name (as in passport)" htmlFor="fullName" hint="Filled from given name and surname.">
                  <TextInput
                    id="fullName"
                    readOnly
                    value={[store.form.givenNames, store.form.surname].filter(Boolean).join(" ")}
                    className="ux4g-bg-neutral-soft"
                  />
                </Field>
                <Field label="Given names" htmlFor="givenNames" hint={FORMAT_SPECS.personName.hint} error={errors.givenNames} helpField="givenNames" required>
                  <TextInput id="givenNames" format="personName" autoComplete="given-name" value={store.form.givenNames} error={errors.givenNames} onChange={(e) => set("givenNames", e.target.value)} onBlur={() => blurField("givenNames")} />
                  <IssueList issues={issuesByField(issues, "givenNames")} />
                </Field>
                <Field label="Surname / family name" htmlFor="surname" hint={FORMAT_SPECS.personName.hint} error={errors.surname} required>
                  <TextInput id="surname" format="personName" autoComplete="family-name" value={store.form.surname} error={errors.surname} onChange={(e) => set("surname", e.target.value)} onBlur={() => blurField("surname")} />
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
                <Field label="Nationality" htmlFor="nationality" error={errors.nationality} helpField="nationality" required>
                  <SelectInput id="nationality" value={store.form.nationality} error={errors.nationality} onChange={(e) => set("nationality", e.target.value)}>
                    <option value="">Select nationality</option>
                    {NATIONALITIES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Country of birth" htmlFor="countryOfBirth" hint={FORMAT_SPECS.place.hint} error={errors.countryOfBirth} required>
                  <TextInput id="countryOfBirth" format="place" value={store.form.countryOfBirth} error={errors.countryOfBirth} onChange={(e) => set("countryOfBirth", e.target.value)} onBlur={() => blurField("countryOfBirth")} />
                </Field>
                <Field label="Place of birth" htmlFor="cityOfBirth" hint={FORMAT_SPECS.place.hint} error={errors.cityOfBirth} required>
                  <TextInput id="cityOfBirth" format="place" value={store.form.cityOfBirth} error={errors.cityOfBirth} onChange={(e) => set("cityOfBirth", e.target.value)} onBlur={() => blurField("cityOfBirth")} />
                </Field>
                <Field label="Email" htmlFor="email" hint={FORMAT_SPECS.email.hint} error={errors.email} required>
                  <TextInput id="email" type="email" format="email" autoComplete="email" value={store.form.email} error={errors.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blurField("email")} />
                </Field>
                <Field label="Mobile number" htmlFor="phone" hint={FORMAT_SPECS.mobile.hint} error={errors.phone} helpField="phone" required>
                  <TextInput id="phone" type="tel" format="mobile" autoComplete="tel" value={store.form.phone} error={errors.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blurField("phone")} />
                </Field>
              </div>
              <div className="ux4g-mt-m sahaj-wizard-desktop-only">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={1}
              title={STEPS[1].label}
              active={step === 1}
              done={step > 1}
              disabled={store.status !== "draft"}
              onOpen={() => store.setStep(1)}
            >
              <p className="ux4g-body-m-default ux4g-mb-s">Must stay valid six months after you land.</p>
              <div className="sahaj-form-grid">
                <Field
                  label="Passport number"
                  htmlFor="passportNumber"
                  hint={FORMAT_SPECS.passport.hint}
                  error={errors.passportNumber}
                  helpField="passportNumber"
                  required
                  why="We match this to the biodata page so a mistyped number is caught before you pay, not at the airport."
                >
                  <TextInput id="passportNumber" format="passport" value={store.form.passportNumber} error={errors.passportNumber} onChange={(e) => set("passportNumber", e.target.value)} onBlur={() => blurField("passportNumber")} />
                </Field>
                <Field label="Place of issue" htmlFor="passportPlaceOfIssue" hint={FORMAT_SPECS.place.hint} error={errors.passportPlaceOfIssue} required>
                  <TextInput id="passportPlaceOfIssue" format="place" value={store.form.passportPlaceOfIssue} error={errors.passportPlaceOfIssue} onChange={(e) => set("passportPlaceOfIssue", e.target.value)} onBlur={() => blurField("passportPlaceOfIssue")} />
                </Field>
                <Field label="Issue date" htmlFor="passportIssueDate" error={errors.passportIssueDate} required>
                  <TextInput id="passportIssueDate" type="date" value={store.form.passportIssueDate} error={errors.passportIssueDate} onChange={(e) => set("passportIssueDate", e.target.value)} onBlur={() => blurField("passportIssueDate")} />
                </Field>
                <Field label="Expiry date" htmlFor="passportExpiryDate" error={errors.passportExpiryDate} helpField="passportExpiryDate" required>
                  <TextInput id="passportExpiryDate" type="date" value={store.form.passportExpiryDate} error={errors.passportExpiryDate} onChange={(e) => set("passportExpiryDate", e.target.value)} onBlur={() => blurField("passportExpiryDate")} />
                  <IssueList issues={issuesByField(issues, "passportExpiryDate")} />
                </Field>
              </div>
              <div className="ux4g-mt-m sahaj-wizard-desktop-only">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={2}
              title={STEPS[2].label}
              active={step === 2}
              done={step > 2}
              disabled={store.status !== "draft"}
              onOpen={() => store.setStep(2)}
            >
              <p className="ux4g-body-m-default ux4g-mb-s">
                {VISA_PRODUCT_LABEL}. Apply with more than four days in hand — recent waits are often longer.
              </p>
              <div className="sahaj-form-grid">
                <Field label="Intended arrival" htmlFor="arrivalDate" error={errors.arrivalDate} helpField="arrivalDate" required>
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
                <Field label="City in India" htmlFor="cityInIndia" hint={FORMAT_SPECS.place.hint} error={errors.cityInIndia} required>
                  <TextInput id="cityInIndia" format="place" value={store.form.cityInIndia} error={errors.cityInIndia} onChange={(e) => set("cityInIndia", e.target.value)} onBlur={() => blurField("cityInIndia")} />
                </Field>
                <div className="sahaj-form-span-2">
                  <Field label="First address in India" htmlFor="addressInIndia" hint={FORMAT_SPECS.address.hint} error={errors.addressInIndia} required>
                    <TextInput id="addressInIndia" format="address" value={store.form.addressInIndia} error={errors.addressInIndia} onChange={(e) => set("addressInIndia", e.target.value)} onBlur={() => blurField("addressInIndia")} />
                  </Field>
                </div>
                <div className="sahaj-form-span-2">
                  <Field label="Purpose of visit" htmlFor="purpose" hint={FORMAT_SPECS.purpose.hint} error={errors.purpose} required>
                    <TextArea id="purpose" format="purpose" value={store.form.purpose} error={errors.purpose} onChange={(e) => set("purpose", e.target.value)} onBlur={() => blurField("purpose")} />
                  </Field>
                </div>
              </div>
              <div className="ux4g-mt-m sahaj-wizard-desktop-only">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={3}
              title={STEPS[3].label}
              active={step === 3}
              done={step > 3}
              disabled={store.status !== "draft"}
              onOpen={() => store.setStep(3)}
            >
              <p className="ux4g-body-m-default ux4g-mb-s">
                Preview and prepare clear document files before continuing to the official portal.
              </p>
              <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-s">
                <UploadCard
                  title="Face photograph"
                  hint="JPEG, square, light background. We can prepare that here."
                  why="A compliant photo reduces avoidable upload errors. This file stays attached to your saved preparation record."
                  preview={store.photo}
                  busy={busy}
                  helpField="photo"
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
                  helpField="passportScan"
                  issues={issuesByField(issues, "passportScan")}
                  onRaw={(f) => onUpload("passport", f, false)}
                  onPrepare={(f) => onUpload("passport", f, true)}
                  prepareLabel="Square-crop the scan"
                />
              </div>
              <div className="ux4g-mt-m sahaj-wizard-desktop-only">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={4}
              title={STEPS[4].label}
              active={step === 4}
              done={step > 4}
              disabled={store.status !== "draft"}
              onOpen={() => store.setStep(4)}
            >
              <p className="ux4g-body-m-default ux4g-mb-s">
                This check reviews the information and file metadata available here. It is guidance, not an immigration decision.
              </p>
              <div className="ux4g-alert ux4g-alert-info ux4g-alert-wide ux4g-mb-s">
                <Icon name="info" className="ux4g-alert-icon" />
                <div className="ux4g-alert-content">
                  <p className="ux4g-alert-message">
                    The check covers field formats, dates, passport validity, and uploaded file dimensions and sizes.
                    The Government of India applies its own validation when you submit on the official portal.
                  </p>
                </div>
              </div>
              <button type="button" className="ux4g-btn ux4g-btn-primary ux4g-btn-md" disabled={reviewing} onClick={() => void runPrecheck()}>
                {reviewing ? <Icon name="progress_activity" /> : <Icon name="fact_check" />}
                Run rejection-risk scan
              </button>
              {store.precheck && (
                <div className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-mt-s">
                  <div className="ux4g-card-body">
                    <p className="ux4g-label-m-strong ux4g-text-neutral-tertiary">Application readiness check</p>
                    <p className="ux4g-title-m-strong ux4g-mt-xs">{store.precheck.summary}</p>
                    <p className="ux4g-body-m-default ux4g-mt-xs">
                      Risk: {store.precheck.overall_risk}
                      {store.precheck.can_submit ? " · clear to submit" : " · blocking issues remain"}
                    </p>
                    <IssueList issues={store.precheck.issues} />
                  </div>
                </div>
              )}
              <div className="ux4g-mt-s">
                <Field label={HUMAN_CHECK_PROMPT} htmlFor="humanCheck" error={errors.humanCheck} helpField="humanCheck" required>
                  <TextInput id="humanCheck" value={store.form.humanCheck} error={errors.humanCheck} onChange={(e) => set("humanCheck", e.target.value)} autoComplete="off" />
                </Field>
              </div>
              <label className={cn("ux4g-checkbox ux4g-checkbox-md ux4g-mt-s", errors.declaration && "ux4g-checkbox-error")}>
                <input
                  type="checkbox"
                  className="ux4g-checkbox-input"
                  checked={store.form.declaration}
                  onChange={(e) => set("declaration", e.target.checked)}
                />
                <span className="ux4g-radio-control">
                  <span className="ux4g-checkmark" />
                </span>
                <span className="ux4g-checkbox-content">
                  I confirm that I have checked these details against my passport and understand that visa submission,
                  payment, and approval take place only on the official Government of India portal.
                </span>
              </label>
              {errors.declaration ? (
                <p className="ux4g-body-xs-default ux4g-text-error ux4g-mt-xs" role="alert">
                  {errors.declaration}
                </p>
              ) : null}
              <div className="ux4g-mt-m sahaj-wizard-desktop-only">{nav}</div>
            </AccordionStep>

            <AccordionStep
              index={5}
              title={STEPS[5].label}
              active={step === 5}
              done={false}
              disabled={store.status === "draft"}
              onOpen={() => store.setStep(5)}
            >
              <div className="ux4g-card ux4g-card-solid ux4g-card-vertical">
                <div className="ux4g-card-body">
                  <span className="sahaj-step-icon" style={{ width: "2.75rem", height: "2.75rem" }}>
                    <Icon name="check" />
                  </span>
                  <h3 className="ux4g-title-m-strong ux4g-mt-s">Your preparation record is ready</h3>
                  <p className="ux4g-body-m-default ux4g-mt-xs">
                    Save your application ID before leaving this page. Sahaj Visa does not submit your visa,
                    accept government fees, or make an approval decision.
                  </p>
                  <dl className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-s ux4g-bg-neutral-elevated ux4g-p-m ux4g-radius-m">
                    <div>
                      <dt className="ux4g-body-xs-default ux4g-text-neutral-tertiary">Application ID</dt>
                      <dd className="ux4g-label-m-strong ux4g-mt-xs">{store.publicId}</dd>
                    </div>
                    <div>
                      <dt className="ux4g-body-xs-default ux4g-text-neutral-tertiary">Visa route</dt>
                      <dd className="ux4g-label-m-strong ux4g-mt-xs">{VISA_PRODUCT_LABEL}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-s">
                <button type="button" className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md" onClick={() => store.id && router.push(`/status/${store.id}`)}>
                  View saved record
                </button>
                <a
                  href={OFFICIAL_PORTAL}
                  target="_blank"
                  rel="noreferrer"
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-md"
                >
                  Continue to official portal <Icon name="open_in_new" />
                </a>
              </div>
            </AccordionStep>
          </div>
        </div>

        <aside className="sahaj-wizard-sidebar">
          <GuidelinesPanel step={step} />
        </aside>
      </div>

      <div className="ux4g-mt-s sahaj-wizard-mobile-only">
        <GuidelinesPanel step={step} />
      </div>

      <div className="sahaj-wizard-mobile-bar sahaj-wizard-mobile-only">
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
  helpField,
}: {
  title: string;
  hint: string;
  why?: string;
  preview: { dataUrl: string; bytes: number; width?: number; height?: number; fileName: string; prepared?: boolean } | null;
  busy: boolean;
  onRaw: (file: File) => void;
  onPrepare: (file: File) => void;
  prepareLabel: string;
  issues: ReviewIssue[];
  helpField: string;
}) {
  return (
    <div className="ux4g-card ux4g-card-outline ux4g-card-vertical">
      <div className="ux4g-card-body">
        <Field label={title} hint={hint} helpField={helpField} why={why}>
          <div className="sahaj-upload-actions">
            <label className={cn("ux4g-btn ux4g-btn-outline-neutral ux4g-btn-md sahaj-file-input-label", busy && "ux4g-opacity-50")}>
              Upload as-is
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onRaw(file);
                }}
              />
            </label>
            <label className={cn("ux4g-btn ux4g-btn-primary ux4g-btn-md sahaj-file-input-label", busy && "ux4g-opacity-50")}>
              {prepareLabel}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onPrepare(file);
                }}
              />
            </label>
          </div>
        </Field>
        {preview ? (
          <div className="ux4g-d-flex ux4g-ai-start ux4g-gap-x-s ux4g-mt-s">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.dataUrl} alt="" className="sahaj-upload-preview" />
            <p className="ux4g-body-m-default ux4g-text-neutral-tertiary">
              {preview.fileName}
              <br />
              {preview.width && preview.height ? `${preview.width}×${preview.height}px · ` : ""}
              {Math.round(preview.bytes / 1024)} KB
              {preview.prepared ? " · prepared on this device" : " · original file"}
            </p>
          </div>
        ) : null}
        <IssueList issues={issues} />
      </div>
    </div>
  );
}
