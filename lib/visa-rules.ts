export const RULES_DOC = `
Sahaj Visa application guidance

This guidance helps an adult traveller prepare information for a 30-day e-Tourist Visa.
Eligibility, fees, document specifications, and processing rules can change. The Government
of India portal is the final authority.

TIMING
- Begin at least four days before intended arrival and allow extra time for corrections.
- Passport validity should extend at least six months beyond intended arrival.

PHOTOGRAPH
- Use a recent square colour photograph with a plain light background and a clear, front-facing view.
- The preparation check reviews file type, dimensions, and file size; it cannot assess identity.

PASSPORT
- Use a clear image of the biodata page with every corner visible and no glare.
- Copy names, dates, and passport numbers exactly.

FINAL SUBMISSION
- Re-check all prepared details on the official Government of India portal.
- Government fees, status updates, additional checks, and immigration decisions happen there.
`.trim();

export const FIELD_HELP: Record<string, { title: string; body: string }> = {
  arrivalDate: {
    title: "When should I apply?",
    body: "Start at least four days before arrival and leave extra time for corrections or additional document requests.",
  },
  passportExpiryDate: {
    title: "Passport validity",
    body: "Your passport should generally remain valid for at least six months from your arrival date. Confirm the current requirement before submitting.",
  },
  photo: {
    title: "Photo requirements",
    body: "Use a recent square JPEG with a plain light background, a clear full-face view, and no borders or heavy shadows.",
  },
  passportScan: {
    title: "Passport scan",
    body: "Use a clear image of the biodata page. Show all four corners and avoid glare, blur, or cropped numbers.",
  },
  nationality: {
    title: "Nationality and eligibility",
    body: "Eligibility changes by nationality and travel history. Confirm your current eligibility on the official portal before final submission.",
  },
  givenNames: {
    title: "Name format",
    body: "Copy your passport exactly. Do not add titles such as Mr, Mrs, or Dr.",
  },
  phone: {
    title: "Mobile number",
    body: "Enter an international mobile number with country code. Spaces and dashes are removed automatically.",
  },
  passportNumber: {
    title: "Passport number",
    body: "Enter only the letters and numbers printed on the biodata page. Check similar characters such as O and 0.",
  },
  email: {
    title: "Email address",
    body: "Use an address you check regularly. The official service uses email for application communication and ETA delivery.",
  },
  humanCheck: {
    title: "Human confirmation",
    body: "This accessible text check helps prevent automated submissions without relying on a distorted image.",
  },
};

export function searchRules(question: string): string {
  const q = question.toLowerCase();
  const hits = Object.entries(FIELD_HELP).filter(
    ([key, value]) =>
      q.includes(key.toLowerCase()) ||
      value.title.toLowerCase().split(" ").some((word) => word.length > 3 && q.includes(word)) ||
      value.body.toLowerCase().split(" ").some((word) => word.length > 5 && q.includes(word)),
  );
  return hits.length ? hits.map(([, value]) => `${value.title}\n${value.body}`).join("\n\n") : RULES_DOC;
}
