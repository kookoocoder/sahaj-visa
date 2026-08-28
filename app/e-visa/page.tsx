import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, HelpdeskCard, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";
import { QuickActions } from "@/components/site/quick-actions";

export const metadata: Metadata = { title: "e-Visa application process" };

const STEPS = [
  { icon: "edit_document", title: "Prepare online", body: "Complete a guided form and save your application details securely." },
  { icon: "account_balance", title: "Submit and pay", body: "Continue to the official Government of India portal for submission and payment." },
  { icon: "mark_email_read", title: "Receive ETA", body: "If approved, the Bureau of Immigration sends your ETA by email." },
  { icon: "flight_takeoff", title: "Travel to India", body: "Carry a printed or digital copy of your ETA with your passport." },
];

const CATEGORIES = [
  "e-Tourist",
  "e-Business",
  "e-Medical",
  "e-Medical Attendant",
  "e-Conference",
  "e-Ayush",
  "e-Emergency",
  "e-Credit",
];

export default function EVisaPage() {
  return (
    <div>
      <PageMasthead
        kicker="ई-वीज़ा"
        title="India e-Visa"
        subtitle="Requirements, document preparation, and a guided application checklist"
        image="/india/taj.jpg"
        imageAlt="Taj Mahal, Agra"
      />
      <Container className="ux4g-py-xs">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "e-Visa Application" }]} />

        <ol className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-s">
          {STEPS.map((step, i) => (
            <li key={step.title} className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-relative">
              <div className="ux4g-card-body">
                <span className="ux4g-tag-tonal-primary">{i + 1}</span>
                <Icon name={step.icon} className="ux4g-fs-32 ux4g-text-primary ux4g-mt-xs" />
                <p className="ux4g-card-title ux4g-mt-xs">{step.title}</p>
                <p className="ux4g-card-sub-title">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="sahaj-split sahaj-split-help ux4g-mt-s">
          <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-s">
            <div className="ux4g-alert ux4g-alert-warning">
              <Icon name="category" className="ux4g-alert-icon" />
              <div className="ux4g-alert-content ux4g-d-flex ux4g-flex-column">
                <p className="ux4g-alert-title">Choose the correct category</p>
                <p className="ux4g-alert-message">
                  The guided preparation form currently supports the 30-day e-Tourist route. For every
                  other category, review the requirements and apply directly on the official portal.
                </p>
                <ul className="ux4g-d-flex ux4g-flex-wrap ux4g-gap-x-xs ux4g-gap-y-xs ux4g-mt-xs">
                  {CATEGORIES.map((c) => (
                    <li key={c} className="ux4g-tag-tonal-neutral">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <InfoCallout title="Before you begin">
              <p>
                Keep your passport biodata page and a recent square photograph ready. Your passport
                should generally remain valid for at least six months from your planned arrival.
                Always confirm the current rule on the official portal.
              </p>
            </InfoCallout>
            <Link href="/apply" className="ux4g-btn ux4g-btn-primary ux4g-btn-lg">
              Apply here for e-Visa
              <Icon name="arrow_forward" />
            </Link>
            <QuickActions />
          </div>
          <HelpdeskCard />
        </div>
      </Container>
    </div>
  );
}
