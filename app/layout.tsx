import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { A11yBar } from "@/components/site/a11y-bar";
import { SiteFooter, SiteHeader, TrustBanner } from "@/components/site/chrome";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sahaj Visa — independent e-Visa prototype",
    template: "%s · Sahaj Visa",
  },
  description:
    "A resumable, honest, mobile-first prototype of India’s e-Tourist Visa journey. Not a government website.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${figtree.variable} text-size-md h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <A11yBar />
        <TrustBanner />
        <SiteHeader />
        <div id="main-content" className="flex flex-1 flex-col" tabIndex={-1}>
          {children}
        </div>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
