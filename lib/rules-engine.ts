import type { Application, ApplicationReview, ReviewIssue } from "@/lib/types";
import { daysBetween, addMonths, parseDate } from "@/lib/id";
import { HUMAN_CHECK_ANSWER } from "@/lib/constants";
import { FORM_INPUT_FORMAT, FORMAT_SPECS, FIELD_LABELS } from "@/lib/input-format";

function push(
  issues: ReviewIssue[],
  field: string,
  severity: ReviewIssue["severity"],
  issue: string,
  fix_suggestion: string,
) {
  issues.push({ field, severity, issue, fix_suggestion });
}

export function runRulesEngine(app: Application): ApplicationReview {
  const issues: ReviewIssue[] = [];
  const { form, photo, passportScan } = app;
  const today = new Date().toISOString().slice(0, 10);

  if (!form.givenNames || !form.surname) {
    push(
      issues,
      "givenNames",
      "error",
      "Name is incomplete.",
      "Copy the given names and surname exactly as they appear on the passport biodata page — no extra initials.",
    );
  }

  for (const [key, format] of Object.entries(FORM_INPUT_FORMAT)) {
    const value = form[key as keyof typeof form];
    if (typeof value !== "string" || !value) continue;
    const message = FORMAT_SPECS[format].validate(value, FIELD_LABELS[key as keyof typeof FIELD_LABELS]);
    if (message) {
      push(issues, key, "error", message, FORMAT_SPECS[format].hint);
    }
  }

  if (form.dateOfBirth && form.dateOfBirth > today) {
    push(issues, "dateOfBirth", "error", "Date of birth is in the future.", "Use the date printed on the passport.");
  }

  const lead = form.arrivalDate ? daysBetween(today, form.arrivalDate) : null;
  if (lead !== null && lead < 4) {
    push(
      issues,
      "arrivalDate",
      "error",
      `Arrival is only ${lead} day(s) away. The live rule is: finish paying at least 4 days before arrival.`,
      "Pick a later arrival date, or know that a real application started today would likely be refused as too late — traveller reports often need 7–10 days.",
    );
  } else if (lead !== null && lead < 10) {
    push(
      issues,
      "arrivalDate",
      "warning",
      `Arrival is ${lead} days away. The portal still advertises 4 days / 72 hours; recent waits are often 7–10 days.`,
      "If you can, leave more than 10 days. We will still let you apply, with an honest queue estimate after payment.",
    );
  }

  if (form.arrivalDate && form.departureDate) {
    const stay = daysBetween(form.arrivalDate, form.departureDate);
    if (stay !== null && stay < 0) {
      push(issues, "departureDate", "error", "Departure is before arrival.", "Swap the dates.");
    } else if (stay !== null && stay > 30) {
      push(
        issues,
        "departureDate",
        "error",
        `This product is a 30-day e-Tourist Visa. Your stay is ${stay} days.`,
        "Shorten the trip, or (in real life) look at the 1-year / 5-year products — not built in this prototype.",
      );
    }
  }

  if (form.arrivalDate && form.passportExpiryDate) {
    const minExpiry = addMonths(form.arrivalDate, 6);
    const expiry = parseDate(form.passportExpiryDate);
    if (minExpiry && expiry && expiry < minExpiry) {
      push(
        issues,
        "passportExpiryDate",
        "error",
        "Passport expires within six months of arrival.",
        "Renew the passport before applying. This is a hard live-system rule, not a suggestion.",
      );
    }
  }

  if (form.passportIssueDate && form.dateOfBirth && form.passportIssueDate < form.dateOfBirth) {
    push(issues, "passportIssueDate", "error", "Passport issue date is before date of birth.", "Check the scan.");
  }

  if (!photo) {
    push(issues, "photo", "error", "No photograph uploaded.", "Upload a face photo. We will square-crop it on this device.");
  } else {
    const { width, height, bytes } = photo;
    if (width && height) {
      const ratio = width / height;
      if (ratio < 0.9 || ratio > 1.1) {
        push(
          issues,
          "photo",
          "warning",
          `Photo is ${width}×${height}px (not square). The live site rejects this with almost no explanation.`,
          "Use ‘Prepare a square photo’ — we crop from the centre and export a JPEG that should pass the size rules.",
        );
      }
      if (Math.min(width, height) < 350) {
        push(
          issues,
          "photo",
          "error",
          `Photo is only ${width}×${height}px. Live caps are often described as 350×350 or larger.`,
          "Use a higher-resolution original, then let us resize down — not up.",
        );
      }
    }
    const kb = Math.round(bytes / 1024);
    if (kb < 10) {
      push(issues, "photo", "error", `Photo is ${kb} KB — below the usual 10 KB floor.`, "Export at higher JPEG quality.");
    } else if (kb > 300) {
      push(
        issues,
        "photo",
        "error",
        `Photo is ${kb} KB. Live pages contradict each other (300 KB vs 1 MB) and then reject you anyway.`,
        "Use ‘Prepare a square photo’ — we compress into the 10–300 KB window.",
      );
    }
  }

  if (!passportScan) {
    push(
      issues,
      "passportScan",
      "error",
      "No passport scan uploaded.",
      "Photograph the biodata page on a flat surface, no flash glare, all four corners visible.",
    );
  }

  if (form.humanCheck && form.humanCheck.trim().toUpperCase() !== HUMAN_CHECK_ANSWER) {
    push(issues, "humanCheck", "error", "The confirmation word does not match.", "Type INDIA. This replaces a distorted CAPTCHA.");
  }

  const errors = issues.filter((i) => i.severity === "error").length;
  const overall_risk = errors >= 2 ? "high" : errors === 1 || issues.some((i) => i.severity === "warning") ? "medium" : "low";

  return {
    overall_risk,
    can_submit: errors === 0,
    summary:
      errors === 0
        ? issues.length
          ? "No blocking issues. Read the warnings before you pay — the fee is non-refundable on the live system."
          : "This draft looks ready to submit. The assistive check did not find a blocking problem."
        : `We found ${errors} blocking issue${errors === 1 ? "" : "s"} you would likely bounce on in the live portal. Fix them here so you do not start over after paying.`,
    issues,
    source: "rules-engine",
  };
}
