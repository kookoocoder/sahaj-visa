import Link from "next/link";
import {
  CloudUpload,
  CreditCard,
  FileSearch,
  IdCard,
  Monitor,
  PencilLine,
  Printer,
} from "lucide-react";
import { QUICK_ACTIONS } from "@/lib/nav";
import { cn } from "@/lib/utils";

const ICONS = [FileSearch, Monitor, PencilLine, CreditCard, Printer, IdCard, CloudUpload];

export function QuickActions({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7", className)}>
      {QUICK_ACTIONS.map((action, i) => {
        const Icon = ICONS[i] ?? Monitor;
        return (
          <li key={`${action.label}-${i}`}>
            <Link
              href={action.href}
              className="portal-shadow-hover flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-center"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-info text-primary">
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="text-xs font-medium leading-snug text-foreground sm:text-sm">{action.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
