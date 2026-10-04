import { Fira_Code, Fira_Sans } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { Analytics } from "@/src/lib/analytics/Analytics";
import { Suspense } from "react";
import FelixrLayout from "./FelixrLayout";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

const firaSans = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const siteUrl = "https://felixr.vercel.app";
const title = "Felix Ruz — Full Stack & Agentic Engineer";
const description =
  "Software Engineer with nearly 8 years of experience building high-impact web and mobile apps. Specializing in React, Next.js, Node.js, and agentic AI-driven development workflows.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  title: {
    default: title,
    template: "%s | Felix Ruz",
  },
  description,
  keywords: [
    "Felix Ruz",
    "Full Stack Developer",
    "Agentic Engineer",
    "Software Engineer Philippines",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Flutter Developer",
    "AI-assisted development",
    "Vibe Coding",
    "Web Developer Portfolio",
    "Tech Blog",
  ],
  authors: [{ name: "Felix Ruz", url: siteUrl }],
  creator: "Felix Ruz",
  publisher: "Felix Ruz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Felix Ruz",
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
    creator: "@felixruz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Felix Ruz",
  url: siteUrl,
  jobTitle: "Full Stack & Agentic Engineer",
  sameAs: [] as string[],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${firaCode.variable} ${firaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <FelixrLayout>{children}</FelixrLayout>
      </body>
    </html>
  );
}
