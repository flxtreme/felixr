import Link from "next/link";
import { cln } from "@/src/utils/cln";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getHref = (page: number) => `${basePath}?page=${page}`;

  return (
    <nav className="flex items-center gap-6 pt-8 border-t border-border">
      {currentPage > 1 && (
        <Link
          href={getHref(currentPage - 1)}
          className="text-sm font-medium text-foreground/60 hover:text-primary hover:underline underline-offset-4 transition-all"
        >
          Previous
        </Link>
      )}

      <div className="flex items-center gap-4">
        {pages.map((page) => (
          <Link
            key={page}
            href={getHref(page)}
            className={cln(
              "text-sm font-mono transition-all hover:text-primary",
              currentPage === page ? "text-primary font-bold" : "text-foreground/40"
            )}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <Link
          href={getHref(currentPage + 1)}
          className="text-sm font-medium text-foreground/60 hover:text-primary hover:underline underline-offset-4 transition-all"
        >
          Next
        </Link>
      )}
    </nav>
  );
};