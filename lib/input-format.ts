import type { VisaForm } from "@/lib/types";
import { HUMAN_CHECK_ANSWER } from "@/lib/constants";

export type InputFormatId =
  | "personName"
  | "mobile"
  | "passport"
  | "email"
  | "place"
  | "address"
  | "purpose"
  | "applicationId"
  | "aadhaar"
  | "pan";

export type FormatSpec = {
  sanitize: (value: string) => string;
  validate: (value: string, label?: string) => string | undefined;
  hint: string;
  placeholder?: string;
  maxLength: number;
  inputMaxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoCapitalize?: "off" | "none" | "characters" | "words";
  spellCheck?: boolean;
  htmlPattern?: string;
};

const NAME_TITLES = new Set(["mr", "mrs", "ms", "miss", "dr", "prof", "sir", "smt", "shri", "sri"]);

const PERSON_NAME_RE = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const PASSPORT_RE = /^[A-Z0-9]{6,9}$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PLACE_RE = /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/;
const ADDRESS_RE = /^[A-Za-z0-9][A-Za-z0-9 ,./#-]{7,119}$/;
const PURPOSE_RE = /^[\w\s.,'"()/\-]{4,200}$/;
const APPLICATION_ID_RE = /^SV-26-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/;
const AADHAAR_RE = /^[2-9]\d{11}$/;
const PAN_RE = /^[A-Z]{3}P[A-Z]\d{4}[A-Z]$/;

function collapseSpaces(value: string) {
  return value.replace(/ {2,}/g, " ");
}

function firstWord(value: string) {
  return value.trim().split(/\s+/)[0]?.replace(/\./g, "") ?? "";
}

export const FORMAT_SPECS: Record<InputFormatId, FormatSpec> = {
  personName: {
    sanitize: (value) => collapseSpaces(value.replace(/[^A-Za-z ]/g, "")).slice(0, 50),
    validate: (value, label = "Name") => {
      const v = value.trim();
      if (!v) return `Enter ${label.toLowerCase()} as printed in the passport.`;
      if (NAME_TITLES.has(firstWord(v).toLowerCase())) {
        return `${label} must not include titles such as Mr, Mrs, Ms, or Dr.`;
      }
      if (!PERSON_NAME_RE.test(v)) {
        return `${label} may use English letters and single spaces only.`;
      }
      return undefined;
    },
    hint: "Letters and spaces only, as in the passport. No titles (Mr/Mrs/Dr) and no numbers.",
    placeholder: "As in passport",
    maxLength: 50,
    autoCapitalize: "words",
    spellCheck: false,
    htmlPattern: "[A-Za-z]+( [A-Za-z]+)*",
  },
  mobile: {
    sanitize: (value) => {
      let digits = value.replace(/\D/g, "");
      if (digits.startsWith("91") && digits.length >= 12) digits = digits.slice(2);
      else if (digits.startsWith("0") && digits.length >= 11) digits = digits.slice(1);
      return digits.replace(/^[0-5]+/, "").slice(0, 10);
    },
    validate: (value) => {
      const v = value.trim();
      if (!v) return "Enter a 10-digit mobile number.";
      if (!/^\d{10}$/.test(v)) return "Mobile number must be exactly 10 digits.";
      if (!MOBILE_RE.test(v)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
      return undefined;
    },
    hint: "Exactly 10 digits. Starts with 6, 7, 8 or 9. No +91, spaces, or dashes.",
    placeholder: "9876543210",
    maxLength: 10,
    inputMaxLength: 15,
    inputMode: "numeric",
    autoCapitalize: "off",
    spellCheck: false,
    htmlPattern: "[6-9][0-9]{9}",
  },
  passport: {
    sanitize: (value) => value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 9),
    validate: (value) => {
      const v = value.trim().toUpperCase();
      if (!v) return "Enter the passport number.";
      if (!PASSPORT_RE.test(v)) {
        return "Passport number must be 6–9 letters and numbers, with no spaces or symbols.";
      }
      return undefined;
    },
    hint: "6–9 letters and numbers only. No spaces, hyphens, or symbols.",
    placeholder: "X1234567",
    maxLength: 9,
    inputMaxLength: 15,
    autoCapitalize: "characters",
    spellCheck: false,
    htmlPattern: "[A-Za-z0-9]{6,9}",
  },
  email: {
    sanitize: (value) => value.replace(/\s/g, "").slice(0, 100),
    validate: (value) => {
      const v = value.trim();
      if (!v) return "Enter an email address.";
      if (!EMAIL_RE.test(v)) return "Enter a valid email, for example name@example.com.";
      return undefined;
    },
    hint: "Where a real ETA would be sent. Letters, numbers, and . _ % + - only.",
    placeholder: "name@example.com",
    maxLength: 100,
    inputMode: "email",
    autoCapitalize: "off",
    spellCheck: false,
  },
  place: {
    sanitize: (value) => collapseSpaces(value.replace(/[^A-Za-z .'-]/g, "")).slice(0, 50),
    validate: (value, label = "Place") => {
      const v = value.trim();
      if (!v) return `Enter ${label.toLowerCase()}.`;
      if (!PLACE_RE.test(v)) {
        return `${label} may use letters, spaces, hyphens, and apostrophes only.`;
      }
      return undefined;
    },
    hint: "Letters and spaces only. Hyphens and apostrophes are allowed.",
    maxLength: 50,
    autoCapitalize: "words",
    spellCheck: false,
    htmlPattern: "[A-Za-z]+([ .'-][A-Za-z]+)*",
  },
  address: {
    sanitize: (value) => collapseSpaces(value.replace(/[^A-Za-z0-9 ,./#\-]/g, "")).slice(0, 120),
    validate: (value) => {
      const v = value.trim();
      if (!v) return "Enter the first address where you will stay.";
      if (v.length < 8) return "Address must be at least 8 characters.";
      if (!ADDRESS_RE.test(v)) {
        return "Address may use letters, numbers, spaces, and , . / # - only.";
      }
      return undefined;
    },
    hint: "Letters, numbers, and , . / # - only. No other symbols.",
    maxLength: 120,
    autoCapitalize: "words",
  },
  purpose: {
    sanitize: (value) => value.replace(/[^\w\s.,'"()/\-]/g, "").slice(0, 200),
    validate: (value) => {
      const v = value.trim();
      if (!v) return "In a sentence, why are you visiting?";
      if (v.length < 4) return "Purpose must be at least 4 characters.";
      if (!PURPOSE_RE.test(v)) {
        return "Purpose may use letters, numbers, and basic punctuation only.";
      }
      return undefined;
    },
    hint: "A short sentence. Letters, numbers, and basic punctuation only.",
    maxLength: 200,
  },
  applicationId: {
    sanitize: (value) => value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 12),
    validate: (value) => {
      const v = value.trim().toUpperCase();
      if (!v) return "Paste your application ID (SV-26-XXXXXX).";
      if (!APPLICATION_ID_RE.test(v)) return "Application ID looks like SV-26-XXXXXX.";
      return undefined;
    },
    hint: "Printed as SV-26-XXXXXX on the form once it first saves.",
    placeholder: "SV-26-XXXXXX",
    maxLength: 12,
    autoCapitalize: "characters",
    spellCheck: false,
    htmlPattern: "SV-26-[A-Z0-9]{6}",
  },
  aadhaar: {
    sanitize: (value) => {
      const digits = value.replace(/\D/g, "").replace(/^[01]+/, "").slice(0, 12);
      return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    },
    validate: (value) => {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "Enter a 12-digit Aadhaar number.";
      if (digits.length !== 12) return "Aadhaar number must be exactly 12 digits.";
      if (!AADHAAR_RE.test(digits)) return "Aadhaar numbers are 12 digits and do not start with 0 or 1.";
      return undefined;
    },
    hint: "12 digits, as on the Aadhaar card. First digit is 2–9. Spaces are added for you.",
    placeholder: "2345 6789 0123",
    maxLength: 14,
    inputMaxLength: 20,
    inputMode: "numeric",
    autoCapitalize: "off",
    spellCheck: false,
    htmlPattern: "[2-9][0-9]{3} [0-9]{4} [0-9]{4}",
  },
  pan: {
    sanitize: (value) => {
      const raw = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      let out = "";
      for (const ch of raw) {
        const i = out.length;
        if (i >= 10) break;
        if (i < 5) {
          if (!/[A-Z]/.test(ch)) continue;
          if (i === 3 && ch !== "P") continue;
          out += ch;
        } else if (i < 9) {
          if (!/\d/.test(ch)) continue;
          out += ch;
        } else if (/[A-Z]/.test(ch)) {
          out += ch;
        }
      }
      return out;
    },
    validate: (value) => {
      const v = value.trim().toUpperCase();
      if (!v) return "Enter a 10-character PAN.";
      if (v.length !== 10) return "PAN must be exactly 10 characters (AAAAA9999A).";
      if (!/^[A-Z]{5}/.test(v)) return "PAN starts with five letters, for example ABCPS1234F.";
      if (v[3] !== "P") return "The 4th character of a personal PAN must be P.";
      if (!PAN_RE.test(v)) return "PAN format is five letters, four digits, one letter (AAAAA9999A).";
      return undefined;
    },
    hint: "10 characters: five letters, four digits, one letter. 4th character is P for an individual.",
    placeholder: "ABCPS1234F",
    maxLength: 10,
    autoCapitalize: "characters",
    spellCheck: false,
    htmlPattern: "[A-Z]{5}[0-9]{4}[A-Z]",
  },
};

export const FORM_INPUT_FORMAT: Partial<Record<keyof VisaForm, InputFormatId>> = {
  givenNames: "personName",
  surname: "personName",
  email: "email",
  phone: "mobile",
  aadhaarNumber: "aadhaar",
  panNumber: "pan",
  cityOfBirth: "place",
  countryOfBirth: "place",
  passportNumber: "passport",
  passportPlaceOfIssue: "place",
  cityInIndia: "place",
  addressInIndia: "address",
  purpose: "purpose",
};

export const FIELD_LABELS: Partial<Record<keyof VisaForm, string>> = {
  givenNames: "Given names",
  surname: "Surname",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  nationality: "Nationality",
  cityOfBirth: "Place of birth",
  countryOfBirth: "Country of birth",
  email: "Email",
  phone: "Mobile number",
  aadhaarNumber: "Aadhaar number",
  panNumber: "PAN",
  passportNumber: "Passport number",
  passportIssueDate: "Issue date",
  passportExpiryDate: "Expiry date",
  passportPlaceOfIssue: "Place of issue",
  arrivalDate: "Intended arrival",
  departureDate: "Intended departure",
  portOfArrival: "Port of arrival",
  addressInIndia: "First address in India",
  cityInIndia: "City in India",
  purpose: "Purpose of visit",
  declaration: "Declaration",
  humanCheck: "Confirmation word",
};

export type FieldErrors = Record<string, string>;

export function validateVisaFields(form: VisaForm, keys: (keyof VisaForm)[]): FieldErrors {
  const out: FieldErrors = {};
  for (const key of keys) {
    const value = form[key];
    if (key === "declaration") {
      if (value !== true) out[key] = "Confirm the declaration to submit.";
      continue;
    }
    if (key === "humanCheck") {
      if (String(value).trim().toUpperCase() !== HUMAN_CHECK_ANSWER) {
        out[key] = "Type INDIA to confirm you are a person applying for yourself.";
      }
      continue;
    }
    const format = FORM_INPUT_FORMAT[key];
    if (format && typeof value === "string") {
      const message = FORMAT_SPECS[format].validate(value, FIELD_LABELS[key]);
      if (message) out[key] = message;
      continue;
    }
    if (value === "" || value == null) {
      out[key] = `${FIELD_LABELS[key] ?? "This field"} is needed to continue.`;
    }
  }
  return out;
}

export function sanitizeFormValue<K extends keyof VisaForm>(key: K, value: VisaForm[K]): VisaForm[K] {
  if (typeof value !== "string") return value;
  const format = FORM_INPUT_FORMAT[key];
  if (!format) return value;
  return FORMAT_SPECS[format].sanitize(value) as VisaForm[K];
}
