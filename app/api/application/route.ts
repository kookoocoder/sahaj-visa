import { NextResponse } from "next/server";
import { upsertDraft, getApplication, saveApplication, transition } from "@/lib/db";
import { visaFormSchema, flattenZod } from "@/lib/validation";
import { runRulesEngine } from "@/lib/rules-engine";
import type { Application } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<
    Pick<Application, "id" | "currentStep" | "form" | "photo" | "passportScan">
  > & {
    id?: string;
    submit?: boolean;
  };

  const existing = body.id ? await getApplication(body.id) : null;
  if (existing && existing.status !== "draft") {
    return NextResponse.json(
      { error: "Submitted applications are locked and cannot be edited again." },
      { status: 409 },
    );
  }

  const draft: Partial<Application> & { id?: string } = { id: body.id };
  if ("currentStep" in body) draft.currentStep = body.currentStep;
  if ("form" in body) draft.form = body.form;
  if ("photo" in body) draft.photo = body.photo;
  if ("passportScan" in body) draft.passportScan = body.passportScan;
  const saved = await upsertDraft(draft);

  if (body.submit) {
    const parsed = visaFormSchema.safeParse(saved.form);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Fix the highlighted fields before submitting.", fields: flattenZod(parsed.error), application: saved },
        { status: 400 },
      );
    }
    const review = runRulesEngine(saved);
    const checked = await saveApplication({ ...saved, precheck: review }, "precheck_completed");
    if (!review.can_submit) {
      return NextResponse.json(
        { error: "Pre-check still has blocking issues.", application: checked },
        { status: 400 },
      );
    }
    const submitted = await transition(
      saved.id,
      "submitted",
      "Citizen submitted. No further edits. Payment is next.",
    );
    if (!submitted) {
      return NextResponse.json({ error: "Invalid application status transition." }, { status: 409 });
    }
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
