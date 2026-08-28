import type { Application } from "@/lib/types";

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

export async function precheckApi(id: string) {
  return json<{ application: Application }>(
    await fetch("/api/precheck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
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
