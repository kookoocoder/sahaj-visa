import type { Metadata } from "next";

export const metadata: Metadata = { title: "Demo login" };

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}
