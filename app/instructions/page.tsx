import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";

export const metadata: Metadata = { title: "Instructions" };

export default function InstructionsPage() {
  return (
    <div>
      <PageMasthead
        kicker="आवश्यकताएँ"
        title="Application Requirements"
        subtitle="Prepare the details and documents needed for an India e-Visa"
        image="/india/jaipur.jpg"
        imageAlt="Hawa Mahal, Jaipur"
      />
      <Container className="ux4g-py-xs sahaj-narrow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Instructions" }]} />
        <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-s ux4g-mt-s">
          <section>
            <h2 className="ux4g-title-m-strong">Before you start</h2>
            <ul className="sahaj-list ux4g-body-m-default ux4g-mt-xs">
              <li>Confirm that your nationality and travel purpose are eligible on the official portal.</li>
              <li>Have a passport valid for at least six months after you intend to land.</li>
              <li>Have a face photograph and a biodata-page scan ready. We can square-crop on your phone.</li>
              <li>Complete a separate application record for each traveller.</li>
            </ul>
          </section>
          <section>
            <h2 className="ux4g-title-m-strong">How drafts work here</h2>
            <p className="ux4g-body-m-default ux4g-mt-xs">
              Every field autosaves. If the tab dies, come back and continue. Write down the
              application ID (starting with SV-26) once it appears — that is how you resume on another
              device.
            </p>
            <Link href="/apply" className="ux4g-btn ux4g-btn-primary ux4g-btn-md ux4g-mt-s">
              Start or continue an application
              <Icon name="arrow_forward" />
            </Link>
          </section>
          <section id="accessibility" className="scroll-mt-28">
            <h2 className="ux4g-title-m-strong">Screen reader access</h2>
            <InfoCallout className="ux4g-mt-xs">
              <p>
                Skip to main content is in the top bar. Text size can be increased from the accessibility bar.
                Form fields have visible labels, error text is announced, and the human check is the
                word INDIA — not a distorted image.
              </p>
            </InfoCallout>
          </section>
          <section>
            <h2 className="ux4g-title-m-strong">Submission and payment</h2>
            <p className="ux4g-body-m-default ux4g-mt-xs">
              Sahaj Visa helps you prepare and check information. Complete final submission, payment,
              status tracking, and any requested follow-up only on the Government of India portal.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
