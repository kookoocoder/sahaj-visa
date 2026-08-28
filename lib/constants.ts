export const PRODUCT_NAME = "Sahaj Visa";
export const PRODUCT_TAGLINE = "Clear guidance for your journey to India.";
export const BUILD_CREDIT = "Accessible, plain-language visa guidance";

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

export const HUMAN_CHECK_PROMPT = "Type the word INDIA to confirm you are a person applying for yourself.";
export const HUMAN_CHECK_ANSWER = "INDIA";
