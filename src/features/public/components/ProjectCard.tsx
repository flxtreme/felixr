import { SOCIAL_ICONS } from "@/src/common/icons";
import { Project } from "@/src/features/public/projects/types";
import { cln } from "@/src/utils/cln";
import { stringToKey } from "@/src/utils/string";
import { PostCard } from "@/src/components/PostCard";
import { formatShortDate } from "@/src/utils/date";

export interface ProjectProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectProps) => {
  const { page } = project;
  const publishedAt = page?.publishedAt ?? page?.createdAt ?? page?.updatedAt;
  return (
    <PostCard
      href={`/projects/${page?.slug}`}
      title={page?.title || project.title}
      excerpt={
        page?.excerpt?.replace(/[#*`]/g, "").substring(0, 180) ||
        project.description ||
        "A project built for the web."
      }
      dateLabel={`Project / ${formatShortDate(publishedAt) || "Recent"}`}
      footer={
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
      }
    />
  );
};
