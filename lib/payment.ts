import type { Application, PaymentScenario } from "@/lib/types";
import { FEE_USD } from "@/lib/constants";
import { nowIso } from "@/lib/id";
import { saveApplication } from "@/lib/db";

/**
 * Deterministic payment state machine.
 * Idempotency key is the citizen's protection against the live failure mode:
 * "charged, status not updated, 30-minute lockout, retry = maybe double charge".
 */
export async function attemptPayment(app: Application, scenario: PaymentScenario) {
  const key = app.payment.idempotencyKey;
  const alreadyTerminal =
    app.payment.status === "confirmed" && app.payment.idempotencyKey === key;

  if (alreadyTerminal) {
    return saveApplication(
      {
        ...app,
        payment: { ...app.payment, lastError: undefined },
      },
      "payment_idempotent_replay",
    );
  }

  if (app.payment.status === "charged_unconfirmed") {
    return saveApplication(
      {
        ...app,
        payment: {
          ...app.payment,
          lastError:
            "A charge is already sitting in ‘unconfirmed’. We will not take another attempt with this key. Reconcile instead.",
        },
      },
      "payment_blocked_duplicate",
    );
  }

  const attemptCount = app.payment.attemptCount + 1;
  const base = {
    ...app.payment,
    amountUsd: FEE_USD,
    idempotencyKey: key,
    attemptCount,
    lastScenario: scenario,
  };

  if (scenario === "decline") {
    const next: Application = {
      ...app,
      status: "payment_failed",
      payment: {
        ...base,
        status: "failed",
        lastError: "Mock issuer declined (foreign card simulation). You can retry immediately — no 30-minute lockout.",
      },
    };
    return saveApplication(next, "payment_declined");
  }

  if (scenario === "charged_unconfirmed") {
    const next: Application = {
      ...app,
      status: "payment_charged_unconfirmed",
      payment: {
        ...base,
        status: "charged_unconfirmed",
        chargedAt: nowIso(),
        lastError:
          "Mock gateway charged the card but did not confirm back (the failure travellers actually hit). Same idempotency key — we will not charge again.",
      },
    };
    return saveApplication(next, "payment_charged_unconfirmed");
  }

  const next: Application = {
    ...app,
    status: "payment_confirmed",
    payment: {
      ...base,
      status: "confirmed",
      chargedAt: app.payment.chargedAt ?? nowIso(),
      confirmedAt: nowIso(),
      lastError: undefined,
    },
  };
  return saveApplication(next, "payment_confirmed");
}

export async function reconcilePayment(app: Application) {
  if (app.payment.status === "confirmed") return app;
  if (app.payment.status !== "charged_unconfirmed" && app.payment.status !== "pending") {
    return app;
  }
  const next: Application = {
    ...app,
    status: "payment_confirmed",
    payment: {
      ...app.payment,
      status: "confirmed",
      confirmedAt: nowIso(),
      lastError: undefined,
    },
  };
  return saveApplication(next, "payment_reconciled");
}
