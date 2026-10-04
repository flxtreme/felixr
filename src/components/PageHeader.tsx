import type { ReactNode } from "react";
import { cln } from "@/src/utils/cln";

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  titleSize?: "sm" | "2xl";
  before?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, titleSize = "sm", before, aside, children }: PageHeaderProps) {
  return (
    <section>
      <div
        className={cln(
          "mx-auto grid max-w-3xl items-center gap-8 px-6 pb-10 pt-20",
          aside && "lg:grid-cols-[1fr_22rem] lg:gap-16"
        )}
      >
        <div>
          {before}
          {eyebrow && (
            <div className={cln("text-2xl font-semibold leading-tight text-foreground", before && "mt-5")}>
              {eyebrow}
            </div>
          )}
          {title && (
            <h1
              className={cln(
                "max-w-3xl font-mono",
                titleSize === "2xl"
                  ? "text-2xl font-bold leading-8 text-foreground"
                  : "text-sm font-normal leading-6 text-foreground/45",
                eyebrow && "mt-1"
              )}
              style={{ fontFamily: "var(--font-fira-code), monospace" }}
            >
              {title}
            </h1>
          )}
          {children && <div className={cln((eyebrow || title || before) && "mt-4")}>{children}</div>}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  );
}