import type { ExperienceItem } from "@/src/features/public/experience/data";
import { formatShortDate } from "@/src/utils/date";
import { cln } from "@/src/utils/cln";

const formatExperienceDate = (value: string) =>
  /^\d{4}$/.test(value.trim()) ? value : formatShortDate(value) || value;

type ExperienceCardProps = ExperienceItem & { id?: string; showResponsibilities?: boolean };

export function ExperienceCard({
  id,
  role,
  company,
  start,
  end,
  responsibilities,
  showResponsibilities = true,
}: ExperienceCardProps) {
  return (
    <article id={id} className={cln("grid gap-3 border-t border-foreground/10 py-6 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8")}>
      <div>
        <h3 className={cln("text-base font-semibold text-foreground")}>{role}</h3>
        <p className={cln("mt-1 text-sm text-foreground/55")}>{company}</p>
      </div>
      <time className={cln("text-sm text-foreground/45 sm:text-right")}>
        {formatExperienceDate(start)} &ndash; {formatExperienceDate(end)}
      </time>
      {showResponsibilities && (
        <ul className={cln("list-disc space-y-1 pl-5 text-sm leading-6 text-foreground/65 sm:col-span-2")}>
          {responsibilities.map((responsibility) => (
            <li key={responsibility}>{responsibility}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
