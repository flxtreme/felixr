import type { ReactNode } from "react";
import { cln } from "@/src/utils/cln";

export function AdminPageHeader({
  title,
  description,
  actions,
  className,
  children,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cln("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="space-y-1 max-w-3xl mx-auto w-full">
        <div className="flex items-end justify-between pt-10 pb-6">
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold lowercase">{title}</h1>
            {description && <p className="text-sm font-mono text-foreground/45">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        {children}
      </div>
    </header>
  );
}
