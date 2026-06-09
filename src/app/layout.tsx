import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://felixr.dev"),
  title: {
    default: "Felix Conde Ruz Jr. | Senior Full-Stack Software Engineer",
    template: "%s | Felixr",
  },
  description: "Professional portfolio and technical blog of Felix Conde Ruz Jr., a Senior Full-Stack Software Engineer specializing in Cloud, React, Next.js, Node.js, Angular, and Flutter.",
  keywords: [
    "Felix Ruz",
    "Felix Conde Ruz Jr",
    "Felix Ruz Programmer",
    "Felix Ruz Developer",
    "Felix Ruz Projects",
    "Felix Ruz Software Engineer",
    "Felix Ruz Senior Software Engineer",
    "Felix Ruz Full-Stack Developer",
    "Felix Ruz React",
    "Felix Ruz Next.js",
    "Felix Ruz Angular",
    "Felix Ruz Node.js",
    "Felix Ruz Flutter",
    "Felix Ruz Blog",
  ],
  authors: [{ name: "Felix Conde Ruz Jr." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://felixr.dev",
    siteName: "Felixr",
  },
  twitter: {
    card: "summary_large_image",
    site: "@flxtremee",
    creator: "@flxtremee",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
