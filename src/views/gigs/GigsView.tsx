import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Mail } from "lucide-react";

const services = [
  {
    title: "Digital products",
    description:
      "I sell digital products like landing pages, wallpapers, ebooks, and other useful digital assets.",
    details: ["Landing pages", "Wallpapers", "Other digital assets"],
    link: "https://flxrz.gumroad.com",
    linkLabel: "View digital products",
    external: true,
  },
  {
    title: "Design to live website",
    description:
      "I convert your Figma designs, HTML templates, and PSDs into live, working websites.",
    details: ["React and Angular", "Wordpress and Unbounce", "Flutter and Responsive implementation"],
    link: "https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr%40gmail.com&su=Request%20a%20website&body=Hi%20Felix%2C%0A%0AI%27d%20like%20to%20discuss%20turning%20my%20design%20into%20a%20live%20website.%0A%0AProject%20details%3A%0A",
    linkLabel: "Request a website",
    external: true,
  },
  {
    title: "Work on your project",
    description: "You can hire me to help build, improve, or ship a part of your project.",
    details: ["Feature development", "UI implementation", "Technical collaboration"],
    link: "https://mail.google.com/mail/?view=cm&fs=1&to=flxrzjr%40gmail.com&su=Project%20collaboration&body=Hi%20Felix%2C%0A%0AI%27d%20like%20to%20discuss%20having%20you%20help%20with%20my%20project.%0A%0AProject%20details%3A%0A",
    linkLabel: "Hire me for your project",
    external: true,
  },
];

export default function GigsView() {
  return (
    <main className="overflow-hidden">
      <section className="hero-dot-grid">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 lg:pb-24 lg:pt-24">
          <p className="eyebrow">Available for work</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.04em] text-foreground sm:text-7xl">
            Bring me a
            <br />
            <span className="text-primary">good problem.</span>
          </h1>
          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <p className="max-w-xl text-lg leading-8 text-foreground/60">
              I help turn fuzzy ideas into useful products, dependable systems, and calmer ways of
              working with technology.
            </p>
            <Link
              href="mailto:flxrzjr@gmail.com"
              className="inline-flex shrink-0 items-center gap-2 self-start bg-primary px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 md:self-end"
            >
              Start a conversation <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface/45">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 max-w-xl">
            <p className="eyebrow">What I can help with</p>
            <h2 className="section-title">
              Useful work,
              <br />
              <span className="text-primary">carefully shipped.</span>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="border border-border bg-background p-6">
                <h3 className="text-2xl font-bold">{service.title}</h3>
                <p className="mt-4 min-h-20 text-sm leading-6 text-foreground/55">
                  {service.description}
                </p>
                {service.link && (
                  <a
                    href={service.link}
                    target={service.external ? "_blank" : undefined}
                    rel={service.external ? "noopener noreferrer" : undefined}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3"
                  >
                    {service.linkLabel} <ArrowUpRight className="size-4" />
                  </a>
                )}
                <ul className="mt-8 space-y-3 border-t border-border pt-5 text-sm text-foreground/65">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 line-clamp-1">
                      <Check className="size-4 text-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="eyebrow">How I work</p>
            <h2 className="section-title">
              Clear steps,
              <br />
              <span className="text-primary">no theater.</span>
            </h2>
          </div>
          <div className="space-y-8 text-foreground/65">
            <p className="text-xl font-semibold leading-8 text-foreground/80">
              We start with the useful outcome, make the tradeoffs visible, and keep the first
              version small enough to learn from.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="font-bold text-foreground">Align</p>
                <p className="mt-2 text-sm leading-6">
                  Clarify the problem, users, and constraints.
                </p>
              </div>
              <div>
                <p className="font-bold text-foreground">Build</p>
                <p className="mt-2 text-sm leading-6">Ship the smallest version worth using.</p>
              </div>
              <div>
                <p className="font-bold text-foreground">Improve</p>
                <p className="mt-2 text-sm leading-6">Use real feedback to make it dependable.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/65">
              Let&apos;s talk
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Have something worth building?
            </h2>
          </div>
          <Link
            href="mailto:flxrzjr@gmail.com"
            className="inline-flex shrink-0 items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5"
          >
            <Mail className="size-4" /> Email me
          </Link>
        </div>
      </section>
    </main>
  );
}
