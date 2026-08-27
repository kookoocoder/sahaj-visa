import { NextResponse } from "next/server";
import { getApplication, transition } from "@/lib/db";

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const app = await getApplication(id);
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (app.status !== "under_review" && app.status !== "payment_confirmed") {
    return NextResponse.json(
      { error: "ETA can only be issued after payment is confirmed." },
      { status: 400 },
    );
  }
  const issued = await transition(
    app.id,
    "eta_issued",
    "Prototype shortcut: mock ETA issued. No real immigration clearance happened.",
  );
  if (!issued) return NextResponse.json({ error: "Failed" }, { status: 500 });
  issued.etaIssuedAt = new Date().toISOString();
  return NextResponse.json({ application: issued });
}
