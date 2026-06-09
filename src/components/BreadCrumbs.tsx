import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex text-xs font-mono font-medium text-foreground/40 uppercase">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="opacity-50">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground/60">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};