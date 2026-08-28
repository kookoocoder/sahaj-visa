import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { A11yBar } from "@/components/site/a11y-bar";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { Ux4gRuntime } from "@/components/site/ux4g-runtime";
import "ux4g-web-components/styles.css";
import "material-symbols/outlined.css";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoDisplay = Noto_Sans_Display({
  subsets: ["latin"],
  variable: "--font-noto-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sahaj Visa — India visa guidance",
    template: "%s · Sahaj Visa",
  },
  description:
    "Prepare your India e-Visa information with clear requirements, document checks, secure draft saving, and direct access to the official application portal.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      className={`${notoSans.variable} ${notoDisplay.variable} text-size-md h-full`}
    >
      <body className="sahaj-body">
        <Ux4gRuntime />
        <A11yBar />
        <SiteHeader />
        <div id="main-content" className="sahaj-main" tabIndex={-1}>
          {children}
        </div>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
