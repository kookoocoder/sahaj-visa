import { NextResponse } from "next/server";
import { getApplication, saveApplication } from "@/lib/db";
import { runRulesEngine } from "@/lib/rules-engine";

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const application = await getApplication(id);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const precheck = runRulesEngine(application);
  const saved = await saveApplication({ ...application, precheck }, "precheck_completed");
  return NextResponse.json({ application: saved });
}
