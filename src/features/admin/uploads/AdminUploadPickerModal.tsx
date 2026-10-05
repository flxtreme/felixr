"use client";

import { useEffect, useState } from "react";
import { FileText, Folder } from "lucide-react";
import { Modal, useModal } from "flxtheme";
import { cln } from "@/src/utils/cln";
import { useAdminUploads } from "@/src/features/admin/uploads/hooks";
import type { AdminUpload } from "@/src/features/admin/uploads/types";

const PAGE_SIZE = 100;
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "avif", "svg", "bmp", "tif", "tiff"]);

function isImage(upload: AdminUpload) {
  return IMAGE_EXTENSIONS.has(upload.name.split(".").pop()?.toLowerCase() ?? "");
}

export function AdminUploadPickerModal({
  id,
  title,
  imageOnly = false,
  onSelect,
}: {
  id: string;
  title: string;
  imageOnly?: boolean;
  onSelect: (upload: AdminUpload) => void;
}) {
  const { closeModal } = useModal();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const { uploads, isLoading, error } = useAdminUploads({ offset: 0, limit: PAGE_SIZE, search: query || undefined });

  useEffect(() => {
    const timeout = window.setTimeout(() => setQuery(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const filteredUploads = imageOnly ? uploads.filter(isImage) : uploads;

  return <Modal id={id} title={title} size="lg" onClose={() => closeModal(id)}>
    <div className="space-y-4">
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={imageOnly ? "Search image files..." : "Search all files..."}
        aria-label="Search uploaded files"
        className={cln("w-full border border-foreground/15 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-primary")}
      />
      {isLoading ? <p className="py-10 text-center text-sm text-foreground/50">Loading files...</p>
        : error ? <p role="alert" className="py-10 text-center text-sm text-red-500">Files couldn&apos;t be loaded.</p>
          : filteredUploads.length === 0 ? <p className="py-10 text-center text-sm text-foreground/50">No matching files found.</p>
            : <ul className={cln("grid max-h-[min(60vh,32rem)] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3")}>
              {filteredUploads.map((upload) => <li key={upload.id}>
                <button
                  type="button"
                  onClick={() => { onSelect(upload); closeModal(id); }}
                  className={cln("group flex h-full w-full flex-col border border-foreground/10 text-left transition-colors hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary")}
                >
                  {isImage(upload)
                    ? <img src={upload.publicPath} alt="" loading="lazy" className="aspect-[4/3] w-full bg-foreground/5 object-cover" />
                    : <span className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-foreground/5 text-foreground/35">
                      {upload.bucket === "files" ? <Folder aria-hidden="true" className="size-9" /> : <FileText aria-hidden="true" className="size-9" />}
                      <span className="font-mono text-[10px] uppercase tracking-widest">{upload.name.split(".").pop()}</span>
                    </span>}
                  <span className="w-full space-y-1 p-2">
                    <span className="block truncate text-xs font-semibold text-foreground/75" title={upload.name}>{upload.name}</span>
                    <span className="block truncate font-mono text-[10px] uppercase text-foreground/40">{upload.bucket}</span>
                  </span>
                </button>
              </li>)}
            </ul>}
    </div>
  </Modal>;
}
