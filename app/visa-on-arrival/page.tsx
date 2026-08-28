import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";

export const metadata: Metadata = { title: "Visa on Arrival" };

const COUNTRIES = [
  {
    name: "Japan",
    body: "Eligible Japanese nationals may obtain Visa on Arrival at selected Indian airports, subject to live government rules.",
  },
  {
    name: "South Korea",
    body: "Eligible Republic of Korea nationals may use the same facility at selected airports.",
  },
  {
    name: "UAE",
    body: "Eligible UAE nationals may obtain Visa on Arrival where notified, with additional conditions on prior visas.",
  },
];

const ACTIONS = [
  { href: "https://indianvisaonline.gov.in/", label: "Check official eligibility", icon: "policy" },
  { href: "/instructions", label: "Review travel documents", icon: "description" },
  { href: "https://boi.gov.in/", label: "Bureau of Immigration", icon: "account_balance" },
];

export default function VisaOnArrivalPage() {
  return (
    <div>
      <PageMasthead
        kicker="आगमन पर वीज़ा"
        title="Visa on Arrival"
        subtitle="For eligible nationals of Japan, South Korea & UAE"
        image="/india/kerala.jpg"
        imageAlt="Houseboat on the Kerala backwaters"
      />
      <Container className="ux4g-py-xs">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Visa on Arrival" }]} />

        <InfoCallout title="Airport facility" className="ux4g-mt-s">
          <p>
            Visa on Arrival is a government facility at selected airports. Eligibility is narrow
            and conditions can change, so confirm the current rules before travelling.
          </p>
        </InfoCallout>

        <div className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-s">
          {COUNTRIES.map((c) => (
            <article key={c.name} className="ux4g-card ux4g-card-outline ux4g-card-vertical">
              <div className="ux4g-card-body">
                <p className="ux4g-card-title">{c.name}</p>
                <p className="ux4g-card-sub-title">{c.body}</p>
                <Link href="/instructions" className="ux4g-text-link-sm ux4g-mt-xs">
                  Know more
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-mt-s">
          <div className="ux4g-card-body">
            <h2 className="ux4g-card-title">Notes</h2>
            <div className="sahaj-split sahaj-split-journey ux4g-mt-xs">
              <ul className="sahaj-list ux4g-body-m-default">
                <li>Eligibility is set by the Government of India.</li>
                <li>Persons of Pakistani origin are typically excluded from this facility.</li>
                <li>Ordinary passports only — diplomatic and official passports follow a different route.</li>
                <li>Prior visa history can matter for UAE nationals. Check the live portal before you fly.</li>
              </ul>
              <ul className="sahaj-list ux4g-body-m-default">
                <li>Do not confuse Visa on Arrival with an e-Visa. They are different products.</li>
                <li>
                  If Visa on Arrival does not fit your trip,{" "}
                  <Link href="/apply" className="ux4g-text-link-sm">
                    prepare an e-Tourist application
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </div>
        </section>

        <ul className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-s">
          {ACTIONS.map((action) => (
            <li key={action.label}>
              <Link href={action.href} className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-w-100">
                <div className="ux4g-card-body ux4g-text-center">
                  <Icon name={action.icon} className="ux4g-fs-32 ux4g-text-primary" />
                  <span className="ux4g-card-title ux4g-mt-xs">{action.label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
