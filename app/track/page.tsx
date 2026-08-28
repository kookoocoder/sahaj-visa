import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, InfoCallout, PageMasthead } from "@/components/site/chrome";
import { ResumeForm } from "@/components/site/resume-form";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/constants";

export const metadata: Metadata = { title: "Track application" };

export default function TrackPage() {
  return (
    <div>
      <PageMasthead title="Track Application" subtitle="Resume a draft or open a status timeline with your application ID" />
      <Container className="max-w-2xl py-6 sm:py-8">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Track Application" }]} />
        <div className="mt-6 space-y-6">
          <InfoCallout>
            <p>
              Paste SV-26-XXXXXX. If the application is still a draft you return to the form. If you
              have paid, you land on the status timeline.
            </p>
          </InfoCallout>
          <div className="rounded-xl border border-border bg-card p-5">
            <ResumeForm />
          </div>
          <p className="text-sm text-muted-foreground">
            Or{" "}
            <Link href="/login" className="font-medium text-primary underline-offset-2 hover:underline">
              demo login
            </Link>{" "}
            with {DEMO_EMAIL} / {DEMO_PASSWORD}, then continue the form on this device.
          </p>
        </div>
      </Container>
    </div>
  );
}
