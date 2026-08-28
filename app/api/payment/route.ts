import { NextResponse } from "next/server";
import { getApplication, saveApplication, transition } from "@/lib/db";
import { attemptPayment, reconcilePayment } from "@/lib/payment";
import { buildEtaMessage } from "@/lib/status-message";
import { PAYMENT_SCENARIOS, type Application, type PaymentScenario } from "@/lib/types";

async function addEtaMessage(application: Application) {
  if (application.etaMessage) return application;
  return saveApplication(
    { ...application, etaMessage: buildEtaMessage() },
    "eta_message_generated",
  );
}

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
    if (app.payment.status !== "charged_unconfirmed" && app.payment.status !== "pending") {
      return NextResponse.json(
        { error: "Only an unconfirmed charge can be reconciled." },
        { status: 409 },
      );
    }
    const reconciled = await reconcilePayment(app);
    const reviewing = await transition(
      reconciled.id,
      "under_review",
      "Payment reconciled without a second charge. Application moved to review.",
    );
    if (!reviewing) {
      return NextResponse.json({ error: "Invalid payment status transition." }, { status: 409 });
    }
    return NextResponse.json({ application: await addEtaMessage(reviewing) });
  }

  if (app.payment.status === "charged_unconfirmed") {
    return NextResponse.json(
      { error: "A charge may already exist. Reconcile it instead of starting another payment." },
      { status: 409 },
    );
  }
  if (app.payment.status === "confirmed") {
    return NextResponse.json({ application: app });
  }
  if (!["submitted", "payment_pending", "payment_failed"].includes(app.status)) {
    return NextResponse.json(
      { error: "This application is not waiting for payment." },
      { status: 409 },
    );
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
    if (!reviewing) {
      return NextResponse.json({ error: "Invalid payment status transition." }, { status: 409 });
    }
    return NextResponse.json({ application: await addEtaMessage(reviewing) });
  }
  return NextResponse.json({ application: paid });
}
