"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { SOCIAL_ICONS } from "@/src/common/icons";

type Tech = {
  label: string;
  key: string;
  color: string;
  level: number;
};

// Colors use hex brand colors where the mark has one. Icons that are
// natively black/white (Next.js, Express, Prisma, Cursor, Copilot) fall
// back to "var(--foreground)" so they adapt to light/dark theme.
const techStack: Tech[] = [
  // Frontend
  { label: "React", key: "react", color: "#61DAFB", level: 90 },
  { label: "Next.js", key: "nextjs", color: "var(--foreground)", level: 90 },
  { label: "Tailwind", key: "tailwind", color: "#38BDF8", level: 95 },
  { label: "Vite", key: "vite", color: "#A855F7", level: 90 },
  { label: "Angular", key: "angular", color: "#DD0031", level: 85 },
  { label: "Flutter", key: "flutter", color: "#02569B", level: 85 },
  // Backend
  { label: "Node.js", key: "nodejs", color: "#5FA04E", level: 95 },
  { label: "NestJS", key: "nestjs", color: "#E0234E", level: 90 },
  { label: "Fastify", key: "fastify", color: "var(--foreground)", level: 90 },
  { label: "Express", key: "express", color: "var(--foreground)", level: 90 },
  { label: "PostgreSQL", key: "postgresql", color: "#4169E1", level: 80 },
  { label: "Drizzle", key: "drizzle", color: "#C5F74F", level: 75 },
  { label: "Prisma", key: "prisma", color: "var(--foreground)", level: 80 },
  { label: "BigQuery", key: "bigquery", color: "#669DF6", level: 90 },
  { label: "REST", key: "rest", color: "#F97316", level: 95 },
  { label: "SOAP", key: "soap", color: "#3B82F6", level: 50 },
  // Cloud & DevOps
  { label: "Google Cloud", key: "googlecloud", color: "#4285F4", level: 80 },
  { label: "Cloud Firestore", key: "cloudfirestore", color: "#FFCA28", level: 80 },
  { label: "Pub/Sub", key: "pubsub", color: "#4285F4", level: 80 },
  { label: "Git", key: "git", color: "#F05032", level: 85 },
  { label: "GitLab", key: "gitlab", color: "#FC6D26", level: 85 },
  { label: "CI/CD", key: "cicd", color: "#22C55E", level: 70 },
  // AI & Agentic Tools
  { label: "Claude", key: "claude", color: "#D97757", level: 90 },
  { label: "Cursor", key: "cursor", color: "var(--foreground)", level: 90 },
  { label: "Gemini", key: "gemini", color: "#8E75F1", level: 90 },
  { label: "GitHub Copilot", key: "githubcopilot", color: "var(--foreground)", level: 90 },
  { label: "Antigravity", key: "antigravity", color: "#4285F4", level: 90 },
  { label: "Vibe Coding", key: "vibecoding", color: "#EC4899", level: 95 },
  // Tools & Design
  { label: "Jira", key: "jira", color: "#0052CC", level: 80 },
  { label: "Postman", key: "postman", color: "#FF6C37", level: 85 },
  { label: "Figma", key: "figma", color: "#F24E1E", level: 85 },
  { label: "Wordpress", key: "wordpress", color: "#21759b", level: 90 },
];

const levelLabel = (level: number) => {
  if (level >= 90) return "Expert";
  if (level >= 75) return "Proficient";
  if (level >= 55) return "Intermediate";
  return "Familiar";
};

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularProgress({ level, color }: { level: number; color: string }) {
  const offset = CIRCUMFERENCE - (level / 100) * CIRCUMFERENCE;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" className="-rotate-90">
      <circle
        cx={32}
        cy={32}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        className="text-foreground/10"
      />
      <circle
        cx={32}
        cy={32}
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function TechItem({ tech }: { tech: Tech }) {
  const Icon = SOCIAL_ICONS[tech.key];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center gap-2 shrink-0 w-16"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-8 h-8 flex items-center justify-center">
        {/* Icon */}
        <Icon
          className={`w-8 h-8 absolute transition-all duration-200 ${hovered ? "opacity-0 scale-75" : "opacity-60 scale-100"
            }`}
          style={{ color: tech.color }}
        />
        {/* Circular progress (on hover) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
            }`}
        >
          <CircularProgress level={tech.level} color={tech.color} />
          <span className="absolute text-[10px] font-medium text-foreground">{tech.level}%</span>
        </div>
      </div>

      <span className="relative h-3.5 flex items-center justify-center">
        <span
          className={`absolute text-[11px] font-medium text-center leading-tight whitespace-nowrap text-foreground/60 transition-opacity duration-200 ${hovered ? "opacity-0" : "opacity-100"
            }`}
        >
          {tech.label}
        </span>
        <span
          className={`absolute text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"
            }`}
          style={{ color: tech.color }}
        >
          {levelLabel(tech.level)}
        </span>
      </span>
    </div>
  );
}

export const TechStackMarquee = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start", containScroll: false, skipSnaps: true },
    [AutoScroll({ speed: 0.6, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // Resync once mounted (helps when icon-loaded widths shift slightly post-hydration).
  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-visible">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-8 px-12 py-2">
          {techStack.map((tech, idx) => (
            <TechItem key={`${tech.key}-${idx}`} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackMarquee;