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
  | "applicationId";

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
const MOBILE_RE = /^\+?[1-9]\d{6,14}$/;
const PASSPORT_RE = /^[A-Z0-9]{6,9}$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PLACE_RE = /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/;
const ADDRESS_RE = /^[A-Za-z0-9][A-Za-z0-9 ,./#-]{7,119}$/;
const PURPOSE_RE = /^[\w\s.,'"()/\-]{4,200}$/;
const APPLICATION_ID_RE = /^SV-26-(?:[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}|[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{10})$/;

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
      const trimmed = value.trim();
      const digits = trimmed.replace(/\D/g, "").slice(0, 15);
      return trimmed.startsWith("+") ? `+${digits}` : digits;
    },
    validate: (value) => {
      const v = value.trim();
      if (!v) return "Enter a mobile number, including the country code.";
      if (!MOBILE_RE.test(v)) return "Use 7–15 digits, with an optional leading + country code.";
      return undefined;
    },
    hint: "Include your country code, for example +1 415 555 0123. Spaces and dashes are removed.",
    placeholder: "+1 415 555 0123",
    maxLength: 16,
    inputMaxLength: 24,
    inputMode: "tel",
    autoCapitalize: "off",
    spellCheck: false,
    htmlPattern: "\\+?[1-9][0-9]{6,14}",
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
    hint: "Use an address you check regularly. Letters, numbers, and . _ % + - only.",
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
    htmlPattern: "[A-Za-z]+([ .'\\-][A-Za-z]+)*",
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
    sanitize: (value) => value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 16),
    validate: (value) => {
      const v = value.trim().toUpperCase();
      if (!v) return "Paste your application ID (SV-26-XXXXXXXXXX).";
      if (!APPLICATION_ID_RE.test(v)) return "Application ID looks like SV-26-XXXXXXXXXX.";
      return undefined;
    },
    hint: "Shown as SV-26-XXXXXXXXXX after your application first saves.",
    placeholder: "SV-26-XXXXXXXXXX",
    maxLength: 16,
    autoCapitalize: "characters",
    spellCheck: false,
    htmlPattern: "SV-26-[A-Z0-9]{6}([A-Z0-9]{4})?",
  },
};

export const FORM_INPUT_FORMAT: Partial<Record<keyof VisaForm, InputFormatId>> = {
  givenNames: "personName",
  surname: "personName",
  email: "email",
  phone: "mobile",
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
