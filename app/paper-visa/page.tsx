import type { Metadata } from "next";
import Link from "next/link";
import {
  AdvisoryCallout,
  Breadcrumbs,
  Container,
  HelpdeskCard,
  InfoCallout,
  PageMasthead,
} from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";

export const metadata: Metadata = { title: "Regular / Paper visa" };

const SIDEBAR = [
  { href: "https://indianvisaonline.gov.in/visa/", label: "Open official regular visa portal", icon: "open_in_new" },
  { href: "/instructions", label: "Review document requirements", icon: "description" },
  { href: "https://indianvisaonline.gov.in/visa/", label: "Resume or print official application", icon: "print" },
  { href: "/contact", label: "Find official support links", icon: "support_agent" },
];

export default function PaperVisaPage() {
  return (
    <div>
      <PageMasthead
        kicker="नियमित वीज़ा"
        title="Regular / Paper Visa"
        subtitle="Prepare online, then submit through the responsible Indian Mission or Post"
        image="/india/india-gate.jpg"
        imageAlt="India Gate, New Delhi"
      />
      <Container className="ux4g-py-xs">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/#visa-services", label: "Visa Categories" },
            { label: "Regular / Paper Visa Application" },
          ]}
        />

        <div className="sahaj-split sahaj-split-help ux4g-mt-s">
          <aside>
            <nav className="ux4g-card ux4g-card-solid ux4g-card-vertical" aria-label="Related services">
              <ul className="ux4g-f-link-list ux4g-p-m">
                {SIDEBAR.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-s ux4g-text-link-sm">
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="ux4g-mt-s">
              <HelpdeskCard />
            </div>
          </aside>

          <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-s">
            <ol className="ux4g-grid ux4g-grid-auto-fit-250">
              {[
                { n: "1", t: "Apply online", d: "Complete the regular visa form on the Government of India portal." },
                { n: "2", t: "Submit documents", d: "Print and sign the form, then submit the required documents and passport." },
                { n: "3", t: "Receive passport / visa", d: "Collection or return delivery is handled by the Mission or application centre." },
              ].map((step) => (
                <li key={step.n} className="ux4g-card ux4g-card-outline ux4g-card-vertical">
                  <div className="ux4g-card-body">
                    <span className="ux4g-tag-tonal-primary">{step.n}</span>
                    <p className="ux4g-card-title ux4g-mt-xs">{step.t}</p>
                    <p className="ux4g-card-sub-title">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <InfoCallout title="Instructions">
              <p>
                A regular visa is applied online and then submitted in person or by post to an Indian
                Mission. Requirements, appointment rules, fees, and processing times vary by location.
                Confirm them with the Mission responsible for your place of residence.
              </p>
              <Link href="/apply" className="ux4g-alert-link">
                Prepare an e-Tourist application
              </Link>
            </InfoCallout>
            <AdvisoryCallout>
              <p>
                Be cautious of anyone promising guaranteed or unofficial “emergency” approval.
                Use only the Mission’s published payment channels.
              </p>
            </AdvisoryCallout>
          </div>
        </div>
      </Container>
    </div>
  );
}
