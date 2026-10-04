import type { Certification } from "@/src/features/public/certifications/types";
import { cln } from "@/src/utils/cln";
import { formatShortDate } from "@/src/utils/date";

export function CertificationRow({ certification }: { certification: Certification }) {
  return (
    <article className={cln("grid gap-3 border-t border-foreground/10 py-6 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8")}>
      <div>
        <h3 className={cln("text-base font-semibold text-foreground")}>{certification.title}</h3>
        <p className={cln("mt-1 text-sm text-foreground/55")}>{certification.issuer}</p>
      </div>
      <time className={cln("text-sm text-foreground/45 sm:text-right")}>
        {formatShortDate(certification.issuedAt) || certification.issuedAt}
      </time>
    </article>
  );
}
