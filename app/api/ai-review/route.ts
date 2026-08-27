import { NextResponse } from "next/server";
import { getApplication, saveApplication } from "@/lib/db";
import { reviewApplication } from "@/lib/ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const app = await getApplication(id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const aiReview = await reviewApplication(app);
  const saved = await saveApplication({ ...app, aiReview }, "ai_precheck");
  return NextResponse.json({ application: saved });
}
