import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Application, AuditEvent } from "@/lib/types";
import { EMPTY_FORM } from "@/lib/types";
import { FEE_USD } from "@/lib/constants";
import { newId, newPublicId, nowIso } from "@/lib/id";

type Database = {
  applications: Record<string, Application>;
};

const g = globalThis as unknown as {
  __sahajDb?: Database;
  __sahajWrite?: Promise<void>;
  __sahajRedis?: Redis | null;
};

const APP_PREFIX = "sahaj:app:";
const PUBLIC_PREFIX = "sahaj:public:";
const EMAIL_PREFIX = "sahaj:email:";

function emptyDb(): Database {
  return { applications: {} };
}

function dataPath() {
  if (process.env.VERCEL) return path.join("/tmp", "sahaj-db.json");
  return path.join(process.cwd(), "data", "sahaj-db.json");
}

function redis(): Redis | null {
  if (g.__sahajRedis !== undefined) return g.__sahajRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  g.__sahajRedis = url && token ? new Redis({ url, token }) : null;
  return g.__sahajRedis;
}

async function readDisk(): Promise<Database> {
  try {
    const raw = await fs.readFile(dataPath(), "utf8");
    return JSON.parse(raw) as Database;
  } catch {
    return emptyDb();
  }
}

async function writeDisk(db: Database) {
  const file = dataPath();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(db), "utf8");
}

async function loadFile(): Promise<Database> {
  if (!g.__sahajDb) {
    g.__sahajDb = await readDisk();
  }
  return g.__sahajDb;
}

async function persistFile(db: Database) {
  g.__sahajDb = db;
  g.__sahajWrite = (g.__sahajWrite ?? Promise.resolve()).then(() => writeDisk(db));
  await g.__sahajWrite;
}

function stamp(
  application: Application,
  event: string,
  extra?: Pick<AuditEvent, "fromStatus" | "toStatus" | "detail">,
): Application {
  const entry: AuditEvent = {
    id: newId(),
    at: nowIso(),
    event,
    ...extra,
  };
  return {
    ...application,
    updatedAt: entry.at,
    auditLog: [...application.auditLog, entry],
  };
}

export function createDraft(partial?: Partial<Application>): Application {
  const createdAt = nowIso();
  return {
    id: newId(),
    publicId: newPublicId(),
    status: "draft",
    currentStep: 0,
    form: { ...EMPTY_FORM, ...partial?.form },
    photo: null,
    passportScan: null,
    aiReview: null,
    etaMessage: null,
    etaIssuedAt: null,
    payment: {
      idempotencyKey: newId(),
      status: "idle",
      amountUsd: FEE_USD,
      attemptCount: 0,
    },
    auditLog: [
      {
        id: newId(),
        at: createdAt,
        event: "draft_created",
        toStatus: "draft",
        detail: "Draft started. This ID stays with you even if the tab closes.",
      },
    ],
    createdAt,
    updatedAt: createdAt,
    ...partial,
  };
}

async function indexEmail(kv: Redis, app: Application, prevEmail?: string) {
  const nextEmail = app.form.email.trim().toLowerCase();
  const old = prevEmail?.trim().toLowerCase();
  if (old && old !== nextEmail) {
    await kv.srem(`${EMAIL_PREFIX}${old}`, app.id);
  }
  if (nextEmail) {
    await kv.sadd(`${EMAIL_PREFIX}${nextEmail}`, app.id);
  }
}

export async function saveApplication(app: Application, event?: string) {
  const prev = await getApplication(app.id);
  const next = event ? stamp(app, event) : { ...app, updatedAt: nowIso() };
  const kv = redis();
  if (kv) {
    await kv.set(`${APP_PREFIX}${next.id}`, next);
    await kv.set(`${PUBLIC_PREFIX}${next.publicId}`, next.id);
    await indexEmail(kv, next, prev?.form.email);
    return next;
  }
  const db = await loadFile();
  db.applications[next.id] = next;
  await persistFile(db);
  return next;
}

export async function getApplication(id: string) {
  const kv = redis();
  if (kv) {
    const direct = await kv.get<Application>(`${APP_PREFIX}${id}`);
    if (direct) return direct;
    const resolved = await kv.get<string>(`${PUBLIC_PREFIX}${id}`);
    if (resolved) {
      return (await kv.get<Application>(`${APP_PREFIX}${resolved}`)) ?? null;
    }
    return null;
  }
  const db = await loadFile();
  return (
    db.applications[id] ??
    Object.values(db.applications).find((a) => a.publicId === id) ??
    null
  );
}

export async function listByEmail(email: string) {
  const needle = email.trim().toLowerCase();
  const kv = redis();
  if (kv) {
    const ids = await kv.smembers(`${EMAIL_PREFIX}${needle}`);
    const apps = await Promise.all(
      ids.map((id) => kv.get<Application>(`${APP_PREFIX}${String(id)}`)),
    );
    return apps
      .filter((a): a is Application => Boolean(a))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  const db = await loadFile();
  return Object.values(db.applications)
    .filter((a) => a.form.email.trim().toLowerCase() === needle)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function transition(
  id: string,
  toStatus: Application["status"],
  detail: string,
) {
  const app = await getApplication(id);
  if (!app) return null;
  const fromStatus = app.status;
  const next = stamp(
    { ...app, status: toStatus },
    `status:${fromStatus}->${toStatus}`,
    { fromStatus, toStatus, detail },
  );
  return saveApplication(next);
}

export async function upsertDraft(payload: Partial<Application> & { id?: string }) {
  const existing = payload.id ? await getApplication(payload.id) : null;
  const base = existing ?? createDraft();
  const merged: Application = {
    ...base,
    ...payload,
    id: base.id,
    publicId: base.publicId,
    form: { ...base.form, ...payload.form },
    payment: { ...base.payment, ...payload.payment },
    createdAt: base.createdAt,
    auditLog: base.auditLog,
  };
  return saveApplication(merged, existing ? "autosave" : "draft_created");
}
