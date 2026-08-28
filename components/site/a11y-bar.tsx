"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";

const SIZES = ["sm", "md", "lg"] as const;
type Size = (typeof SIZES)[number];

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readSize(): Size {
  const stored = window.localStorage.getItem("sahaj-text-size") as Size | null;
  return stored && SIZES.includes(stored) ? stored : "md";
}

function applySize(size: Size) {
  const html = document.documentElement;
  html.classList.remove("text-size-sm", "text-size-md", "text-size-lg");
  html.classList.add(`text-size-${size}`);
}

export function A11yBar() {
  const size = useSyncExternalStore(subscribe, readSize, () => "md" as Size);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    applySize(size);
  }, [size]);

  useEffect(() => {
    const stored = window.localStorage.getItem("sahaj-theme");
    const enabled = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = enabled ? "dark" : "light";
    queueMicrotask(() => setDark(enabled));
  }, []);

  function changeSize(next: Size) {
    window.localStorage.setItem("sahaj-text-size", next);
    applySize(next);
    emit();
  }

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("sahaj-theme", next ? "dark" : "light");
  }

  return (
    <header className="ux4g-topbar ux4g-topbar-wide" role="banner">
      <div className="ux4g-container">
        <div className="ux4g-topbar__wrap ux4g-d-flex ux4g-jc-between ux4g-ai-center">
          <div className="ux4g-d-flex ux4g-ai-center ux4g-gap-x-xs">
            <span className="ux4g-icon-outlined ux4g-top-bar-icon" aria-hidden="true">public</span>
            <span className="ux4g-label-m-default">Independent India visa guidance · स्वतंत्र मार्गदर्शन</span>
          </div>
          <nav aria-label="Top utilities" className="ux4g-d-flex ux4g-ai-center">
          <a
            href="#main-content"
            className="ux4g-label-m-default ux4g-topbar__skip"
          >
            Skip to Main Content
          </a>
          <span className="ux4g-bl-1 acc-top-divider ux4g-d-none ux4g-md-d-flex" />
          <Link
            href="/instructions#accessibility"
            className="ux4g-label-m-default ux4g-topbar__skip ux4g-d-none ux4g-md-d-flex"
          >
            Screen Reader Access
          </Link>
          <span className="ux4g-bl-1 acc-top-divider ux4g-d-none ux4g-md-d-flex" />
          <div className="ux4g-topbar__group ux4g-d-flex ux4g-ai-center" role="group" aria-label="Text size controls">
            <button
              type="button"
              className="ux4g-topbar__iconbtn ux4g-d-flex ux4g-jc-center ux4g-ai-center"
              onClick={() => changeSize("sm")}
              aria-label="Decrease text size"
              aria-pressed={size === "sm"}
            >
              <span className="ux4g-icon-outlined ux4g-top-bar-icon" aria-hidden="true">text_decrease</span>
            </button>
            <button
              type="button"
              className="ux4g-topbar__iconbtn ux4g-d-flex ux4g-jc-center ux4g-ai-center"
              onClick={() => changeSize("md")}
              aria-label="Reset text size"
              aria-pressed={size === "md"}
            >
              <span className="ux4g-icon-outlined ux4g-top-bar-icon" aria-hidden="true">font_download</span>
            </button>
            <button
              type="button"
              className="ux4g-topbar__iconbtn ux4g-d-flex ux4g-jc-center ux4g-ai-center"
              onClick={() => changeSize("lg")}
              aria-label="Increase text size"
              aria-pressed={size === "lg"}
            >
              <span className="ux4g-icon-outlined ux4g-top-bar-icon" aria-hidden="true">text_increase</span>
            </button>
          </div>
          <span className="ux4g-bl-1 acc-top-divider" />
          <button
            type="button"
            onClick={toggleTheme}
            className="ux4g-topbar__iconbtn ux4g-d-flex ux4g-jc-center ux4g-ai-center"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            title={dark ? "Use light theme" : "Use dark theme"}
          >
            <span className="ux4g-icon-outlined ux4g-top-bar-icon" aria-hidden="true">
              {dark ? "light_mode" : "dark_mode"}
            </span>
          </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
