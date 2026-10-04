"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SOCIAL_ICONS } from "@/src/common/icons";
import { cln } from "@/src/utils/cln";

type LinkItem = {
  label: string;
  href: string;
};

// const primaryLinks = [
//   { label: "Shop", href: "/shop" },
//   { label: "Resources", href: "/blog" },
// ];

const portfolioLinks: LinkItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Stack", href: "/stack" },
  { label: "Certifications", href: "/certifications" },
  { label: "Trainings", href: "/trainings" },
];

const additionalLinks: LinkItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Gigs", href: "/gigs" },
  { label: "Blog", href: "/blog" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/flxtreme" },
  { label: "LinkedIn", href: "https://linkedin.com/in/flxrzjr" },
  { label: "X", href: "https://x.com/flxtremee" },
];

export function NavigationSidebar({ mobileOpen = false, onMobileNavigate }: {
  mobileOpen?: boolean;
  onMobileNavigate?: () => void;
} = {}) {
  const pathname = usePathname();

  const renderLink = ({ label, href }: LinkItem) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return (
      <Link
        key={label}
        href={href}
        onClick={onMobileNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`flex min-h-8 items-center justify-start gap-3 text-sm underline underline-offset-3 transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/65"}`}
      >
        <span className="lowercase">{label}</span>
        {isActive && <ArrowLeft aria-hidden="true" className="size-4 shrink-0" />}
      </Link>
    );
  };

  return (
    <aside
      id="mobile-navigation"
      className={cln(
        "fixed bg-transparent inset-x-4 top-[4.75rem] z-40 flex w-auto flex-col gap-10 overflow-hidden border-r border-dashed border-foreground/10 px-0 pt-4 pb-6 transition-[max-height,opacity,transform,visibility] duration-300 ease-out xl:inset-x-auto xl:inset-y-0 xl:left-0 xl:right-auto xl:flex xl:h-screen xl:w-72 xl:overflow-y-auto xl:max-h-none xl:visible xl:translate-y-0 xl:opacity-100 xl:pointer-events-auto xl:pt-10 xl:pb-24 xl:bg-transparent",
        mobileOpen
          ? "visible max-h-[calc(100dvh-5.5rem)] translate-y-0 overflow-y-auto rounded-b-2xl border border-t-0 border-solid border-foreground/10 bg-background/80 opacity-100 shadow-lg backdrop-blur-md xl:top-0 xl:rounded-none xl:border-r xl:border-t xl:border-foreground/10 xl:bg-transparent xl:shadow-none xl:backdrop-blur-none"
          : "invisible max-h-0 -translate-y-2 border-transparent bg-transparent opacity-0 shadow-none xl:top-0 xl:rounded-none xl:border-r xl:border-t xl:border-foreground/10 xl:bg-transparent xl:shadow-none xl:backdrop-blur-none"
      )}
    >
      <div className="hidden items-center justify-between gap-3 xl:flex px-6 xl:px-8">
        <Link href="/" className="text-lg font-bold text-primary">
          felixr
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex flex-col w-full">
        {/* <div className="grid grid-cols-2 gap-1 lg:grid-cols-1">
          {primaryLinks.map(renderLink)}
        </div>
        <div className="border-t border-border" /> */}
        <div className="gap-1 px-6 xl:px-8">
          {portfolioLinks.map(renderLink)}
        </div>
        <div aria-hidden="true" className="my-6 border-t border-foreground/10 w-full" />
        <div className="gap-1 px-6 xl:px-8">
          {additionalLinks.map(renderLink)}
        </div>
      </nav>
      <div className="flex-1"></div>
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex flex-col items-start gap-1 px-6">
          {socialLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={onMobileNavigate}
              className="min-h-8 inline-flex items-center gap-3 text-sm text-foreground/50 underline underline-offset-3 transition-colors hover:text-primary lowercase"
            >
              {(() => {
                const Icon = SOCIAL_ICONS[label.toLowerCase()];
                return Icon ? <Icon className="size-4" aria-hidden="true" /> : null;
              })()}
              {label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
