import { NextResponse } from "next/server";
import { getApplication, saveApplication } from "@/lib/db";
import { buildEtaMessage } from "@/lib/status-message";

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const application = await getApplication(id);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (application.etaMessage) {
    return NextResponse.json({ message: application.etaMessage, application });
  }

  const message = buildEtaMessage();
  const saved = await saveApplication({ ...application, etaMessage: message }, "eta_message_generated");
  return NextResponse.json({ message, application: saved });
}
