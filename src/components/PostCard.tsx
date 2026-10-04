import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cln } from "@/src/utils/cln";

type PostCardProps = {
  href: string;
  title: string;
  excerpt: string;
  dateLabel?: string;
  views?: number;
  ordinal?: string;
  variant?: "featured" | "list" | "compact";
  excerptSize?: "base" | "sm";
  footer?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function PostCard({
  href,
  title,
  excerpt,
  dateLabel,
  views,
  ordinal,
  variant = "list",
  excerptSize = "base",
  footer,
  className,
  style,
}: PostCardProps) {
  if (variant === "featured") {
    return (
      <Link
        href={href}
        className={cln(
          "group flex min-h-56 flex-col justify-between border border-border p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 reveal-up",
          className
        )}
        style={style}
      >
        <div>
          <div className="mb-8 flex items-center justify-between">
            <span className="font-mono text-sm text-foreground/35">{ordinal}</span>
            <ArrowUpRight className="size-4 text-foreground/25 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <h3 className="text-xl font-bold transition-colors group-hover:text-primary">{title}</h3>
          <p className={cln("mt-2 leading-6 text-foreground/50", excerptSize === "sm" ? "text-sm" : "text-base")}>
            {excerpt}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between font-mono text-sm text-foreground/35">
          <span>{dateLabel || "Recent"}</span>
          {views !== undefined && <span>{views} views</span>}
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={href} className={cln("group block py-5 first:pt-4", className)}>
        <div className="flex items-start justify-between gap-6">
          <div>
            {(dateLabel || views !== undefined) && (
              <p className="mb-2 font-mono text-sm uppercase tracking-widest text-foreground/35">
                {dateLabel}
                {views !== undefined && ` / ${views} views`}
              </p>
            )}
            <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
            <p className={cln("mt-1 leading-6 text-foreground/50", excerptSize === "sm" ? "text-sm" : "text-base")}>
              {excerpt}
            </p>
          </div>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-foreground/25 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </Link>
    );
  }

  return (
    <article className={cln("group px-5 py-8 first:pt-6", className)}>
      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
        {dateLabel && <time>{dateLabel}</time>}
        {views !== undefined && <span>/ {views} views</span>}
      </div>
      <h2 className="mt-3 text-2xl font-bold leading-tight transition-colors group-hover:text-primary">
        <Link href={href}>{title}</Link>
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground/55">{excerpt}</p>
      {footer && <div className="mt-8">{footer}</div>}
    </article>
  );
}
