import { SiteFooter, SiteHeader, TrustBanner } from "@/components/site/chrome";
import { Wizard } from "@/components/apply/wizard";

export default function ApplyPage() {
  return (
    <>
      <TrustBanner />
      <SiteHeader compact />
      <main className="flex-1">
        <Wizard />
      </main>
      <SiteFooter />
    </>
  );
}
