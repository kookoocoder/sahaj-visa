import { z } from "zod";
import { HUMAN_CHECK_ANSWER } from "@/lib/constants";
import { FORMAT_SPECS, type FieldErrors } from "@/lib/input-format";

export type { FieldErrors };

function zFormat(format: keyof typeof FORMAT_SPECS, label?: string) {
  const spec = FORMAT_SPECS[format];
  return z.string().trim().refine((val) => spec.validate(val, label) === undefined, {
    message: spec.hint,
  });
}

export const visaFormSchema = z.object({
  givenNames: zFormat("personName", "Given names"),
  surname: zFormat("personName", "Surname"),
  dateOfBirth: z.string().min(1, "Enter your date of birth."),
  gender: z.string().min(1, "Choose a gender option."),
  nationality: z.string().min(1, "Choose your nationality."),
  cityOfBirth: zFormat("place", "Place of birth"),
  countryOfBirth: zFormat("place", "Country of birth"),
  email: zFormat("email"),
  phone: zFormat("mobile"),
  passportNumber: zFormat("passport"),
  passportIssueDate: z.string().min(1, "Enter the issue date."),
  passportExpiryDate: z.string().min(1, "Enter the expiry date."),
  passportPlaceOfIssue: zFormat("place", "Place of issue"),
  visaProduct: z.literal("e-tourist-30"),
  arrivalDate: z.string().min(1, "Enter your intended arrival date."),
  departureDate: z.string().min(1, "Enter your intended departure date."),
  portOfArrival: z.string().min(1, "Choose a port of arrival."),
  addressInIndia: zFormat("address"),
  cityInIndia: zFormat("place", "City in India"),
  purpose: zFormat("purpose"),
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

export function flattenZod(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export { validateVisaFields } from "@/lib/input-format";
