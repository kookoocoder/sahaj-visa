import type { Application, PaymentScenario } from "@/lib/types";

async function json<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: string }).error || `Request failed (${res.status})`);
  }
  return body as T;
}

export async function saveApplicationApi(payload: unknown) {
  return json<{ application: Application }>(
    await fetch("/api/application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function getApplicationApi(id: string) {
  return json<{ application: Application }>(await fetch(`/api/application/${id}`));
}

export async function payApi(id: string, scenario: PaymentScenario) {
  return json<{ application: Application }>(
    await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, scenario }),
    }),
  );
}

export async function reconcileApi(id: string) {
  return json<{ application: Application }>(
    await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "reconcile" }),
    }),
  );
}

export async function reviewApi(id: string) {
  return json<{ application: Application }>(
    await fetch("/api/ai-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }),
  );
}

export async function assistApi(field: string, question: string, language?: string) {
  return json<{ answer: string; source: string }>(
    await fetch("/api/ai-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, question, language }),
    }),
  );
}

export async function etaApi(id: string) {
  return json<{ message: string; application: Application }>(
    await fetch("/api/ai-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }),
  );
}

export async function loginApi(email: string, password: string) {
  return json<{ ok: true; email: string }>(
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),
  );
}

export async function submitApplicationApi(id: string) {
  return json<{ application: Application }>(
    await fetch("/api/application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, submit: true }),
    }),
  );
}
