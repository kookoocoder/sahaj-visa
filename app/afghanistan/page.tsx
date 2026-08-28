import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, HelpdeskCard, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";

export const metadata: Metadata = { title: "Visa for Afghanistan" };

const SERVICES = [
  { n: "1", label: "Business Visa", icon: "work" },
  { n: "2", label: "Student Visa", icon: "school" },
  { n: "3", label: "Medical Visa", icon: "stethoscope" },
  { n: "4", label: "Medical Attendant Visa", icon: "diversity_3" },
  { n: "5", label: "Entry Visa", icon: "login" },
  { n: "6", label: "UN Diplomat Visa", icon: "public" },
];

const ACTIONS = [
  { href: "https://indianvisaonline.gov.in/avisa/", label: "Open official Afghan visa portal", icon: "open_in_new" },
  { href: "https://indianvisaonline.gov.in/avisa/", label: "Resume an official application", icon: "history" },
  { href: "https://indianvisaonline.gov.in/avisa/", label: "Print an application", icon: "print" },
  { href: "https://indianvisaonline.gov.in/avisa/", label: "Check official status", icon: "search" },
  { href: "/contact", label: "Get support", icon: "support_agent" },
];

export default function AfghanistanPage() {
  return (
    <div>
      <PageMasthead
        kicker="अफगानिस्तान"
        title="Visa for Afghanistan"
        subtitle="Dedicated visa routes and official application access for Afghanistan nationals"
        image="/india/lotus.jpg"
        imageAlt="Lotus Temple, New Delhi"
      />
      <Container className="ux4g-py-xs">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/#visa-services", label: "Visa Categories" },
            { label: "Visa for Afghanistan" },
          ]}
        />

        <h2 className="ux4g-title-m-strong ux4g-mt-s">Afghanistan nationals can avail the following visa services</h2>
        <ul className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-s">
          {SERVICES.map((s) => (
            <li key={s.label} className="ux4g-card ux4g-card-outline ux4g-card-vertical">
              <div className="ux4g-card-body ux4g-text-center">
                <span className="ux4g-tag-tonal-primary">{s.n}</span>
                <Icon name={s.icon} className="ux4g-fs-32 ux4g-text-primary ux4g-mt-xs" />
                <span className="ux4g-card-title ux4g-mt-xs">{s.label}</span>
              </div>
            </li>
          ))}
        </ul>

        <InfoCallout title="Instructions" className="ux4g-mt-s">
          <ul className="sahaj-list">
            <li>Confirm current policy on boi.gov.in before you travel — this page is not legal advice.</li>
            <li>Fill one application per person. A family cannot share a single form.</li>
            <li>Copy passport names and numbers exactly to avoid preventable delays.</li>
            <li>Keep your application ID in a safe place so you can resume or check status.</li>
          </ul>
          <Link href="/instructions" className="ux4g-btn ux4g-btn-primary ux4g-btn-md ux4g-mt-xs">
            Read more
            <Icon name="arrow_forward" />
          </Link>
        </InfoCallout>

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

        <div className="ux4g-mt-s ux4g-d-flex ux4g-jc-center">
          <HelpdeskCard />
        </div>
      </Container>
    </div>
  );
}
