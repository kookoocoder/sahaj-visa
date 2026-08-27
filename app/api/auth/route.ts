import { NextResponse } from "next/server";
import { checkDemoLogin, setSession, clearSession, getSessionEmail } from "@/lib/session";
import { listByEmail } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password, action } = (await req.json()) as {
    email?: string;
    password?: string;
    action?: "login" | "logout";
  };
  if (action === "logout") {
    await clearSession();
    return NextResponse.json({ ok: true });
  }
  if (!email || !password || !checkDemoLogin(email, password)) {
    return NextResponse.json(
      { error: "Use the demo credentials shown on this page. This is not a real login." },
      { status: 401 },
    );
  }
  await setSession(email);
  const applications = await listByEmail(email);
  return NextResponse.json({ ok: true, email: email.trim().toLowerCase(), applications });
}

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ email: null, applications: [] });
  const applications = await listByEmail(email);
  return NextResponse.json({ email, applications });
}
