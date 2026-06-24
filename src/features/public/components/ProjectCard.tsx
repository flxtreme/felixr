import { SOCIAL_ICONS } from "@/src/common/icons";
import { Project } from "@/src/features/public/projects/types";
import { cln } from "@/src/utils/cln";
import { stringToKey } from "@/src/utils/string";
import Link from "next/link";

export interface ProjectProps {
  project: Project;
  noCard?: boolean;
}

export const ProjectCard = ({ project, noCard = false }: ProjectProps) => {
  const { page } = project;
  const publishedAt =
    page?.publishedAt ?? page?.createdAt ?? page?.updatedAt;
  return (
    <div
      className={cln("group relative flex flex-col transition-all", noCard ? "" : "border-l-6 border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 overflow-hidden")}
    >
      <div className={cln("flex flex-col gap-1.5", noCard ? "" : "px-5 py-4")}>
        <Link
          href={`/projects/${page?.slug}`}
          className="before:absolute before:inset-0 text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
        >
          {page?.title}
        </Link>
        <p className="text-sm text-foreground/55 leading-relaxed line-clamp-2">
          {page?.excerpt &&
            page.excerpt.replace(/[#*`]/g, "").substring(0, 160)}...
        </p>

        <div className="flex items-center gap-2 text-xs font-medium text-foreground/35 font-mono mt-0.5">
          <span>
            {publishedAt
              ? new Date(publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
              : "—"}
          </span>
          {page?.views !== undefined && (
            <>
              <span>&bull;</span>
              <span>{page.views} views</span>
            </>
          )}
        </div>

        {project.links && project.links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-1.5 relative z-10">
            {project.links.map((link) => {
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
                    "size-8 p-1.5 rounded-md flex items-center justify-center transition-colors",
                    "bg-foreground/5 text-foreground/60 border border-foreground/20 shadow-sm",
                    "hover:bg-primary hover:text-white hover:border-primary"
                  )}
                >
                  {Icon ? (
                    <Icon className="size-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{link.label.substring(0, 2).toUpperCase()}</span>
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}