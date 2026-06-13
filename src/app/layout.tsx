import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import { ModalProvider } from "@/src/contexts/ModalContext";
import { ErrorBoundary } from "@/src/contexts/ErrorBoundary";
import { GlobalErrorHandler } from "../contexts/GlobalErrorHandler";

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