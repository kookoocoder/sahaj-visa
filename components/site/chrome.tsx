import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { SahajEmblem } from "@/components/site/logo";
import { SiteHeader } from "@/components/site/header";
import { Icon } from "@/components/site/icon";
import { BUILD_CREDIT, OFFICIAL_PORTAL, PRODUCT_NAME } from "@/lib/constants";
import { OFFICIAL_HELPDESK } from "@/lib/nav";
import { cn } from "@/lib/utils";

export { SiteHeader };

const FOOTER_LINKS = [
  {
    heading: "Prepare",
    items: [
      { href: "/apply", label: "Start e-Visa form" },
      { href: "/track", label: "My application" },
      { href: "/instructions", label: "Requirements" },
    ],
  },
  {
    heading: "Visa routes",
    items: [
      { href: "/e-visa", label: "e-Visa" },
      { href: "/paper-visa", label: "Regular visa" },
      { href: "/visa-on-arrival", label: "Visa on Arrival" },
      { href: "/afghanistan", label: "Afghan visa" },
    ],
  },
  {
    heading: "Help",
    items: [
      { href: "/faqs", label: "Help centre" },
      { href: "/contact", label: "Contact" },
      { href: "/instructions#accessibility", label: "Accessibility" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="ux4g-footer ux4g-footer-primary sahaj-footer">
      <div className="ux4g-footer-wrapper">
        <div className="ux4g-ns-t4 ux4g-mb-m">
          <div className="ux4g-alert ux4g-alert-warning ux4g-alert-wide ux4g-mb-m" role="note">
            <Icon name="info" className="ux4g-alert-icon" />
            <div className="ux4g-alert-content">
              <p className="ux4g-body-s-strong">
                Independent service · Not affiliated with the Government of India. Sahaj Visa does not issue visas,
                collect government fees, or make immigration decisions.
              </p>
            </div>
          </div>
          <div className="ux4g-d-flex ux4g-flex-wrap ux4g-jc-between ux4g-ai-center ux4g-gap-x-l ux4g-gap-y-m">
            <div className="ux4g-grid ux4g-gap-y-xs">
              <h2 className="ux4g-title-m-strong">Need support?</h2>
              <p className="ux4g-body-m-default">
                Application guidance is here. Visa decisions and fees stay with the Government of India.
              </p>
              <Link href="/contact" className="ux4g-btn ux4g-btn-primary ux4g-btn-lg ux4g-radius-full ux4g-gap-x-xs ux4g-mt-xs">
                Contact support
                <Icon name="arrow_outward" />
              </Link>
            </div>
            <div className="ux4g-d-flex ux4g-flex-column ux4g-gap-y-xs">
              <p className="ux4g-label-m-strong">Official visa helpline</p>
              <a className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs ux4g-text-link-sm" href={OFFICIAL_HELPDESK.phoneHref}>
                <Icon name="call" />
                {OFFICIAL_HELPDESK.phone}
              </a>
              <a className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs ux4g-text-link-sm" href={OFFICIAL_HELPDESK.emailHref}>
                <Icon name="mail" />
                {OFFICIAL_HELPDESK.email}
              </a>
              <p className="ux4g-body-xs-default">Not operated by Sahaj Visa</p>
            </div>
          </div>
        </div>

        <div className="ux4g-footer-row ux4g-f-dept-responsive">
          <div className="ux4g-dept-wrapper">
            <div className="ux4g-dept-header">
              <SahajEmblem />
              <div>
                <p className="ux4g-label-l-strong">{PRODUCT_NAME}</p>
                <p lang="hi" className="ux4g-body-xs-default">
                  सहज वीज़ा · Independent visa preparation
                </p>
              </div>
            </div>
            <p className="ux4g-body-m-default" style={{ maxWidth: "36rem" }}>
              Helps travellers organise accurate information before continuing to the official portal.
              Sahaj Visa does not issue visas, collect government fees, or make immigration decisions.
            </p>
            <p className="ux4g-body-xs-default">{BUILD_CREDIT}</p>
          </div>

          <div className="ux4g-f-links ux4g-f-links-cols-4">
            {FOOTER_LINKS.map((column) => (
              <div key={column.heading}>
                <h3 className="ux4g-heading-xs-strong ux4g-mb-m">{column.heading}</h3>
                <ul className="ux4g-f-link-list">
                  {column.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="ux4g-text-link-neutral-sm">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="ux4g-heading-xs-strong ux4g-mb-m">Official links</h3>
              <ul className="ux4g-f-link-list">
                <li>
                  <a className="ux4g-text-link-neutral-sm" href={OFFICIAL_PORTAL} target="_blank" rel="noreferrer">
                    indianvisaonline.gov.in
                  </a>
                </li>
                <li>
                  <a className="ux4g-text-link-neutral-sm" href="https://www.mha.gov.in/" target="_blank" rel="noreferrer">
                    Ministry of Home Affairs
                  </a>
                </li>
                <li>
                  <a className="ux4g-text-link-neutral-sm" href="https://www.boi.gov.in/" target="_blank" rel="noreferrer">
                    Bureau of Immigration
                  </a>
                </li>
                <li>
                  <a className="ux4g-text-link-neutral-sm" href="https://www.india.gov.in/" target="_blank" rel="noreferrer">
                    India.gov.in
                  </a>
                </li>
                <li>
                  <a className="ux4g-text-link-neutral-sm" href="https://www.incredibleindia.gov.in/" target="_blank" rel="noreferrer">
                    Incredible India
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="ux4g-fbs-t1 ux4g-d-flex ux4g-ai-center ux4g-flex-wrap ux4g-gap-y-s ux4g-py-xs">
          <p className="ux4g-body-xs-default">© 2026 {PRODUCT_NAME}. Independent service — not a Government of India website.</p>
          <p className="ux4g-body-xs-default">Photographs: Wikimedia Commons contributors.</p>
        </div>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="ux4g-breadcrumb ux4g-breadcrumb-divider">
      <ol className="ux4g-breadcrumb-list ux4g-d-flex ux4g-ai-center ux4g-flex-wrap">
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className={cn("ux4g-breadcrumb-item ux4g-d-flex ux4g-ai-center", !item.href && "active")}
          >
            {item.href ? (
              <Link
                href={item.href}
                className="ux4g-breadcrumb-link ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs"
              >
                {index === 0 ? <Icon name="home" /> : null}
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageMasthead({
  kicker = "भारत यात्रा",
  title,
  subtitle,
  image = "/india/india-gate.jpg",
  imageAlt = "India Gate, New Delhi",
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="sahaj-masthead">
      <div className="sahaj-masthead-media">
        <Image src={image} alt={imageAlt} fill sizes="100vw" priority={false} />
      </div>
      <div className="sahaj-masthead-veil" aria-hidden="true" />
      <div className="ux4g-container sahaj-masthead-copy">
        <p lang="hi" className="sahaj-kicker">
          {kicker}
        </p>
        <h1 className="ux4g-mt-xs">{title}</h1>
        {subtitle ? <p className="ux4g-body-m-default ux4g-mt-xs">{subtitle}</p> : null}
      </div>
    </div>
  );
}

export function InfoCallout({
  title = "Please note",
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("ux4g-alert ux4g-alert-info ux4g-alert-wide", className)} role="status">
      <Icon name="info" className="ux4g-alert-icon" />
      <div className="ux4g-alert-content ux4g-d-flex ux4g-flex-column">
        <p className="ux4g-alert-title">{title}</p>
        <div className="ux4g-alert-message">{children}</div>
      </div>
    </div>
  );
}

export function AdvisoryCallout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("ux4g-alert ux4g-alert-warning ux4g-alert-wide", className)} role="note">
      <Icon name="warning" className="ux4g-alert-icon" />
      <div className="ux4g-alert-content ux4g-d-flex ux4g-flex-column">
        <p className="ux4g-alert-title">Advisory</p>
        <div className="ux4g-alert-message">{children}</div>
      </div>
    </div>
  );
}

export function HelpdeskCard({ dark = false }: { dark?: boolean }) {
  return (
    <aside className={cn("ux4g-card ux4g-card-outline ux4g-card-vertical", dark && "ux4g-card-solid")}>
      <div className="ux4g-card-body">
        <p className="ux4g-card-title ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs">
          <Icon name="call" />
          Official government helpdesk
        </p>
        <p className="ux4g-body-xs-default ux4g-text-neutral-tertiary ux4g-mt-xs">
          Not operated by Sahaj Visa
        </p>
        <p className="ux4g-card-sub-title ux4g-mt-xs">{OFFICIAL_HELPDESK.note}</p>
        <p className="ux4g-body-m-default ux4g-mt-xs">
          <a className="ux4g-text-link-sm" href={OFFICIAL_HELPDESK.phoneHref}>
            {OFFICIAL_HELPDESK.phone}
          </a>
        </p>
        <p className="ux4g-body-m-default">
          <a className="ux4g-text-link-sm" href={OFFICIAL_HELPDESK.emailHref}>
            {OFFICIAL_HELPDESK.email}
          </a>
        </p>
      </div>
    </aside>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("ux4g-container", className)}>{children}</div>;
}
