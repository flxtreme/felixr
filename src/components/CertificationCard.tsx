import type { ReactNode } from "react";
import { Award, ArrowUpRight } from "lucide-react";
import type { Certification } from "@/src/features/public/certifications/types";
import { cln } from "@/src/utils/cln";
import { formatShortDate } from "@/src/utils/date";

export function CertificationCard({ certification, actions }: { certification: Certification; actions?: ReactNode }) {
  return (
    <li id={certification.id} className="mb-6 break-inside-avoid">
      <article className="border border-foreground/10">
        <div className={cln("flex min-h-36 items-center justify-between border-b border-foreground/10 bg-foreground/[0.03] p-5")}>
          <Award aria-hidden="true" className="size-12 text-primary/75" strokeWidth={1.25} />
          {actions}
        </div>
        <div className={cln("p-4")}>
          <p className={cln("font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45")}>
            {certification.issuer}
          </p>
          <h2 className={cln("mt-2 text-sm font-bold leading-tight text-foreground/75")}>
            {certification.title}
          </h2>
          <p className={cln("mt-2 text-xs leading-5 text-foreground/55")}>
            {certification.description}
          </p>
          <dl className={cln("mt-4 space-y-2 border-t border-foreground/10 pt-3 text-xs")}>
            <div className="flex items-center justify-between gap-3">
              <dt className={cln("text-foreground/40")}>Issued</dt>
              <dd className={cln("font-mono text-foreground/65")}>
                {formatShortDate(certification.issuedAt) || certification.issuedAt}
              </dd>
            </div>
            {certification.credentialId && (
              <div className="flex items-center justify-between gap-3">
                <dt className={cln("text-foreground/40")}>Credential ID</dt>
                <dd className={cln("font-mono text-foreground/65")}>{certification.credentialId}</dd>
              </div>
            )}
          </dl>
          {certification.credentialUrl && (
            <a
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cln(
                "mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary transition-[gap] hover:gap-3",
              )}
            >
              View credential <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </article>
    </li>
  );
}
