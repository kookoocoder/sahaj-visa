export const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "payment_pending",
  "payment_failed",
  "payment_charged_unconfirmed",
  "payment_confirmed",
  "under_review",
  "eta_issued",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "idle",
  "pending",
  "failed",
  "charged_unconfirmed",
  "confirmed",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_SCENARIOS = [
  "success",
  "decline",
  "charged_unconfirmed",
] as const;

export type PaymentScenario = (typeof PAYMENT_SCENARIOS)[number];

export const GENDERS = ["female", "male", "other", "prefer_not_to_say"] as const;
export type Gender = (typeof GENDERS)[number] | "";

export type VisaForm = {
  givenNames: string;
  surname: string;
  dateOfBirth: string;
  gender: Gender;
  nationality: string;
  cityOfBirth: string;
  countryOfBirth: string;
  email: string;
  phone: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  passportPlaceOfIssue: string;
  visaProduct: "e-tourist-30";
  arrivalDate: string;
  departureDate: string;
  portOfArrival: string;
  addressInIndia: string;
  cityInIndia: string;
  purpose: string;
  declaration: boolean;
  humanCheck: string;
};

export type UploadMeta = {
  dataUrl: string;
  mime: string;
  bytes: number;
  width?: number;
  height?: number;
  fileName: string;
  prepared?: boolean;
};

export type AiIssue = {
  field: string;
  issue: string;
  severity: "error" | "warning" | "info";
  fix_suggestion: string;
};

export type AiReview = {
  overall_risk: "low" | "medium" | "high";
  can_submit: boolean;
  summary: string;
  issues: AiIssue[];
  source: "openai-vision" | "rules-engine";
  model?: string;
};

export type AuditEvent = {
  id: string;
  at: string;
  event: string;
  fromStatus?: string;
  toStatus?: string;
  detail?: string;
};

export type PaymentRecord = {
  idempotencyKey: string;
  status: PaymentStatus;
  amountUsd: number;
  attemptCount: number;
  lastScenario?: PaymentScenario;
  lastError?: string;
  chargedAt?: string;
  confirmedAt?: string;
};

export type Application = {
  id: string;
  publicId: string;
  status: ApplicationStatus;
  currentStep: number;
  form: VisaForm;
  photo: UploadMeta | null;
  passportScan: UploadMeta | null;
  aiReview: AiReview | null;
  etaMessage: string | null;
  etaIssuedAt: string | null;
  payment: PaymentRecord;
  auditLog: AuditEvent[];
  createdAt: string;
  updatedAt: string;
};

export const EMPTY_FORM: VisaForm = {
  givenNames: "",
  surname: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  cityOfBirth: "",
  countryOfBirth: "",
  email: "",
  phone: "",
  passportNumber: "",
  passportIssueDate: "",
  passportExpiryDate: "",
  passportPlaceOfIssue: "",
  visaProduct: "e-tourist-30",
  arrivalDate: "",
  departureDate: "",
  portOfArrival: "",
  addressInIndia: "",
  cityInIndia: "",
  purpose: "",
  declaration: false,
  humanCheck: "",
};

export const STEPS = [
  { id: "you", label: "You", short: "You" },
  { id: "passport", label: "Passport", short: "Passport" },
  { id: "travel", label: "Travel", short: "Travel" },
  { id: "documents", label: "Photo & scan", short: "Docs" },
  { id: "review", label: "Check & submit", short: "Check" },
  { id: "pay", label: "Pay", short: "Pay" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
