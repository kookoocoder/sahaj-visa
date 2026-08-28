import type { Metadata } from "next";
import { Breadcrumbs, Container, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { ResumeForm } from "@/components/site/resume-form";

export const metadata: Metadata = { title: "Track application" };

export default function TrackPage() {
  return (
    <div>
      <PageMasthead
        kicker="मेरा आवेदन"
        title="My Application"
        subtitle="Resume a saved draft or open your completed preparation record"
        image="/india/india-gate.jpg"
        imageAlt="India Gate, New Delhi"
      />
      <Container className="ux4g-py-xs sahaj-narrow-sm">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Track Application" }]} />
        <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-s ux4g-mt-s">
          <InfoCallout>
            <p>
              Enter the application ID shown when your draft was first saved. Drafts reopen in the guided form;
              completed records open in a read-only summary.
            </p>
          </InfoCallout>
          <div className="ux4g-card ux4g-card-outline ux4g-card-vertical">
            <div className="ux4g-card-body">
              <ResumeForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
