import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, HelpdeskCard, PageMasthead } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";
import { OFFICIAL_PORTAL, PRODUCT_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div>
      <PageMasthead
        kicker="संपर्क"
        title="Contact & Support"
        subtitle="Application guidance and official Government of India help channels"
        image="/india/mumbai.jpg"
        imageAlt="Gateway of India, Mumbai"
      />
      <Container className="ux4g-py-xs">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact Us" }]} />
        <div className="sahaj-split sahaj-split-journey ux4g-mt-s">
          <div className="ux4g-card ux4g-card-outline ux4g-card-vertical">
            <div className="ux4g-card-body">
              <h2 className="ux4g-card-title">{PRODUCT_NAME} application help</h2>
              <p className="ux4g-card-sub-title">
                Use your application ID to reopen a saved record. Field-specific guidance is also
                available beside inputs throughout the application.
              </p>
              <Link href="/track" className="ux4g-btn ux4g-btn-primary ux4g-btn-md ux4g-mt-s">
                Open my application
                <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
          <HelpdeskCard />
        </div>
        <section id="weblinks" className="ux4g-mt-s scroll-mt-28">
          <h2 className="ux4g-title-m-strong">Useful weblinks</h2>
          <ul className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-s">
            {[
              { href: OFFICIAL_PORTAL, label: "Official e-Visa portal" },
              { href: "https://www.mha.gov.in/", label: "Ministry of Home Affairs" },
              { href: "https://www.mea.gov.in/", label: "Ministry of External Affairs" },
              { href: "https://www.boi.gov.in/", label: "Bureau of Immigration" },
              { href: "https://www.india.gov.in/", label: "National Portal of India" },
              { href: "/e-visa", label: "Sahaj Visa e-Visa guidance" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-w-100"
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <span className="ux4g-card-body ux4g-d-flex ux4g-ai-center ux4g-gap-x-s">
                    <Icon name="link" />
                    <span className="ux4g-card-title">{link.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}
