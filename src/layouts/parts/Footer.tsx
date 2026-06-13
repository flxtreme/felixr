import Link from "next/link";

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
    <footer className="border-t border-border">
      <div className="max-w-3xl mx-auto px-6 pt-4 pb-12 flex flex-col gap-4">
        <nav className="flex gap-8">
          {pageLinks.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className="text-sm font-medium text-foreground/60 hover:text-primary hover:underline underline-offset-4 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border pt-4">
          <div className="flex gap-8">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-foreground/60 hover:text-primary hover:underline underline-offset-4 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-foreground/40 font-medium">
            © {new Date().getFullYear()} felixr
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
