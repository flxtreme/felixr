import Link from "next/link";
import { SOCIAL_ICONS } from "@/src/common/icons";
import { stringToKey } from "@/src/utils/string";

const pageLinks = [
  { label: "Projects", path: "/projects" },
  { label: "Posts", path: "/blog" },
  { label: "About", path: "/about" },
];

const socialLinks = [
  { label: "GitHub", path: "https://github.com/flxtreme" },
  { label: "LinkedIn", path: "https://linkedin.com/in/flxtremee" },
  { label: "X", path: "https://x.com/flxtremee" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Top row: name + page nav */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-lg font-bold text-primary">felixr</span>
          <nav className="flex gap-6">
            {pageLinks.map((link) => (
              <Link
                key={link.label}
                href={link.path}
                className="text-sm font-medium text-foreground/50 hover:text-primary hover:underline underline-offset-4 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Bottom row: socials + copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {socialLinks.map(({ label, path }) => {
              const iconKey = stringToKey(label);
              const Icon = SOCIAL_ICONS[iconKey];
              return (
                <Link
                  key={label}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-foreground/40 hover:text-primary transition-colors group"
                >
                  {Icon && <Icon className="w-4 h-4 group-hover:text-primary transition-colors" />}
                  <span className="group-hover:underline underline-offset-4">{label}</span>
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-foreground/35 font-medium">
            © {new Date().getFullYear()} felixr — Built with Next.js
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;