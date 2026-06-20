import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaReact,
  FaJs,
  FaGlobe,
  FaNpm,
  FaHtml5,
  FaCss3,
  FaNodeJs,
  FaGit,
  FaLink,
  FaAngular,
  FaFlutter,
  FaGitlab,
  FaJira,
  FaFigma,
  FaWordpress,
} from "react-icons/fa6";
import {
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiVite,
  SiNestjs,
  SiFastify,
  SiExpress,
  SiPostgresql,
  SiDrizzle,
  SiPrisma,
  SiGooglebigquery,
  SiGooglecloud,
  SiFirebase,
  SiPostman,
  SiClaude,
  SiGithubcopilot,
} from "react-icons/si";
import { Cable, FileCode2, Workflow, Cpu, Sparkles, Wand2 } from "lucide-react";

export const SOCIAL_ICONS: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  react: FaReact,
  javascript: FaJs,
  live: FaGlobe,
  demo: FaGlobe,
  npm: FaNpm,
  html: FaHtml5,
  css: FaCss3,
  tailwind: SiTailwindcss,
  typescript: SiTypescript,
  nextjs: SiNextdotjs,
  nodejs: FaNodeJs,
  git: FaGit,
  link: FaLink,

  // Frontend
  vite: SiVite,
  angular: FaAngular,
  flutter: FaFlutter,

  // Backend
  nestjs: SiNestjs,
  fastify: SiFastify,
  express: SiExpress,
  postgresql: SiPostgresql,
  drizzle: SiDrizzle,
  prisma: SiPrisma,
  bigquery: SiGooglebigquery,
  rest: Cable,
  soap: FileCode2,

  // Cloud & DevOps
  googlecloud: SiGooglecloud,
  cloudfirestore: SiFirebase,
  pubsub: Workflow,
  gitlab: FaGitlab,
  cicd: Workflow,

  // AI & Agentic Tools
  claude: SiClaude,
  cursor: Cpu,
  gemini: Sparkles,
  githubcopilot: SiGithubcopilot,
  antigravity: Sparkles,
  vibecoding: Wand2,

  // Tools & Design
  jira: FaJira,
  postman: SiPostman,
  figma: FaFigma,

  wordpress: FaWordpress
};