"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useModal } from "flxtheme";
import { File as FileIcon } from "lucide-react";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { Select } from "@/src/components/Select";
import { cln } from "@/src/utils/cln";
import { AdminUploadPickerModal } from "@/src/features/admin/uploads/AdminUploadPickerModal";
import type { AdminUpload } from "@/src/features/admin/uploads/types";
import { useAdminProduct } from "@/src/features/admin/products/hooks/useAdminProducts";
import { useAdminProductActions } from "@/src/features/admin/products/hooks/useAdminProductActions";
import type { ProductFormValues } from "@/src/features/admin/products/types";

const EMPTY: ProductFormValues = { title: "", description: "", price: 0, category: "", image: "", link: "", actionType: "redirect", actionLabel: "Buy" };
const fieldClass = cln("w-full border border-foreground/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary/50");
const IMAGE_PICKER_MODAL_ID = "admin-product-image-picker";
const LINK_PICKER_MODAL_ID = "admin-product-link-picker";

function uploadUrl(upload: AdminUpload) {
  return upload.bucket.toLowerCase() === "media" ? upload.publicPath : `/sign/${encodeURIComponent(upload.id)}`;
}

export default function AdminProductFormView({ id, onSaved }: { id?: string; onSaved?: () => void }) {
  const { product, isLoading, error: loadError } = useAdminProduct(id ?? "");
  const { create, update } = useAdminProductActions();
  const { openModal } = useModal();
  const [values, setValues] = useState<ProductFormValues>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) setValues({ title: product.title, description: product.description, price: product.price, category: product.category, image: product.image, link: product.link, actionType: product.actionType, actionLabel: product.actionLabel });
  }, [product]);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (id) await update(id, values); else await create(values);
      setValues(EMPTY);
      onSaved?.();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save this product."); }
    finally { setSaving(false); }
  };

  if (id && isLoading) return <p className="p-8 text-center text-sm text-foreground/50">Loading product...</p>;
  if (id && (loadError || !product)) return <p role="alert" className="p-8 text-center text-sm text-red-500">Product couldn&apos;t be loaded.</p>;

  return <div className="mx-auto w-full max-w-5xl p-2 sm:p-4">
    <form onSubmit={submit} className="space-y-5 border-y border-foreground/10 py-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-xs text-foreground/60">Title<input required value={values.title} onChange={(e) => set("title", e.target.value)} className={fieldClass} /></label>
        <label className="space-y-2 text-xs text-foreground/60">Category<input required value={values.category} onChange={(e) => set("category", e.target.value)} className={fieldClass} /></label>
      </div>
      <label className="block space-y-2 text-xs text-foreground/60">Description<textarea required rows={4} value={values.description} onChange={(e) => set("description", e.target.value)} className={fieldClass} /></label>
      <label className="block space-y-2 text-xs text-foreground/60">Image URL
        <div className="relative">
          <input required type="text" inputMode="url" pattern="^(\/[^\s]*|https?:\/\/[^\s]+)$" title="Enter a path beginning with / or a complete http(s) URL." placeholder="/images/product.png or https://example.com/image.png" value={values.image} onChange={(e) => set("image", e.target.value)} className={cln(fieldClass, "pr-10")} />
          <button type="button" title="Choose file" aria-label="Choose image file" onClick={() => openModal(IMAGE_PICKER_MODAL_ID)} className="absolute right-2 top-1/2 -translate-y-1/2 border-0 bg-transparent p-1 text-foreground/45 transition-colors hover:text-primary"><FileIcon aria-hidden="true" className="size-4" /></button>
        </div>
        <span className="block text-[10px] text-foreground/40">Use a site path beginning with / or a complete http(s) URL.</span>
      </label>
      <label className="block space-y-2 text-xs text-foreground/60">Product link
        <div className="relative">
          <input required type="text" inputMode="url" pattern="^(\/[^\s]*|https?:\/\/[^\s]+)$" title="Enter a path beginning with / or a complete http(s) URL." placeholder="/shop/item or https://example.com/item" value={values.link} onChange={(e) => set("link", e.target.value)} className={cln(fieldClass, "pr-10")} />
          <button type="button" title="Choose file" aria-label="Choose product link file" onClick={() => openModal(LINK_PICKER_MODAL_ID)} className="absolute right-2 top-1/2 -translate-y-1/2 border-0 bg-transparent p-1 text-foreground/45 transition-colors hover:text-primary"><FileIcon aria-hidden="true" className="size-4" /></button>
        </div>
        <span className="block text-[10px] text-foreground/40">Use a site path beginning with / or a complete http(s) URL.</span>
      </label>
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="space-y-2 text-xs text-foreground/60">Price<input required type="number" min="0" step="0.01" value={values.price} onChange={(e) => set("price", Number(e.target.value))} className={fieldClass} /></label>
        <label className="space-y-2 text-xs text-foreground/60">Action type<Select value={values.actionType} onChange={(e) => set("actionType", e.target.value as ProductFormValues["actionType"])} className={fieldClass}><option value="redirect">Redirect</option><option value="download">Download</option></Select></label>
        <label className="space-y-2 text-xs text-foreground/60">Action label<input required value={values.actionLabel} onChange={(e) => set("actionLabel", e.target.value)} className={fieldClass} /></label>
      </div>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-between pt-2"><button type="button" onClick={() => { setValues(EMPTY); setError(""); onSaved?.(); }} className="text-sm text-foreground/60 hover:text-primary">Cancel</button><AdminButton type="submit" variant="primary" loading={saving}>{saving ? "Saving..." : id ? "Save changes" : "Create product"}</AdminButton></div>
    </form>
    <AdminUploadPickerModal id={IMAGE_PICKER_MODAL_ID} title="Choose product image" imageOnly onSelect={(upload) => set("image", uploadUrl(upload))} />
    <AdminUploadPickerModal id={LINK_PICKER_MODAL_ID} title="Choose product link" onSelect={(upload) => set("link", uploadUrl(upload))} />
  </div>;
}
