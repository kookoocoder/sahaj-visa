export const PRIMARY_NAV = [
  { href: "/", label: "Home", exact: true },
  { href: "/instructions", label: "Instructions" },
  { href: "/#visa-services", label: "Visa Categories" },
  { href: "/e-visa", label: "e-Visa Application Process" },
  { href: "/visa-on-arrival", label: "Visa on Arrival" },
  { href: "/track", label: "Track Application" },
  { href: "/contact#weblinks", label: "Useful Weblinks" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const QUICK_ACTIONS = [
  {
    href: "/apply",
    label: "Sample application",
    description: "Open the working e-Tourist form",
  },
  {
    href: "/apply",
    label: "Apply here for e-Visa",
    description: "Start a resumable draft",
  },
  {
    href: "/track",
    label: "Complete a partial application",
    description: "Resume with your application ID",
  },
  {
    href: "/track",
    label: "Verify payment",
    description: "See if a charge was confirmed",
  },
  {
    href: "/track",
    label: "Print application",
    description: "Open status and the audit log",
  },
  {
    href: "/track",
    label: "Check visa status",
    description: "Honest timeline, not a frozen 72 hours",
  },
  {
    href: "/apply",
    label: "Re-upload data",
    description: "Photo and passport stay on your draft",
  },
] as const;

export const OFFICIAL_HELPDESK = {
  phone: "+91 82 7808 7808",
  phoneHref: "tel:+918278087808",
  email: "indianvisaonline-boi@mha.gov.in",
  emailHref: "mailto:indianvisaonline-boi@mha.gov.in",
  note: "Bureau of Immigration helpdesk on the live government portal — not staffed by this prototype.",
};
