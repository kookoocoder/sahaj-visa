import { z } from "zod";
import { HUMAN_CHECK_ANSWER } from "@/lib/constants";

export const visaFormSchema = z.object({
  givenNames: z.string().trim().min(1, "Enter your given names as in the passport."),
  surname: z.string().trim().min(1, "Enter your surname as in the passport."),
  dateOfBirth: z.string().min(1, "Enter your date of birth."),
  gender: z.string().min(1, "Choose a gender option."),
  nationality: z.string().min(1, "Choose a nationality from the mocked eligible list."),
  cityOfBirth: z.string().trim().min(1, "Enter city of birth."),
  countryOfBirth: z.string().trim().min(1, "Enter country of birth."),
  email: z.string().trim().email("Enter a valid email — this is where the ETA would go."),
  phone: z.string().trim().min(8, "Enter a phone number with country code."),
  passportNumber: z
    .string()
    .trim()
    .min(5, "Enter the passport number.")
    .regex(/^[A-Za-z0-9]+$/, "Passport numbers are letters and numbers only."),
  passportIssueDate: z.string().min(1, "Enter the issue date."),
  passportExpiryDate: z.string().min(1, "Enter the expiry date."),
  passportPlaceOfIssue: z.string().trim().min(1, "Enter place of issue."),
  visaProduct: z.literal("e-tourist-30"),
  arrivalDate: z.string().min(1, "Enter your intended arrival date."),
  departureDate: z.string().min(1, "Enter your intended departure date."),
  portOfArrival: z.string().min(1, "Choose a port of arrival."),
  addressInIndia: z.string().trim().min(8, "Enter the first address where you will stay."),
  cityInIndia: z.string().trim().min(2, "Enter the city."),
  purpose: z.string().trim().min(4, "In a sentence, why are you visiting?"),
  declaration: z.boolean().refine((v) => v === true, {
    message: "You need to confirm the declaration to submit.",
  }),
  humanCheck: z
    .string()
    .trim()
    .refine((v) => v.toUpperCase() === HUMAN_CHECK_ANSWER, {
      message: "Type INDIA (all caps is fine) to confirm you are applying as a person.",
    }),
});

export type FieldErrors = Record<string, string>;

export function flattenZod(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
