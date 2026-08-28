"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X } from "lucide-react";
import { EVisaMark, SahajEmblem } from "@/components/site/logo";
import { PRIMARY_NAV } from "@/lib/nav";
import { PRODUCT_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

function navActive(pathname: string, href: string, exact?: boolean) {
  if (href.includes("#")) return false;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <SahajEmblem />
          <span className="hidden leading-tight sm:block">
            <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Independent prototype
            </span>
            <span className="block text-xs text-muted-foreground">Not a Government of India website</span>
          </span>
        </Link>
        <div className="min-w-0 text-center">
          <p className="font-heading text-base leading-tight text-foreground sm:text-xl">
            {PRODUCT_NAME}
          </p>
          <p className="hidden text-[11px] text-muted-foreground sm:block">
            A calmer visa application to India
          </p>
        </div>
        <div className="flex items-center gap-2">
          <EVisaMark />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <nav className="bg-primary text-primary-foreground" aria-label="Primary">
        <ul className="mx-auto hidden max-w-6xl items-stretch px-2 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const active = navActive(pathname, item.href, "exact" in item && item.exact);
            return (
              <li key={item.href + item.label} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-11 items-center justify-center gap-1.5 border-r border-white/15 px-2 text-center text-[12px] font-medium transition-colors last:border-r-0 xl:text-[13px]",
                    active ? "bg-white/15" : "hover:bg-white/10",
                  )}
                >
                  {item.label === "Home" ? <Home className="size-3.5" aria-hidden /> : null}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {open ? (
          <ul className="grid gap-0.5 px-3 py-3 lg:hidden">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </header>
  );
}
