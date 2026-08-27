import { NextResponse } from "next/server";
import { getApplication, saveApplication } from "@/lib/db";
import { phraseEta } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const app = await getApplication(id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { message } = await phraseEta();
  const saved = await saveApplication({ ...app, etaMessage: message }, "eta_phrased");
  return NextResponse.json({ message, application: saved });
}
