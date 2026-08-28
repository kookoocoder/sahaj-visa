import OpenAI from "openai";
import type { AiReview, Application } from "@/lib/types";
import { RULES_DOC, searchRules } from "@/lib/visa-rules";
import { QUEUE_STATS } from "@/lib/constants";
import { runRulesEngine } from "@/lib/rules-engine";

const VISION_MODEL = process.env.OPENAI_VISION_MODEL || "gpt-4o";
const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";

function client() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY);
}

const REVIEW_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overall_risk", "can_submit", "summary", "issues"],
  properties: {
    overall_risk: { type: "string", enum: ["low", "medium", "high"] },
    can_submit: { type: "boolean" },
    summary: { type: "string" },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["field", "issue", "severity", "fix_suggestion"],
        properties: {
          field: { type: "string" },
          issue: { type: "string" },
          severity: { type: "string", enum: ["error", "warning", "info"] },
          fix_suggestion: { type: "string" },
        },
      },
    },
  },
} as const;

export async function reviewApplication(app: Application): Promise<AiReview> {
  const fallback = runRulesEngine(app);
  const openai = client();
  if (!openai || (!app.photo && !app.passportScan)) {
    return fallback;
  }

  const images: OpenAI.Chat.ChatCompletionContentPart[] = [];
  if (app.photo?.dataUrl) {
    images.push({
      type: "text",
      text: `Photograph metadata: ${app.photo.width ?? "?"}×${app.photo.height ?? "?"}px, ${Math.round(app.photo.bytes / 1024)} KB, mime ${app.photo.mime}.`,
    });
    images.push({ type: "image_url", image_url: { url: app.photo.dataUrl } });
  }
  if (app.passportScan?.dataUrl) {
    images.push({
      type: "text",
      text: "Passport biodata page scan follows. Check readability of name, number, dates. Do not extract or repeat full MRZ/PII beyond whether it is legible.",
    });
    images.push({ type: "image_url", image_url: { url: app.passportScan.dataUrl } });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: VISION_MODEL,
      temperature: 0.2,
      response_format: {
        type: "json_schema",
        json_schema: { name: "visa_precheck", strict: true, schema: REVIEW_SCHEMA },
      },
      messages: [
        {
          role: "system",
          content: `You are an assistive pre-submission checker for a mocked Indian e-Tourist Visa form. You are NOT a decision-maker and must say so in the summary. Be specific and kind. Cite visible photo problems (shadows, not square, glasses, hat, busy background, cropped chin/crown, too dark). Combine with these deterministic findings:\n${JSON.stringify(fallback.issues)}\nRules:\n${RULES_DOC}\nReturn JSON only. Field names should match the form: photo, passportScan, givenNames, surname, dateOfBirth, arrivalDate, departureDate, passportExpiryDate, passportNumber, humanCheck, etc.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Form answers (prototype, fictional use): ${JSON.stringify({
                ...app.form,
                email: app.form.email ? "[present]" : "",
                phone: app.form.phone ? "[present]" : "",
                aadhaarNumber: app.form.aadhaarNumber ? "[present]" : "",
                panNumber: app.form.panNumber ? "[present]" : "",
                passportNumber: app.form.passportNumber ? "[present]" : "",
              })}`,
            },
            ...images,
          ],
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Omit<AiReview, "source" | "model">;
    const mergedIssues = [...parsed.issues];
    for (const issue of fallback.issues) {
      if (!mergedIssues.some((i) => i.field === issue.field && i.issue === issue.issue)) {
        mergedIssues.push(issue);
      }
    }
    const errors = mergedIssues.filter((i) => i.severity === "error").length;
    return {
      ...parsed,
      issues: mergedIssues,
      can_submit: parsed.can_submit && errors === 0,
      source: "openai-vision",
      model: VISION_MODEL,
    };
  } catch {
    return { ...fallback, summary: `${fallback.summary} (Vision model unavailable — used the rules engine.)` };
  }
}

export async function assistField(field: string, question: string, language = "English") {
  const grounded = searchRules(`${field} ${question}`);
  const openai = client();
  if (!openai) {
    return {
      answer: grounded.slice(0, 700),
      source: "rules-doc" as const,
    };
  }
  const completion = await openai.chat.completions.create({
    model: TEXT_MODEL,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a narrow form co-pilot for Sahaj Visa, an independent prototype. Answer ONLY from the rules document. If it is not in the document, say you do not know and that this is not the official portal. Never invent fees, eligibility, or processing times. Language: ${language}. Keep answers under 120 words, plain language, no jargon.\n\n${RULES_DOC}`,
      },
      {
        role: "user",
        content: `Field: ${field}\nQuestion: ${question}\nRelevant excerpts:\n${grounded}`,
      },
    ],
  });
  return {
    answer: completion.choices[0]?.message?.content?.trim() || grounded.slice(0, 700),
    source: "openai-text" as const,
    model: TEXT_MODEL,
  };
}

export async function phraseEta() {
  const openai = client();
  const facts = QUEUE_STATS;
  const templated = `Current mocked queue: about ${facts.medianDays} days at the median (${facts.p50}–${facts.p90} day range). ${facts.similarShare}% of applications this month in this prototype’s seed data finished in a similar window. The five-year official average of ${facts.pctCleared72hOfficialFiveYear}% in 72 hours is not what this month looks like (${facts.pctCleared72hThisMonthMock}% in 72 hours in the mock). This is not a promise.`;
  if (!openai) {
    return { message: templated, source: "template" as const };
  }
  const completion = await openai.chat.completions.create({
    model: TEXT_MODEL,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content:
          "Rewrite the queue facts as one honest status paragraph for a worried traveller. Do not promise 72 hours. Do not invent numbers. Mention that figures are mocked for this prototype. Max 70 words.",
      },
      { role: "user", content: JSON.stringify(facts) },
    ],
  });
  return {
    message: completion.choices[0]?.message?.content?.trim() || templated,
    source: "openai-text" as const,
    model: TEXT_MODEL,
  };
}
