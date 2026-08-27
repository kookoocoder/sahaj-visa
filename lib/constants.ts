export const PRODUCT_NAME = "Sahaj Visa";
export const PRODUCT_TAGLINE = "An independent prototype of a calmer Indian e-Visa.";

export const DEMO_EMAIL = "demo@visa.test";
export const DEMO_PASSWORD = "sahaj-demo";

export const FEE_USD = 25;
export const VISA_PRODUCT_LABEL = "30-day e-Tourist Visa (double entry)";

export const OFFICIAL_PORTAL = "https://indianvisaonline.gov.in/evisa/tvoa.html";

export const NATIONALITIES = [
  "United States of America",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "United Arab Emirates",
  "Brazil",
  "South Africa",
  "Republic of Korea",
  "Spain",
  "Italy",
  "Netherlands",
  "New Zealand",
  "Ireland",
  "Sweden",
  "Switzerland",
  "Mexico",
] as const;

export const PORTS = [
  { code: "DEL", label: "Delhi — Indira Gandhi International (DEL)" },
  { code: "BOM", label: "Mumbai — Chhatrapati Shivaji Maharaj (BOM)" },
  { code: "BLR", label: "Bengaluru — Kempegowda (BLR)" },
  { code: "MAA", label: "Chennai International (MAA)" },
  { code: "HYD", label: "Hyderabad — Rajiv Gandhi (HYD)" },
  { code: "CCU", label: "Kolkata — Netaji Subhas Chandra Bose (CCU)" },
  { code: "COK", label: "Kochi — Cochin International (COK)" },
  { code: "GOI", label: "Goa — Manohar / Dabolim (GOI / GOX)" },
  { code: "AMD", label: "Ahmedabad — Sardar Vallabhbhai Patel (AMD)" },
  { code: "PNQ", label: "Pune (PNQ)" },
  { code: "JAI", label: "Jaipur (JAI)" },
  { code: "TRV", label: "Thiruvananthapuram (TRV)" },
] as const;

/** Mocked throughput for Feature 3 — calibrated to 2025–26 traveller reports, not the five-year 72h average. */
export const QUEUE_STATS = {
  asOf: "28 August 2026",
  applicationsThisMonth: 18420,
  medianDays: 6,
  p50: 5,
  p75: 8,
  p90: 11,
  pctCleared72hOfficialFiveYear: 91.24,
  pctCleared72hThisMonthMock: 41,
  similarShare: 78,
  sourceNote:
    "Official Cabinet figure: 91.24% cleared within 72 hours over five years (PIB, 25 Mar 2026). Universal Weather (Dec 2025) reported 8–10 day waits in practice. This prototype uses mocked current-queue stats so the citizen sees an honest range, not a frozen promise.",
};

export const HUMAN_CHECK_PROMPT = "Type the word INDIA to confirm you are a person applying for yourself.";
export const HUMAN_CHECK_ANSWER = "INDIA";
