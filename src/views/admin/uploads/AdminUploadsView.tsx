"use client";

import { use, useEffect, useRef, useState, type FormEvent } from "react";
import { Modal, Pagination, useModal } from "flxtheme";
import { Search, Upload as UploadIcon, Image as ImageIcon, Copy, ExternalLink, FileArchive, FileCode, FileSpreadsheet, FileText, FileType, FileVideoCamera, Folder, Music2 } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminRowActions } from "@/src/features/admin/components/AdminRowActions";
import { editAdminUpload, removeAdminUpload, useAdminUploads, registerAdminUpload } from "@/src/features/admin/uploads/hooks";
import { getAdminUploadSignedUrl } from "@/src/features/admin/uploads/services";
import type { AdminUpload, CreateAdminUploadPayload, UpdateAdminUploadPayload } from "@/src/features/admin/uploads/types";

const PAGE_SIZE = 12;
const MODAL_ID = "admin-upload-register";
const EDIT_MODAL_ID = "admin-upload-edit";
const fieldClass = cln("w-full border border-foreground/15 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-primary");

function splitFilename(filename: string) {
  const dot = filename.lastIndexOf(".");
  if (dot <= 0) return { name: filename, type: "" };
  return { name: filename.slice(0, dot), type: filename.slice(dot + 1) };
}

function getFileType(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "avif", "svg", "bmp", "tif", "tiff"].includes(extension)) return { image: true, Icon: ImageIcon, label: "IMAGE" };
  if (extension === "pdf") return { image: false, Icon: FileType, label: "PDF" };
  if (["doc", "docx", "odt", "rtf"].includes(extension)) return { image: false, Icon: FileText, label: "DOC" };
  if (["xls", "xlsx", "csv", "ods"].includes(extension)) return { image: false, Icon: FileSpreadsheet, label: "SHEET" };
  if (["ppt", "pptx", "odp"].includes(extension)) return { image: false, Icon: FileText, label: "SLIDES" };
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) return { image: false, Icon: FileArchive, label: "ARCHIVE" };
  if (["mp3", "wav", "ogg", "m4a", "flac", "aac"].includes(extension)) return { image: false, Icon: Music2, label: "AUDIO" };
  if (["mp4", "mov", "webm", "avi", "mkv"].includes(extension)) return { image: false, Icon: FileVideoCamera, label: "VIDEO" };
  if (["js", "jsx", "ts", "tsx", "json", "html", "css", "py", "sh", "md"].includes(extension)) return { image: false, Icon: FileCode, label: "CODE" };
  return { image: false, Icon: Folder, label: "FILE" };
}

