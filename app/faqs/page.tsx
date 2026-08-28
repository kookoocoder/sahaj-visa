import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, PageMasthead } from "@/components/site/chrome";

export const metadata: Metadata = { title: "FAQs" };

const FAQS = [
  {
    q: "What does Sahaj Visa do?",
    a: "Sahaj Visa is an independent preparation service. It helps you organise and check application details before you submit them on the official Government of India portal.",
  },
  {
    q: "Will I lose my application if the tab closes?",
    a: "Fields save automatically. Use your application ID on the My Application page to reopen a draft.",
  },
  {
    q: "Can I pay the visa fee here?",
    a: "No. Pay visa fees only through the payment options shown by the Government of India during final submission.",
  },
  {
    q: "Can Sahaj Visa check my official application status?",
    a: "Official status is available only from the Government of India service. Use the official status link on the home page.",
  },
  {
    q: "Can I apply for a business or Afghan visa here?",
    a: "The guided preparation form currently covers the 30-day e-Tourist route. Business, medical, regular, and Afghan routes link to the relevant official services.",
  },
  {
    q: "Do I need a CAPTCHA?",
    a: "Type the word INDIA in the review step. This accessible confirmation protects the preparation form from automated submissions.",
  },
];

export default function FaqsPage() {
  return (
    <div>
      <PageMasthead
        kicker="सहायता"
        title="Help Centre"
        subtitle="Answers about saved records, documents, submission, and official services"
        image="/india/varanasi.jpg"
        imageAlt="Ghats along the Ganges in Varanasi"
      />
      <Container className="ux4g-py-xs sahaj-narrow">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "FAQs" }]} />
        <dl className="ux4g-mt-s">
          {FAQS.map((item) => (
            <div key={item.q} className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-mb-m">
              <div className="ux4g-card-body">
                <dt className="ux4g-card-title">{item.q}</dt>
                <dd className="ux4g-card-sub-title">{item.a}</dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="ux4g-body-m-default ux4g-mt-s">
          Still stuck?{" "}
          <Link href="/contact" className="ux4g-text-link-sm">
            Contact
          </Link>{" "}
          or{" "}
          <Link href="/apply" className="ux4g-text-link-sm">
            open the form
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
