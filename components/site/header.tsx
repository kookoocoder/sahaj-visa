"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SahajEmblem } from "@/components/site/logo";
import { Icon } from "@/components/site/icon";
import { PRIMARY_NAV } from "@/lib/nav";
import { PRODUCT_NAME } from "@/lib/constants";

function navActive(pathname: string, href: string, exact?: boolean) {
  if (href.includes("#")) return false;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sahaj-header">
      <nav className="ux4g-navbar" aria-label="Primary">
        <div className="ux4g-container">
          <div className="ux4g-navbar-wrap">
            <Link href="/" className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-s">
              <SahajEmblem className="ux4g-navbar-logo" />
              <span className="ux4g-divider-vertical" />
              <span className="ux4g-d-flex ux4g-flex-column">
                <span className="ux4g-label-m-strong">{PRODUCT_NAME}</span>
                <span lang="hi" className="sahaj-brand-hi">
                  स्वतंत्र मार्गदर्शन
                </span>
              </span>
            </Link>

            <div className="ux4g-navbar-desktop">
              <div className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-l">
                <ul className="ux4g-navbar-links">
                  {PRIMARY_NAV.map((item) => {
                    const active = navActive(pathname, item.href, "exact" in item && item.exact);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="ux4g-text-link-sm"
                          aria-current={active ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <a
                  href="https://indianvisaonline.gov.in/evisa/tvoa.html"
                  target="_blank"
                  rel="noreferrer"
                  className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
                >
                  Official portal
                  <Icon name="open_in_new" className="ux4g-fs-18" />
                </a>
                <Link href="/apply" className="ux4g-btn ux4g-btn-primary ux4g-btn-md">
                  Start e-Visa
                </Link>
              </div>
            </div>

            <div className="ux4g-navbar-mobile">
              <button
                type="button"
                className="ux4g-btn ux4g-btn-outline-primary ux4g-btn-md"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((value) => !value)}
              >
                <Icon name={open ? "close" : "menu"} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open ? (
        <div className="ux4g-container ux4g-py-xs">
          <ul className="ux4g-list ux4g-list-default ux4g-list-m">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href} className="ux4g-list-item">
                <Link
                  href={item.href}
                  className="ux4g-list-item-row"
                  onClick={() => setOpen(false)}
                >
                  <span className="ux4g-list-item-start">{item.label}</span>
                  <span className="ux4g-list-item-end ux4g-icon-outlined">chevron_right</span>
                </Link>
              </li>
            ))}
            <li className="ux4g-list-item">
              <a
                href="https://indianvisaonline.gov.in/evisa/tvoa.html"
                target="_blank"
                rel="noreferrer"
                className="ux4g-btn ux4g-btn-primary ux4g-btn-md ux4g-w-100"
                onClick={() => setOpen(false)}
              >
                Official application portal
                <Icon name="open_in_new" />
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
