import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import type { Training } from "@/src/features/public/trainings/types";
import { cln } from "@/src/utils/cln";
import { formatShortDate } from "@/src/utils/date";

export function TrainingCard({ training, actions }: { training: Training; actions?: ReactNode }) {
  return (
    <li id={training.id} className={cln("mb-6 break-inside-avoid")}>
      <article className={cln("border border-foreground/10")}>
        <div className={cln("flex min-h-36 items-center justify-between border-b border-foreground/10 bg-foreground/[0.03] p-5")}>
          <GraduationCap aria-hidden="true" className={cln("size-12 text-primary/75")} strokeWidth={1.25} />
          {actions}
        </div>
        <div className={cln("p-4")}>
          <p className={cln("font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45")}>
            {training.provider}
          </p>
          <h2 className={cln("mt-2 text-sm font-bold leading-tight text-foreground/75")}>
            {training.title}
          </h2>
          <p className={cln("mt-2 text-xs leading-5 text-foreground/55")}>
            {training.description}
          </p>
          <dl className={cln("mt-4 space-y-2 border-t border-foreground/10 pt-3 text-xs")}>
            <div className={cln("flex items-center justify-between gap-3")}>
              <dt className={cln("text-foreground/40")}>Completed</dt>
              <dd className={cln("font-mono text-foreground/65")}>
                {formatShortDate(training.completedAt) || training.completedAt}
              </dd>
            </div>
          </dl>
        </div>
      </article>
    </li>
  );
}
import type { ReactNode } from "react";
