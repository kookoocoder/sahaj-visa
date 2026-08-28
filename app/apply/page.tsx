import type { Metadata } from "next";
import { Wizard } from "@/components/apply/wizard";
import { Breadcrumbs, Container, PageMasthead } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Apply online" };

export default function ApplyPage() {
  return (
    <div className="sahaj-chakra-bg">
      <PageMasthead
        kicker="आवेदन करें"
        title="Apply Online"
        subtitle="Prepare your 30-day e-Tourist Visa details with guided checks before the official portal"
        image="/india-journey-hero.webp"
        imageAlt="Travellers exploring heritage sites across India"
      />
      <Container className="ux4g-py-xs">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/e-visa", label: "e-Visa Application" },
            { label: "Apply Online" },
          ]}
        />
      </Container>
      <Wizard />
    </div>
  );
}
