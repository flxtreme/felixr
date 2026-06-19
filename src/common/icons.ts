import React from "react";
import { FaGithub, FaLinkedin, FaXTwitter, FaReact, FaJs, FaGlobe, FaNpm, FaHtml5, FaCss3, FaNodeJs, FaGit, FaLink } from "react-icons/fa6";
import { SiTailwindcss, SiTypescript, SiNextdotjs } from "react-icons/si";

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
  link: FaLink
};
