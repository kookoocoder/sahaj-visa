import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, HelpdeskCard, PageMasthead } from "@/components/site/chrome";
import { OFFICIAL_PORTAL, PRODUCT_NAME } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div>
      <PageMasthead title="Contact Us" subtitle={`${PRODUCT_NAME} is a prototype. The numbers below are the live government helpdesk.`} />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact Us" }]} />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-xl">This prototype</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              There is no phone desk for Sahaj Visa. Use the demo login, the application ID on the
              Track page, or the field help buttons inside the form.
            </p>
            <Link href="/login" className="inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
              Demo login
            </Link>
          </div>
          <HelpdeskCard />
        </div>
        <section id="weblinks" className="mt-10 scroll-mt-28">
          <h2 className="font-heading text-2xl">Useful weblinks</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { href: OFFICIAL_PORTAL, label: "Official e-Visa portal" },
              { href: "https://www.mha.gov.in/", label: "Ministry of Home Affairs" },
              { href: "https://www.mea.gov.in/", label: "Ministry of External Affairs" },
              { href: "https://www.boi.gov.in/", label: "Bureau of Immigration" },
              { href: "https://www.india.gov.in/", label: "National Portal of India" },
              { href: "/e-visa", label: "e-Visa process on this prototype" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex min-h-12 items-center rounded-xl border border-border bg-card px-4 text-sm font-medium hover:border-primary/40 hover:text-primary"
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}
