"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { toast } from "sonner";

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

  useEffect(() => {
    applySize(size);
  }, [size]);

  function changeSize(next: Size) {
    window.localStorage.setItem("sahaj-text-size", next);
    applySize(next);
    emit();
  }

  return (
    <div className="bg-navy text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href="#main-content"
            className="rounded-sm underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Skip to Main Content
          </a>
          <Link
            href="/instructions#accessibility"
            className="rounded-sm underline-offset-2 hover:underline"
          >
            Screen Reader Access
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" role="group" aria-label="Text size">
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-[11px] hover:bg-white/10"
              onClick={() => changeSize("lg")}
              aria-pressed={size === "lg"}
            >
              A+
            </button>
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-sm font-semibold hover:bg-white/10"
              onClick={() => changeSize("md")}
              aria-pressed={size === "md"}
            >
              A
            </button>
            <button
              type="button"
              className="rounded px-1.5 py-0.5 text-[11px] hover:bg-white/10"
              onClick={() => changeSize("sm")}
              aria-pressed={size === "sm"}
            >
              A-
            </button>
          </div>
          <label className="flex items-center gap-1.5">
            <span className="sr-only">Language</span>
            <select
              className="h-7 rounded border border-white/25 bg-navy px-1.5 text-xs text-primary-foreground"
              defaultValue="en"
              onChange={(e) => {
                if (e.target.value !== "en") {
                  e.target.value = "en";
                  toast.message("This prototype is English-only for the demo.");
                }
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
