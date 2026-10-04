"use client";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { SOCIAL_ICONS } from "@/src/common/icons";
import useStacks from "@/src/features/public/stack/hooks/useStacks";
import type { Stack } from "@/src/features/public/stack/types";
import { cln } from "@/src/utils/cln";

function TechItem({ tech }: { tech: Stack }) {
  const Icon = SOCIAL_ICONS[tech.key];

  return (
    <div className={cln("relative flex w-32 shrink-0 flex-col items-center gap-3")}>
      <div className={cln("relative flex h-10 w-10 items-center justify-center")}>
        {Icon && <Icon className={cln("h-10 w-10 opacity-60")} style={{ color: tech.color }} />}
      </div>

      <span className={cln("flex min-h-10 items-center justify-center px-1 text-center text-[13px] font-medium leading-tight text-foreground/60")}>
        {tech.label}
      </span>
    </div>
  );
}

export const TechStackMarquee = () => {
  const { stacks, error, isLoading } = useStacks({ limit: 100, offset: 0 });
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start", containScroll: false, skipSnaps: true },
    [AutoScroll({ speed: 0.6, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Resync once mounted (helps when icon-loaded widths shift slightly post-hydration).
  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, stacks]);

  if (isLoading) {
    return <p className={cln("px-6 py-8 text-center text-sm text-foreground/50")}>Loading tools and practices…</p>;
  }

  if (error) {
    return <p className={cln("px-6 py-8 text-center text-sm text-foreground/50")}>Could not load tools and practices.</p>;
  }

  if (stacks.length === 0) {
    return <p className={cln("px-6 py-8 text-center text-sm text-foreground/50")}>No tools and practices yet.</p>;
  }

  return (
    <div className="relative w-full overflow-visible">
      <div className={cln("overflow-hidden cursor-grab active:cursor-grabbing")} ref={emblaRef}>
        <div className={cln("flex gap-10 px-16 py-4")}>
          {stacks.map((tech) => (
            <TechItem key={tech.id} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackMarquee;