function UploadPreview({ src, name, alt }: { src: string; name: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const fileType = getFileType(name);
  if (!fileType.image || failed || !src) {
    const Icon = fileType.Icon;
    return <div role="img" aria-label={`${fileType.label} file: ${name}`} className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-foreground/5 text-foreground/30">
      <Icon aria-hidden="true" className="size-10" />
      <span className="font-mono text-[10px] font-bold tracking-[0.2em]">{fileType.label}</span>
    </div>;
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="block aspect-[4/3] w-full bg-foreground/5 object-cover" />;
}

function RegisterUploadForm({ onSaved }: { onSaved: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState("");
  const [alt, setAlt] = useState("");
  const [metadataFields, setMetadataFields] = useState([{ key: "", value: "" }]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const metadata = Object.fromEntries(
    metadataFields.filter(({ key }) => key.trim()).map(({ key, value }) => [key.trim(), value] as const),
  );

  const updateMetadataField = (index: number, key: "key" | "value", value: string) => {
    setMetadataFields((current) => current.map((field, fieldIndex) => fieldIndex === index ? { ...field, [key]: value } : field));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!file) { setError("Choose a file to upload."); return; }
    if (file.size > 20 * 1024 * 1024) { setError("Files must be 20 MiB or smaller."); return; }
    const keys = metadataFields.map(({ key }) => key.trim()).filter(Boolean);
    if (new Set(keys).size !== keys.length) { setError("Metadata keys must be unique."); return; }
    if (!name.trim()) { setError("Enter a file name."); return; }
    const filename = fileType ? `${name.trim()}.${fileType}` : name.trim();
    const payload: CreateAdminUploadPayload = { file, name: filename, ...(alt.trim() ? { alt: alt.trim() } : {}), ...(Object.keys(metadata).length ? { metadata } : {}) };
    setSaving(true);
    try {
      await registerAdminUpload(payload);
      setFile(null);
      setName("");
      setFileType("");
      setAlt("");
      setMetadataFields([{ key: "", value: "" }]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSaved();
    }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not register this upload."); }
    finally { setSaving(false); }
  };

  return <form onSubmit={submit} className="space-y-4">
    <p className="text-xs leading-5 text-foreground/50">Upload a file to storage and attach optional alternative text and metadata.</p>
    <label className="block space-y-1.5 text-xs text-foreground/60">File<input ref={fileInputRef} required type="file" onChange={(event) => { const selected = event.target.files?.[0] ?? null; setFile(selected); if (selected) { const parts = splitFilename(selected.name); setName(parts.name); setFileType(parts.type); } }} className={cln(fieldClass, "file:mr-3 file:border-0 file:bg-foreground/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground")} /><span className="block text-[10px] text-foreground/40">Maximum file size: 20 MiB.</span></label>
    {file && <p className="truncate text-xs text-foreground/50">Selected: {file.name}</p>}
    <div className="flex items-end gap-2">
      <label className="block min-w-0 flex-1 space-y-1.5 text-xs text-foreground/60">Name<input required value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></label>
      <input aria-label="File extension" readOnly value={fileType ? `.${fileType}` : "—"} className={cln(fieldClass, "w-24 shrink-0 cursor-not-allowed text-center opacity-60")} />
    </div>
    <label className="block space-y-1.5 text-xs text-foreground/60">Alt text<input value={alt} onChange={(event) => setAlt(event.target.value)} className={fieldClass} /></label>
    <fieldset className="space-y-2">
      <legend className="text-xs text-foreground/60">Metadata</legend>
      {metadataFields.map((field, index) => <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
        <input aria-label={`Metadata key ${index + 1}`} value={field.key} onChange={(event) => updateMetadataField(index, "key", event.target.value)} placeholder="Key" className={fieldClass} />
        <input aria-label={`Metadata value ${index + 1}`} value={field.value} onChange={(event) => updateMetadataField(index, "value", event.target.value)} placeholder="Value" className={fieldClass} />
        <AdminButton type="button" variant="ghost" aria-label={`Remove metadata row ${index + 1}`} disabled={metadataFields.length === 1} onClick={() => setMetadataFields((current) => current.filter((_, fieldIndex) => fieldIndex !== index))}>Remove</AdminButton>
      </div>)}
      <AdminButton type="button" variant="outline" onClick={() => setMetadataFields((current) => [...current, { key: "", value: "" }])}>Add field</AdminButton>
    </fieldset>
    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    <div className="flex justify-end"><AdminButton type="submit" variant="primary" loading={saving}>{saving ? "Registering..." : "Register upload"}</AdminButton></div>
  </form>;
}

function EditUploadForm({ upload, onSaved }: { upload: AdminUpload; onSaved: () => void }) {
  const initialFilename = splitFilename(upload.name);
  const [name, setName] = useState(initialFilename.name);
  const fileType = initialFilename.type;
  const [alt, setAlt] = useState(upload.alt ?? "");
  const [metadataFields, setMetadataFields] = useState(() => {
    if (upload.metadata && typeof upload.metadata === "object" && !Array.isArray(upload.metadata)) {
      const fields = Object.entries(upload.metadata).map(([key, value]) => ({ key, value: String(value ?? "") }));
      if (fields.length) return fields;
    }
    return [{ key: "", value: "" }];
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const metadata = Object.fromEntries(metadataFields.filter(({ key }) => key.trim()).map(({ key, value }) => [key.trim(), value] as const));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!name.trim()) { setError("Enter a file name."); return; }
    const keys = metadataFields.map(({ key }) => key.trim()).filter(Boolean);
    if (new Set(keys).size !== keys.length) { setError("Metadata keys must be unique."); return; }
    const filename = fileType ? `${name.trim()}.${fileType}` : name.trim();
    const payload: UpdateAdminUploadPayload = { name: filename, alt: alt.trim() || null, metadata };
    setSaving(true);
    try { await editAdminUpload(upload.id, payload); onSaved(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update this upload."); }
    finally { setSaving(false); }
  };

  return <form onSubmit={submit} className="space-y-4">
    <div className="flex items-end gap-2">
      <label className="block min-w-0 flex-1 space-y-1.5 text-xs text-foreground/60">Name<input required value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></label>
      <input aria-label="File extension" readOnly value={fileType ? `.${fileType}` : "—"} className={cln(fieldClass, "w-24 shrink-0 cursor-not-allowed text-center opacity-60")} />
    </div>
    <label className="block space-y-1.5 text-xs text-foreground/60">Alt text<input value={alt} onChange={(event) => setAlt(event.target.value)} className={fieldClass} /></label>
    <fieldset className="space-y-2">
      <legend className="text-xs text-foreground/60">Metadata</legend>
      {metadataFields.map((field, index) => <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
        <input aria-label={`Metadata key ${index + 1}`} value={field.key} onChange={(event) => setMetadataFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, key: event.target.value } : item))} placeholder="Key" className={fieldClass} />
        <input aria-label={`Metadata value ${index + 1}`} value={field.value} onChange={(event) => setMetadataFields((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder="Value" className={fieldClass} />
        <AdminButton type="button" variant="ghost" aria-label={`Remove metadata row ${index + 1}`} disabled={metadataFields.length === 1} onClick={() => setMetadataFields((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</AdminButton>
      </div>)}
      <AdminButton type="button" variant="outline" onClick={() => setMetadataFields((current) => [...current, { key: "", value: "" }])}>Add field</AdminButton>
    </fieldset>
    {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
    <div className="flex justify-end"><AdminButton type="submit" variant="primary" loading={saving}>{saving ? "Saving..." : "Save changes"}</AdminButton></div>
  </form>;
}

export default function AdminUploadsView({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const initial = use(searchParams);
  const [search, setSearch] = useState(initial.search ?? "");
  const [query, setQuery] = useState(initial.search?.trim() ?? "");
  const [page, setPage] = useState(1);
  const [copyMessage, setCopyMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [editingUpload, setEditingUpload] = useState<AdminUpload | null>(null);
  const { openModal, closeModal } = useModal();
  const { uploads, meta, isLoading, error } = useAdminUploads({ offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE, search: query || undefined });

  useEffect(() => {
    const timeout = window.setTimeout(() => setQuery(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const copyUrl = async (upload: AdminUpload) => {
    try {
      const url = new URL(`/sign/${encodeURIComponent(upload.id)}`, window.location.origin).toString();
      await navigator.clipboard.writeText(url);
      setCopyMessage("Copied stable download URL.");
    }
    catch { setCopyMessage("Could not create or copy the file URL."); }
    window.setTimeout(() => setCopyMessage(""), 1800);
  };

  const deleteUpload = async (upload: AdminUpload) => {
    setActionError("");
    try { await removeAdminUpload(upload.id); }
    catch (cause) { setActionError(cause instanceof Error ? cause.message : `Could not delete ${upload.name}.`); }
  };

  const openUpload = async (upload: AdminUpload) => {
    setActionError("");
    const tab = window.open("about:blank", "_blank");
    if (!tab) {
      setActionError("Allow pop-ups to open this file.");
      return;
    }
    tab.opener = null;
    try {
      const { url } = await getAdminUploadSignedUrl(upload.id);
      tab.location.href = url;
    } catch (cause) {
      tab.close();
      setActionError(cause instanceof Error ? cause.message : `Could not open ${upload.name}.`);
    }
  };

  return <div className="space-y-6 p-6">
    <AdminPageHeader title="uploads" description="Manage files stored in your media and files buckets." actions={<AdminButton onClick={() => openModal(MODAL_ID)} variant="primary"><UploadIcon aria-hidden="true" /><span>Upload</span></AdminButton>} />
    <div className="mx-auto flex w-full max-w-3xl items-center">
      <label className="relative min-w-0 flex-1">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
        <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search uploads..." aria-label="Search uploads" className="w-full border border-foreground/10 bg-transparent py-2 pl-9 pr-3 text-sm outline-none placeholder:text-foreground/40 focus:border-primary/50" />
      </label>
    </div>
    {copyMessage && <p role="status" className="mx-auto max-w-3xl text-xs text-foreground/55">{copyMessage}</p>}
    {actionError && <p role="alert" className="mx-auto max-w-3xl text-sm text-red-500">{actionError}</p>}
    {isLoading ? <p className="py-16 text-center text-sm text-foreground/50">Loading uploads...</p>
      : error ? <p role="alert" className="py-16 text-center text-sm text-red-500">Uploads couldn&apos;t be loaded. Please try again.</p>
        : uploads.length === 0 ? <p className="py-16 text-center text-sm text-foreground/50">No uploads found.</p>
          : <ul className="mx-auto w-full max-w-6xl columns-1 gap-6 sm:columns-2 lg:columns-4">
            {uploads.map((upload) => <li key={upload.id} className="mb-6 break-inside-avoid">
              <article className="border border-foreground/10">
                <div className="flex items-center justify-end border-b border-foreground/10 px-2 py-1">
                  <AdminRowActions
                    onEdit={() => { setEditingUpload(upload); openModal(EDIT_MODAL_ID); }}
                    onDelete={() => void deleteUpload(upload)}
                    deleteMessage={`Permanently delete upload “${upload.name}”?`}
                  />
                </div>
                <UploadPreview src={upload.publicPath} name={upload.name} alt={upload.alt || upload.name} />
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2"><h2 className="min-w-0 truncate text-sm font-bold text-foreground/75" title={upload.name}>{upload.name}</h2><span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-foreground/40">{upload.bucket}</span></div>
                  <p className="break-all font-mono text-[10px] leading-4 text-foreground/45">{upload.path}</p>
                  <div className="flex items-center justify-between border-t border-foreground/10 pt-2">
                    <button type="button" onClick={() => void copyUrl(upload)} className="inline-flex items-center gap-1.5 text-xs text-foreground/55 transition-colors hover:text-primary"><Copy aria-hidden="true" className="size-3.5" />Copy URL</button>
                    <button type="button" onClick={() => void openUpload(upload)} aria-label={`Open ${upload.name}`} className="text-foreground/55 hover:text-primary"><ExternalLink aria-hidden="true" className="size-4" /></button>
                  </div>
                </div>
              </article>
            </li>)}
          </ul>}
    {meta && <div className="mx-auto w-full max-w-3xl"><Pagination current={page} total={meta.total} pageSize={PAGE_SIZE} onPageChange={setPage} showTotal /></div>}
    <Modal id={MODAL_ID} title="Upload file" size="lg" onClose={() => closeModal(MODAL_ID)}><RegisterUploadForm onSaved={() => closeModal(MODAL_ID)} /></Modal>
    <Modal id={EDIT_MODAL_ID} title="Edit upload" size="lg" onClose={() => { closeModal(EDIT_MODAL_ID); setEditingUpload(null); }}>
      {editingUpload && <EditUploadForm key={editingUpload.id} upload={editingUpload} onSaved={() => { closeModal(EDIT_MODAL_ID); setEditingUpload(null); }} />}
    </Modal>
  </div>;
}

