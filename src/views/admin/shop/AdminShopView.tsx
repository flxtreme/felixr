"use client";

import { use, useEffect, useState } from "react";
import { ArrowUpRight, Download, Image as ImageIcon, Plus, Search } from "lucide-react";
import { Modal, Pagination, useModal } from "flxtheme";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { AdminPageHeader } from "@/src/features/admin/components/AdminPageHeader";
import { AdminRowActions } from "@/src/features/admin/components/AdminRowActions";
import { Select } from "@/src/components/Select";
import { useAdminProducts } from "@/src/features/admin/products/hooks/useAdminProducts";
import { useAdminProductActions } from "@/src/features/admin/products/hooks/useAdminProductActions";
import AdminProductFormView from "@/src/views/admin/shop/AdminProductFormView";
import { FiPlus } from "react-icons/fi";

const PAGE_SIZE = 10;
const PRODUCT_MODAL_ID = "admin-shop-product-form";
const price = (value: number) => value === 0 ? "FREE" : `$${value}`;

function ProductCardImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => setHasError(false), [src]);

  if (hasError || !src) {
    return <div role="img" aria-label={`${alt} image unavailable`} className="flex aspect-[4/3] w-full items-center justify-center bg-foreground/5 text-foreground/25">
      <ImageIcon aria-hidden="true" className="size-8" />
    </div>;
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setHasError(true)} className="block h-auto w-full bg-foreground/5" />;
}

export default function AdminShopView({ searchParams }: { searchParams: Promise<{ search?: string; status?: string }> }) {
  const initialParams = use(searchParams);
  const [search, setSearch] = useState(initialParams.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(initialParams.search?.trim() ?? "");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"all" | "active" | "deleted">(
    initialParams.status === "all" || initialParams.status === "deleted" ? initialParams.status : "active",
  );
  const [editingProductId, setEditingProductId] = useState<string | undefined>();
  const { openModal, closeModal } = useModal();
  const { products, meta, isLoading, error } = useAdminProducts({
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    ...(status === "all" ? {} : { isDeleted: status === "deleted" }),
  });
  const { remove } = useAdminProductActions();
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const onDelete = async (id: string, isPermanent: boolean) => {
    setActionError("");
    try { await remove(id, isPermanent); } catch (cause) { setActionError(cause instanceof Error ? cause.message : "Could not delete this product."); }
  };

  return (
    <div className="space-y-6 p-6">
      <AdminPageHeader title="shop" description="Manage products shown in your shop" actions={(
        <AdminButton onClick={() => openModal(PRODUCT_MODAL_ID)} variant="primary" className="gap-2">
          <FiPlus aria-hidden="true" />
          <span>New</span>
        </AdminButton>
      )} />
      <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
        <label className="relative min-w-0 flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search products..." aria-label="Search products" className="w-full border border-foreground/10 bg-transparent py-2 pl-9 pr-3 text-sm outline-none placeholder:text-foreground/40 focus:border-primary/50" />
        </label>
        <label className="sr-only" htmlFor="shop-product-status">Filter products by status</label>
        <Select
          id="shop-product-status"
          value={status}
          onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }}
          containerClassName="w-auto shrink-0"
          className="border border-foreground/10 bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
        >
          <option value="active">Active</option>
          <option value="deleted">Trashed</option>
          <option value="all">All</option>
        </Select>
      </div>
      {actionError && <p role="alert" className="mx-auto max-w-3xl text-sm text-red-500">{actionError}</p>}
      {isLoading ? <p className="py-16 text-center text-sm text-foreground/50">Loading products...</p>
        : error ? <p role="alert" className="py-16 text-center text-sm text-red-500">Products couldn&apos;t be loaded. Please try again.</p>
          : products.length === 0 ? <p className="py-16 text-center text-sm text-foreground/50">No products found.</p>
            : <ul className="mx-auto w-full max-w-6xl columns-1 gap-6 sm:columns-2 lg:columns-4">
              {products.map((product) => {
                const IsDownloadIcon = product.actionType === "download" ? Download : ArrowUpRight;
                return <li key={product.id} className="mb-6 break-inside-avoid">
                  <article className="border border-foreground/10">
                    <div className="flex items-center justify-between border-b border-foreground/10 px-3 py-1">
                      <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">{product.category}</span>
                      <AdminRowActions
                        onEdit={() => {
                          setEditingProductId(product.id);
                          openModal(PRODUCT_MODAL_ID);
                        }}
                        isDeleted={Boolean(product.isDeleted || product.deletedAt)}
                        onDelete={(isPermanent) => void onDelete(product.id, isPermanent)}
                        deleteMessage={product.isDeleted || product.deletedAt
                          ? `Permanently delete product “${product.title}”?`
                          : `Move product “${product.title}” to trash?`}
                      />
                    </div>
                    <ProductCardImage src={product.image} alt={product.title} />
                    <div className="p-4">
                      <h2 className="text-sm font-bold leading-tight text-foreground/75">{product.title}</h2>
                      <p className="mt-1 line-clamp-4 text-xs leading-5 text-foreground/55">{product.description}</p>
                      <div className="flex items-center justify-between gap-4 pt-4">
                        <p className="text-sm font-bold text-foreground/75">{price(product.price)}</p>
                        <a href={product.link} {...(product.actionType === "download" ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })} className="group inline-flex items-center gap-2 text-sm font-bold text-primary transition-[gap] hover:gap-3">
                          {product.actionLabel}<IsDownloadIcon aria-hidden="true" className="size-4 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </article>
                </li>;
              })}
            </ul>}
      {meta && <div className="mx-auto w-full max-w-3xl"><Pagination current={page} total={meta.total} pageSize={PAGE_SIZE} onPageChange={setPage} showTotal /></div>}
      <Modal id={PRODUCT_MODAL_ID} title={editingProductId ? "Edit product" : "Create product"} size="xl" onClose={() => { closeModal(PRODUCT_MODAL_ID); setEditingProductId(undefined); }}>
        <AdminProductFormView key={editingProductId ?? "new-product"} id={editingProductId} onSaved={() => { closeModal(PRODUCT_MODAL_ID); setEditingProductId(undefined); }} />
      </Modal>
    </div>
  );
}
