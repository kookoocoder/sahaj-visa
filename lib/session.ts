import { cookies } from "next/headers";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/constants";

const COOKIE = "sahaj_session";

export function checkDemoLogin(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD
  );
}

export async function setSession(email: string) {
  const jar = await cookies();
  jar.set(COOKIE, email.trim().toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionEmail() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? null;
}
