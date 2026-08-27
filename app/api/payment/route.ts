import { NextResponse } from "next/server";
import { getApplication, transition } from "@/lib/db";
import { attemptPayment, reconcilePayment } from "@/lib/payment";
import { PAYMENT_SCENARIOS, type PaymentScenario } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    id?: string;
    scenario?: PaymentScenario;
    action?: "reconcile" | "pay";
  };
  if (!body.id) {
    return NextResponse.json({ error: "Missing application id" }, { status: 400 });
  }
  const app = await getApplication(body.id);
  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (app.status === "draft") {
    return NextResponse.json({ error: "Submit the application before paying." }, { status: 400 });
  }

  if (body.action === "reconcile") {
    const reconciled = await reconcilePayment(app);
    const reviewing = await transition(
      reconciled.id,
      "under_review",
      "Payment reconciled without a second charge. Application moved to review.",
    );
    return NextResponse.json({ application: reviewing });
  }

  const scenario = body.scenario ?? "success";
  if (!PAYMENT_SCENARIOS.includes(scenario)) {
    return NextResponse.json({ error: "Unknown payment scenario" }, { status: 400 });
  }

  const paid = await attemptPayment(app, scenario);
  if (paid.payment.status === "confirmed") {
    const reviewing = await transition(
      paid.id,
      "under_review",
      "Payment confirmed. Mock review queue — not IVFRT, not a real clearance.",
    );
    return NextResponse.json({ application: reviewing });
  }
  return NextResponse.json({ application: paid });
}
