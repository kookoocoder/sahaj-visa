export const PRIMARY_NAV = [
  { href: "/", label: "Home", exact: true },
  { href: "/e-visa", label: "e-Visa" },
  { href: "/paper-visa", label: "Regular Visa" },
  { href: "/visa-on-arrival", label: "Visa on Arrival" },
  { href: "/instructions", label: "Requirements" },
  { href: "/track", label: "My Application" },
  { href: "/faqs", label: "Help" },
] as const;

export const QUICK_ACTIONS = [
  {
    href: "/apply",
    label: "Start an application",
    description: "Prepare a complete 30-day e-Tourist application",
  },
  {
    href: "/track",
    label: "Resume an application",
    description: "Resume with your application ID",
  },
  {
    href: "https://indianvisaonline.gov.in/evisa/StatusEnquiry",
    label: "Check official status",
    description: "Open the Government of India status service",
  },
] as const;

export const OFFICIAL_HELPDESK = {
  phone: "+91 82 7808 7808",
  phoneHref: "tel:+918278087808",
  email: "indianvisaonline-boi@mha.gov.in",
  emailHref: "mailto:indianvisaonline-boi@mha.gov.in",
  note: "Bureau of Immigration e-Visa helpdesk for official applications.",
};
