"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Field, TextInput } from "@/components/apply/field";
import { Container, PageMasthead } from "@/components/site/chrome";
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
    <div>
      <PageMasthead title="Demo login" subtitle="Mock credentials, shown on purpose so anyone can enter" />
      <Container className="max-w-md py-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(e);
          }}
          className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm"
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
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </Container>
    </div>
  );
}
