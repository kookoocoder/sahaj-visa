"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs, Container, PageMasthead } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";
import { getApplicationApi } from "@/lib/api";
import { useDraft } from "@/lib/draft-store";
import type { Application } from "@/lib/types";
import { OFFICIAL_PORTAL, VISA_PRODUCT_LABEL } from "@/lib/constants";
import { formatWhen } from "@/lib/id";

export default function ApplicationRecordPage() {
  const params = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    getApplicationApi(params.id)
      .then(({ application: saved }) => setApplication(saved))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Application not found"));
  }, [params.id]);

  if (error) {
    return (
      <div>
        <PageMasthead title="Application not found" />
        <Container className="ux4g-py-s">
          <p className="ux4g-body-m-default">
            Check the application ID and try again. If you started on this device, your local draft may still be available.
          </p>
          <Link className="ux4g-btn ux4g-btn-primary ux4g-btn-md ux4g-mt-s" href="/track">
            Find an application
          </Link>
        </Container>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="ux4g-d-flex ux4g-ai-center ux4g-jc-center ux4g-gap-x-xs" style={{ minHeight: "50vh" }}>
        <Icon name="progress_activity" /> Loading application…
      </div>
    );
  }

  const fullName = `${application.form.givenNames} ${application.form.surname}`.trim();
  const isDraft = application.status === "draft";

  return (
    <div>
      <PageMasthead title="Application Record" subtitle={application.publicId} image="/india/india-gate.jpg" />
      <Container className="ux4g-py-s">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/track", label: "My Application" }, { label: application.publicId }]} />

        <section className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-mt-s">
          <div className="ux4g-card-body">
            <div className="ux4g-d-flex ux4g-flex-wrap ux4g-jc-between ux4g-ai-center ux4g-gap-x-m ux4g-gap-y-s">
              <div className="ux4g-d-flex ux4g-gap-x-m">
                <Icon name={isDraft ? "edit" : "check_circle"} className="ux4g-fs-32 ux4g-text-primary" />
                <div>
                  <p className="ux4g-label-m-strong ux4g-text-primary">
                    {isDraft ? "In progress" : "Preparation complete"}
                  </p>
                  <h1 className="ux4g-title-m-strong">
                    {isDraft ? "Continue where you left off" : "Your details have passed the readiness check"}
                  </h1>
                  <p className="ux4g-body-xs-default">Last saved {formatWhen(application.updatedAt)}</p>
                </div>
              </div>
              {isDraft ? (
                <Link
                  href="/apply"
                  onClick={() => useDraft.getState().hydrateFromServer(application)}
                  className="ux4g-btn ux4g-btn-primary ux4g-btn-md"
                >
                  Continue editing
                </Link>
              ) : (
                <a href={OFFICIAL_PORTAL} target="_blank" rel="noreferrer" className="ux4g-btn ux4g-btn-primary ux4g-btn-md">
                  Open official portal <Icon name="open_in_new" />
                </a>
              )}
            </div>
          </div>
          <dl className="ux4g-grid ux4g-grid-auto-fit-250">
            {[
              ["Applicant", fullName || "Not entered"],
              ["Visa route", VISA_PRODUCT_LABEL],
              ["Passport", application.form.passportNumber ? `•••• ${application.form.passportNumber.slice(-4)}` : "Not entered"],
              ["Planned arrival", application.form.arrivalDate || "Not entered"],
            ].map(([label, value]) => (
              <div key={label} className="ux4g-p-m">
                <dt className="ux4g-body-xs-default">{label}</dt>
                <dd className="ux4g-label-m-strong">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {!isDraft && (
          <div className="sahaj-split sahaj-split-journey ux4g-mt-s">
            <section className="ux4g-card ux4g-card-outline ux4g-card-vertical">
              <div className="ux4g-card-body">
                <Icon name="fact_check" className="ux4g-fs-24 ux4g-text-primary" />
                <h2 className="ux4g-card-title ux4g-mt-xs">What was checked</h2>
                <ul className="sahaj-list ux4g-body-m-default ux4g-mt-xs">
                  <li>Required fields and accepted formats</li>
                  <li>Passport and travel date consistency</li>
                  <li>Photo and passport file metadata</li>
                </ul>
              </div>
            </section>
            <section className="ux4g-card ux4g-card-outline ux4g-card-vertical">
              <div className="ux4g-card-body">
                <Icon name="verified_user" className="ux4g-fs-24 ux4g-text-primary" />
                <h2 className="ux4g-card-title ux4g-mt-xs">Final submission</h2>
                <p className="ux4g-card-sub-title">
                  Visa fees, identity checks, submission, status updates, and approval are handled only by the Government of India.
                  Re-check every value when transferring it to the official form.
                </p>
              </div>
            </section>
          </div>
        )}

        <details className="ux4g-accordion__item ux4g-mt-s">
          <summary className="ux4g-accordion__button">Record activity</summary>
          <ol className="ux4g-accordion__body">
            {[...application.auditLog].reverse().map((event) => (
              <li key={event.id} className="ux4g-mb-m">
                <p className="ux4g-label-m-strong">{event.event.replaceAll("_", " ")}</p>
                <p className="ux4g-body-xs-default">{formatWhen(event.at)}{event.detail ? ` · ${event.detail}` : ""}</p>
              </li>
            ))}
          </ol>
        </details>
      </Container>
    </div>
  );
}
