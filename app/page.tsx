import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/site/chrome";
import { Icon } from "@/components/site/icon";
import { DestinationsStrip } from "@/components/site/destinations-strip";
import { OFFICIAL_PORTAL } from "@/lib/constants";
import { OFFICIAL_HELPDESK } from "@/lib/nav";

const HERO_FEATURES = [
  {
    icon: "shield_lock",
    title: "Careful & independent",
    caption: "Not a government website",
  },
  {
    icon: "checklist",
    title: "Simple process",
    caption: "Prepare in 3 easy steps",
  },
  {
    icon: "diversity_3",
    title: "Built for travellers",
    caption: "Plain-language guidance",
  },
];

const SERVICES = [
  {
    href: "/e-visa",
    icon: "flight_takeoff",
    title: "e-Visa",
    hindi: "ई-वीज़ा",
    body: "Prepare tourism, business, medical and other eligible electronic visa details before the official submission.",
    cta: "Apply Now",
    image: "/india/taj.jpg",
    alt: "Taj Mahal, Agra",
  },
  {
    href: "/paper-visa",
    icon: "description",
    title: "Regular / Paper Visa",
    hindi: "नियमित वीज़ा",
    body: "For applicants who must complete the process through an Indian Mission, Post, or visa centre.",
    cta: "Learn More",
    image: "/india/india-gate.jpg",
    alt: "India Gate, New Delhi",
  },
  {
    href: "/visa-on-arrival",
    icon: "flight_land",
    title: "Visa on Arrival",
    hindi: "आगमन पर वीज़ा",
    body: "Facility for eligible nationals of Japan, South Korea and the UAE at selected airports.",
    cta: "Check Eligibility",
    image: "/india/kerala.jpg",
    alt: "Alleppey backwaters, Kerala",
  },
  {
    href: "/afghanistan",
    icon: "public",
    title: "Afghan Visa",
    hindi: "अफगान वीज़ा",
    body: "Dedicated official routes for Afghanistan nationals applying for entry, medical, student and other visas.",
    cta: "View Details",
    image: "/india/lotus.jpg",
    alt: "Lotus Temple, New Delhi",
  },
];

const JOURNEY = [
  { icon: "edit_document", title: "Fill Application", body: "Provide your details and travel information in the online form." },
  { icon: "upload_file", title: "Upload Documents", body: "Upload required documents and check them carefully before you continue." },
  { icon: "mark_email_read", title: "Get Ready to Apply", body: "Take your checked, complete record to the official application portal." },
];

const ASSURANCE = [
  { icon: "lock", title: "Secure & Encrypted", body: "Your draft is saved with 256-bit encryption" },
  { icon: "support_agent", title: "Independent Support", body: "We're here to help anytime you need" },
  { icon: "smartphone", title: "Mobile Friendly", body: "Apply on the go from any device" },
  { icon: "sync", title: "Autosaved Progress", body: "Come back and continue where you left off" },
];

const PLACES = [
  { src: "/india/taj.jpg", title: "Agra", subtitle: "Taj Mahal", alt: "Taj Mahal" },
  { src: "/india/jaipur.jpg", title: "Jaipur", subtitle: "Pink City", alt: "Hawa Mahal, Jaipur" },
  { src: "/india/varanasi.jpg", title: "Varanasi", subtitle: "Spiritual Capital", alt: "Ghats at Varanasi" },
  { src: "/india/india-gate.jpg", title: "Delhi", subtitle: "Gateway to India", alt: "India Gate, New Delhi" },
  { src: "/india/mumbai.jpg", title: "Mumbai", subtitle: "Gateway of India", alt: "Gateway of India, Mumbai" },
  { src: "/india/kerala.jpg", title: "Kerala", subtitle: "God's Own Country", alt: "Kerala backwaters" },
];

