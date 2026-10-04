import Link from "next/link";
import { File, Folder } from "lucide-react";
import { cln } from "@/src/utils/cln";

export type PageDirectoryItem = {
  label: string;
  href: string;
  kind: "folder" | "file";
  children?: PageDirectoryItem[];
};

function DirectoryItems({ items, depth = 0 }: { items: PageDirectoryItem[]; depth?: number }) {
  return (
    <ul className={cln("space-y-1", depth > 0 && "ml-2 border-l border-foreground/10 pl-3")}>
      {items.map((item) => {
        const Icon = item.kind === "folder" ? Folder : File;

        return (
          <li
            key={`${item.href}-${item.label}`}
            className={cln(
              "relative",
              depth > 0 && "before:absolute before:-left-3 before:top-4 before:w-3 before:border-t before:border-foreground/10",
            )}
          >
            <Link
              href={item.href}
              onClick={(event) => {
                const targetUrl = new URL(item.href, window.location.href);
                if (!targetUrl.hash) return;

                const targetId = decodeURIComponent(targetUrl.hash.slice(1));
                const target = document.getElementById(targetId);
                if (!target) return;

                event.preventDefault();
                window.history.replaceState(
                  null,
                  "",
                  `${targetUrl.pathname}${targetUrl.hash}`,
                );
                target.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                  block: "start",
                });
              }}
              className="flex min-h-8 min-w-0 items-center gap-2 text-sm text-foreground/65 transition-colors hover:text-primary"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
            {item.children && item.children.length > 0 && (
              <DirectoryItems items={item.children} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function PageDirectory({ items }: { items: PageDirectoryItem[] }) {
  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground/45">
        Scroll to
      </h2>
      <nav aria-label="Page directory">
        <DirectoryItems items={items} />
      </nav>
    </div>
  );
}
