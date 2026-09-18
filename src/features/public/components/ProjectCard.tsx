import { SOCIAL_ICONS } from "@/src/common/icons";
import { Project } from "@/src/features/public/projects/types";
import { cln } from "@/src/utils/cln";
import { stringToKey } from "@/src/utils/string";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface ProjectProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectProps) => {
  const { page } = project;
  const publishedAt = page?.publishedAt ?? page?.createdAt ?? page?.updatedAt;
  return (
    <article className="flex flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-foreground/35">
          <span>Project / {publishedAt ? new Date(publishedAt).getFullYear() : "Recent"}</span>
          <ArrowUpRight className="size-4 text-foreground/25" />
        </div>
        <h2 className="text-2xl font-bold leading-tight">
          <Link
            href={`/projects/${page?.slug}`}
            className="text-foreground transition-colors hover:text-primary"
          >
            {page?.title || project.title}
          </Link>
        </h2>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-foreground/55">
          {page?.excerpt?.replace(/[#*`]/g, "").substring(0, 180) ||
            project.description ||
            "A project built for the web."}
        </p>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.links?.map((link) => {
            const iconKey = stringToKey(link.label);
            const Icon = SOCIAL_ICONS[iconKey];
            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                className={cln(
                  "flex size-8 items-center justify-center border border-border p-1.5 text-foreground/60 transition-colors",
                  "hover:border-primary hover:bg-primary hover:text-white"
                )}
              >
                {Icon ? (
                  <Icon className="size-4" />
                ) : (
                  <span className="text-[10px] font-bold">
                    {link.label.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
};
