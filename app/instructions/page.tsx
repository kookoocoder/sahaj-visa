import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, InfoCallout, PageMasthead } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Instructions" };

export default function InstructionsPage() {
  return (
    <div>
      <PageMasthead title="Instructions" subtitle="How to use this prototype without losing a draft" />
      <Container className="max-w-3xl py-6 sm:py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Instructions" }]} />
        <div className="mt-6 space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading text-2xl">Before you start</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>This is not the Government of India portal. No real visa is issued.</li>
              <li>Have a passport valid for at least six months after you intend to land.</li>
              <li>Have a face photograph and a biodata-page scan ready. We can square-crop on your phone.</li>
              <li>Apply as one adult. Family batching is out of scope for the demo.</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="font-heading text-2xl">How drafts work here</h2>
            <p className="text-muted-foreground">
              Every field autosaves. If the tab dies, come back and continue. Write down the
              application ID (starting with SV-26) once it appears — that is how you resume on another
              device in this demo.
            </p>
            <Link href="/apply" className="inline-flex h-11 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground">
              Start or continue an application
            </Link>
          </section>
          <section id="accessibility" className="scroll-mt-28 space-y-3">
            <h2 className="font-heading text-2xl">Screen reader access</h2>
            <InfoCallout>
              <p>
                Skip to main content is in the top bar. Text size can be increased with A+ / A / A-.
                Form fields have visible labels, error text is announced, and the human check is the
                word INDIA — not a distorted image.
              </p>
            </InfoCallout>
          </section>
          <section className="space-y-3">
            <h2 className="font-heading text-2xl">What we will not do</h2>
            <p className="text-muted-foreground">
              We will not scrape indianvisaonline.gov.in, take real card details, or claim a
              security clearance. Payment, biometrics, and IVFRT are mocked on purpose.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
