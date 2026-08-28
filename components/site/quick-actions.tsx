import Link from "next/link";
import { QUICK_ACTIONS } from "@/lib/nav";
import { Icon } from "@/components/site/icon";
import { cn } from "@/lib/utils";

const ICONS = ["draw", "history", "policy"];

export function QuickActions({ className }: { className?: string }) {
  return (
    <ul className={cn("ux4g-grid ux4g-grid-auto-fit-250", className)}>
      {QUICK_ACTIONS.map((action, i) => (
        <li key={`${action.label}-${i}`}>
          <Link href={action.href} className="ux4g-card ux4g-card-outline ux4g-card-vertical ux4g-w-100">
            <div className="ux4g-card-body ux4g-d-flex ux4g-flex-column ux4g-ai-center ux4g-text-center">
              <Icon name={ICONS[i] ?? "open_in_new"} className="ux4g-fs-32 ux4g-text-primary" />
              <span className="ux4g-card-title ux4g-mt-xs">{action.label}</span>
              <span className="ux4g-card-sub-title">{action.description}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
