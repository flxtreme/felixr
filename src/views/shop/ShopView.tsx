"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ListFilter,
  Search,
} from "lucide-react";
import { PageHeader } from "@/src/components/PageHeader";
import { Breadcrumb, BreadcrumbItem } from "@/src/components/FlxBreadcrumb";
import { SectionDivider } from "@/src/components/SectionDivider";
import { useProducts } from "@/src/features/public/products/hooks/useProducts";

const PAGE_SIZE = 8;

const formatPrice = (price: number) => (price === 0 ? "FREE" : `$${price}`);


export default function ShopView() {
  const { products, isLoading, error } = useProducts();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categories = Array.from(new Set(products.map((product) => product.category)));

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selected.length === 0 || selected.includes(product.category);
      const matchesQuery =
        !q ||
        [product.title, product.description, product.category]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, selected]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const goTo = (next: number) => {
    setPage(Math.min(Math.max(next, 1), totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = (category: string) => {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
    setPage(1);
  };

  return (
    <main className="overflow-hidden">
      <PageHeader eyebrow="shop" title="Things I made for you.">
        <Breadcrumb>
          <BreadcrumbItem href="/">home</BreadcrumbItem>
          <BreadcrumbItem>shop</BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <SectionDivider />

      <section className="border-b border-dashed border-foreground/10">
        <div className="mx-auto mb-10 max-w-3xl pt-12 px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/45"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full border border-foreground/10 bg-transparent py-2 pl-9 pr-3 text-sm text-foreground/75 outline-none transition-colors placeholder:text-foreground/40 focus:border-primary/50"
              />
            </div>

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="true"
                aria-expanded={open}
                className="flex items-center gap-2 border border-foreground/10 px-3 py-2 text-sm text-foreground/75 transition-colors hover:border-primary/50"
              >
                <ListFilter className="size-4" />
                Category
                {selected.length > 0 && (
                  <span className="font-bold text-primary">
                    {selected.length}
                  </span>
                )}
              </button>
              {open && (
                <fieldset className="absolute right-0 z-10 mt-2 w-64 border border-foreground/10 bg-background p-3 shadow-lg">
                  <legend className="sr-only">Filter by category</legend>
                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category}>
                        <label className="flex cursor-pointer items-center gap-3 px-1 py-1.5 text-sm text-foreground/75 hover:bg-foreground/5">
                          <input
                            type="checkbox"
                            checked={selected.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="size-4 accent-primary"
                          />
                          {category}
                        </label>
                      </li>
                    ))}
                  </ul>
                  {selected.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelected([]);
                        setPage(1);
                      }}
                      className="mt-2 w-full border-t border-foreground/10 pt-2 text-left text-xs font-bold text-primary"
                    >
                      Clear filters
                    </button>
                  )}
                </fieldset>
              )}
            </div>
          </div>
        </div>
        <div id="shop" className="mx-auto max-w-6xl px-6 pb-12">

          {isLoading ? (
            <p className="py-16 text-center text-sm text-foreground/55">Loading products...</p>
          ) : error ? (
            <p className="py-16 text-center text-sm text-foreground/55">Products couldn&apos;t be loaded. Please try again later.</p>
          ) : visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-foreground/55">
              It will be added soon.
            </p>
          ) : (
            <ul className="columns-1 gap-6 sm:columns-2 lg:columns-4">
              {visible.map((product) => {
                const isDownload = product.actionType === "download";
                const ActionIcon = isDownload ? Download : ArrowUpRight;

                return (
                  <li key={product.id} className="mb-6 break-inside-avoid">
                    <article className="border border-foreground/10">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="block h-auto w-full bg-foreground/5"
                      />
                      <div className="p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">
                          {product.category}
                        </p>
                        <h3 className="mt-2 text-sm font-bold leading-tight text-foreground/75">
                          {product.title}
                        </h3>
                        <p className="mt-1 line-clamp-4 text-xs leading-5 text-foreground/55">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between gap-4 pt-4">
                          <p className="text-sm font-bold text-foreground/75">
                            {formatPrice(product.price)}
                          </p>
                          <a
                            href={product.link}
                            {...(isDownload
                              ? { download: true }
                              : { target: "_blank", rel: "noopener noreferrer" })}
                            className="group inline-flex items-center gap-2 text-sm font-bold text-primary transition-[gap] hover:gap-3"
                          >
                            {product.actionLabel}
                            <ActionIcon className="size-4 shrink-0" />
                          </a>
                        </div>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-8 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex size-9 items-center justify-center border border-foreground/10 text-foreground/65 transition-colors hover:border-primary/50 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => goTo(number)}
                    aria-current={number === currentPage ? "page" : undefined}
                    className={`flex size-9 items-center justify-center border text-sm font-bold transition-colors ${number === currentPage
                      ? "border-primary text-primary"
                      : "border-foreground/10 text-foreground/65 hover:border-primary/50"
                      }`}
                  >
                    {number}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex size-9 items-center justify-center border border-foreground/10 text-foreground/65 transition-colors hover:border-primary/50 disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
