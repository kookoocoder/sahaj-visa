"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SiteFooter, SiteHeader, TrustBanner } from "@/components/site/chrome";
import { Field, TextInput } from "@/components/apply/field";
import { loginApi } from "@/lib/api";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/constants";
import { useDraft } from "@/lib/draft-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await loginApi(email, password);
      toast.success("Demo session started.");
      const id = useDraft.getState().id;
      router.push(id ? "/apply" : "/apply");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <TrustBanner />
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-12">
        <h1 className="font-heading text-3xl">Demo login</h1>
        <p className="mt-2 text-muted-foreground">
          Mock credentials only. Shown here on purpose so judges can enter without requesting access.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(e);
          }}
          className="mt-8 space-y-4"
        >
          <Field label="Email" htmlFor="email">
            <TextInput id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="Password" htmlFor="password">
            <TextInput id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-medium text-primary-foreground disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