export default function HomePage() {
  return (
    <div>
      <Container>
        <section className="sahaj-hero-light">
          <div>
            <span className="sahaj-kicker-light">e-Visa preparation service</span>
            <h1>
              Your journey to <span className="sahaj-accent">India</span> begins here
            </h1>
            <p className="sahaj-lede">
              Prepare your India e-Visa information quickly and carefully. Check requirements, organise
              documents, and save your progress — then continue to the official Government of India portal
              to submit and pay.
            </p>
            <div className="sahaj-feature-row">
              {HERO_FEATURES.map((feature) => (
                <div key={feature.title} className="sahaj-feature-item">
                  <span className="sahaj-feature-icon">
                    <Icon name={feature.icon} className="ux4g-fs-18" />
                  </span>
                  <div className="sahaj-feature-copy">
                    <p>{feature.title}</p>
                    <p>{feature.caption}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sahaj-hero-actions-light">
              <Link href="/apply" className="ux4g-btn ux4g-btn-primary ux4g-btn-lg">
                Prepare an e-Visa
                <Icon name="arrow_forward" />
              </Link>
              <Link href="/track" className="sahaj-resume-link">
                <div className="sahaj-resume-copy">
                  <p>Resume Application</p>
                  <p>Continue where you left off</p>
                </div>
                <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
          <div className="sahaj-hero-photo">
            <Image src="/india/taj.jpg" alt="Taj Mahal in Agra at sunrise" fill priority sizes="(max-width: 991px) 100vw, 45vw" />
          </div>
        </section>
      </Container>

      <Container className="ux4g-py-2xl">
        <section id="visa-services" className="scroll-mt-28 sahaj-section-head">
          <span className="sahaj-kicker-light">Choose your visa</span>
          <h2 className="ux4g-title-m-strong ux4g-mt-xs">Find the right route for your trip</h2>
          <p className="ux4g-body-m-default ux4g-mt-xs">
            Visa rules depend on nationality, purpose, and travel history. Start with the category that
            matches your journey.
          </p>
        </section>
        <div className="ux4g-grid ux4g-grid-auto-fit-250 ux4g-mt-m">
          {SERVICES.map((service) => (
            <article key={service.title} className="ux4g-card ux4g-o-hidden ux4g-card-outline ux4g-card-vertical">
              <div className="ux4g-card-header ux4g-pb-none">
                <div className="ux4g-card-header-img ux4g-radius-l sahaj-card-photo">
                  <span className="sahaj-visa-card-badge">
                    <Icon name={service.icon} className="ux4g-fs-20" />
                  </span>
                  <Image src={service.image} alt={service.alt} fill sizes="(max-width: 768px) 100vw, 25vw" className="ux4g-radius-l ux4g-card-header-image" />
                </div>
              </div>
              <div className="ux4g-card-body">
                <h3 className="ux4g-card-title">{service.title}</h3>
                <p lang="hi" className="sahaj-brand-hi">
                  {service.hindi}
                </p>
                <p className="ux4g-card-sub-title ux4g-mt-xs">{service.body}</p>
              </div>
              <div className="ux4g-card-footer">
                <Link href={service.href} className="ux4g-text-link-sm ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs">
                  {service.cta}
                  <Icon name="arrow_forward" className="ux4g-fs-18" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="ux4g-d-flex ux4g-jc-center ux4g-mt-m">
          <Link href="/instructions" className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md ux4g-radius-full ux4g-gap-x-xs">
            View all visa types
            <Icon name="expand_more" />
          </Link>
        </div>

        <section className="ux4g-mt-2xl">
          <div className="sahaj-section-head-split">
            <div>
              <span className="sahaj-kicker-light">Explore India</span>
              <h2 className="ux4g-title-m-strong ux4g-mt-xs">The India this visa is for</h2>
              <p className="ux4g-body-m-default ux4g-mt-xs">
                From timeless monuments to vibrant cities, explore a land of diverse cultures and
                unforgettable experiences.
              </p>
            </div>
            <a
              href="https://www.incredibleindia.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
            >
              Explore destinations
            </a>
          </div>
          <div className="ux4g-mt-s">
            <DestinationsStrip places={PLACES} />
          </div>
        </section>

        <section className="ux4g-mt-2xl sahaj-section-head">
          <span className="sahaj-kicker-light">How it works</span>
          <h2 className="ux4g-title-m-strong ux4g-mt-xs">Simple steps to prepare your e-Visa</h2>
          <p className="ux4g-body-m-default ux4g-mt-xs">A straightforward process designed for your convenience.</p>
        </section>
        <ol className="sahaj-steps">
          {JOURNEY.map((step, index) => (
            <li key={step.title} className="sahaj-step">
              <span className="sahaj-step-circle">{index + 1}</span>
              <Icon name={step.icon} className="sahaj-step-icon ux4g-fs-28" />
              <p className="ux4g-label-m-strong">{step.title}</p>
              <p className="ux4g-body-xs-default ux4g-mt-xs">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="ux4g-mt-2xl sahaj-assurance-band">
          {ASSURANCE.map((item) => (
            <div key={item.title} className="sahaj-assurance-item">
              <Icon name={item.icon} className="ux4g-fs-24" />
              <div>
                <p>{item.title}</p>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <section className="sahaj-help-band">
        <Container>
          <div className="sahaj-help-band-inner">
            <div>
              <h2 className="ux4g-title-s-strong">Need help?</h2>
              <p className="ux4g-body-m-default ux4g-mt-xs">Our support team is here to assist you</p>
              <Link href="/contact" className="ux4g-btn ux4g-btn-lg ux4g-mt-m" style={{ background: "#fffdf8", color: "#0a2143" }}>
                Contact Support
              </Link>
            </div>
            <div className="sahaj-help-contact">
              <div>
                <p className="ux4g-label-m-default">Visa Helpline</p>
                <a href={OFFICIAL_HELPDESK.phoneHref} className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs ux4g-mt-xs">
                  <Icon name="call" />
                  {OFFICIAL_HELPDESK.phone}
                </a>
              </div>
              <div>
                <p className="ux4g-label-m-default">&nbsp;</p>
                <a href={OFFICIAL_HELPDESK.emailHref} className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs ux4g-mt-xs">
                  <Icon name="mail" />
                  {OFFICIAL_HELPDESK.email}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="ux4g-py-m">
        <div className="ux4g-alert ux4g-alert-warning ux4g-alert-wide" role="note">
          <Icon name="warning" className="ux4g-alert-icon" />
          <div className="ux4g-alert-content ux4g-d-flex ux4g-flex-column">
            <p className="ux4g-alert-title">Advisory</p>
            <div className="ux4g-alert-message">
              <p>
                No service can guarantee approval or faster processing. Visa applications and payments must
                be completed on{" "}
                <a className="ux4g-alert-link" href={OFFICIAL_PORTAL} target="_blank" rel="noreferrer">
                  indianvisaonline.gov.in
                </a>
                . Sahaj Visa is an independent preparation service and does not make immigration decisions.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
