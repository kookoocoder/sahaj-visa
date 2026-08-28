import type { Metadata } from "next";
import { Wizard } from "@/components/apply/wizard";
import { Breadcrumbs, Container } from "@/components/site/chrome";

export const metadata: Metadata = { title: "Apply online" };

export default function ApplyPage() {
  return (
    <div className="flex-1 bg-muted/40">
      <Container className="pt-5">
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
