import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { ModalProvider } from "@/src/contexts/ModalContext";
import { ErrorBoundary } from "@/src/contexts/ErrorBoundary";
import { GlobalErrorHandler } from "../contexts/GlobalErrorHandler";
import { Metadata } from "next";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://felixr.vercel.app"),
  title: {
    default: "Felix Ruz — Full Stack & Agentic Engineer",
    template: "%s | Felix Ruz",
  },
  description:
    "Software Engineer with nearly 8 years of experience building high-impact web and mobile apps. Specializing in React, Next.js, Node.js, and agentic AI-driven development workflows.",
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
  authors: [{ name: "Felix Ruz", url: "https://felixr.vercel.app" }],
  creator: "Felix Ruz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://felixr.vercel.app",
    siteName: "Felix Ruz",
    title: "Felix Ruz — Full Stack & Agentic Engineer",
    description:
      "Software Engineer with nearly 8 years of experience building high-impact web and mobile apps. Specializing in React, Next.js, Node.js, and agentic AI-driven development workflows.",
    images: [
      {
        url: "/og-image.png", // 1200x630px recommended
        width: 1200,
        height: 630,
        alt: "Felix Ruz — Full Stack & Agentic Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Felix Ruz — Full Stack & Agentic Engineer",
    description:
      "Software Engineer with nearly 8 years of experience building high-impact web and mobile apps. Specializing in React, Next.js, Node.js, and agentic AI-driven development workflows.",
    images: ["/og-image.jpg"],
    creator: "@felixruz", // update if you have a handle
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
    canonical: "https://felixr.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ModalProvider>
            <GlobalErrorHandler />
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}