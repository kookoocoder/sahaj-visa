import { NextResponse } from "next/server";
import { upsertDraft, getApplication, transition } from "@/lib/db";
import { visaFormSchema, flattenZod } from "@/lib/validation";
import { runRulesEngine } from "@/lib/rules-engine";
import type { Application } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Application> & {
    id?: string;
    submit?: boolean;
  };

  const { submit, ...rest } = body;
  const saved = await upsertDraft(rest);

  if (submit) {
    const parsed = visaFormSchema.safeParse(saved.form);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Fix the highlighted fields before submitting.", fields: flattenZod(parsed.error), application: saved },
        { status: 400 },
      );
    }
    const review = saved.aiReview ?? runRulesEngine(saved);
    if (!review.can_submit) {
      return NextResponse.json(
        { error: "Assistive pre-check still has blocking issues.", application: { ...saved, aiReview: review } },
        { status: 400 },
      );
    }
    const submitted = await transition(
      saved.id,
      "submitted",
      "Citizen submitted. No further edits. Payment is next.",
    );
    return NextResponse.json({ application: submitted });
  }

  return NextResponse.json({ application: saved });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const application = await getApplication(id);
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ application });
}
