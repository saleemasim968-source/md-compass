import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { MainNav } from "@/components/MainNav";
import { SkipLink } from "@/components/SkipLink";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MD Compass",
    template: "%s | MD Compass",
  },
  // TODO(content): site description for search engines — source + clinical review required
  description: "MD Compass",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never block pinch-zoom (WCAG 1.4.4).
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // TODO(decision): languages — English only assumed (docs/PRD.md §10).
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SkipLink />

        <header className="border-b border-line">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4">
            <Link href="/" className="text-xl font-bold text-ink no-underline">
              MD Compass
            </Link>
            <MainNav />
          </div>
        </header>

        {/* tabIndex={-1} lets the skip link move keyboard focus here. */}
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted">
            <p>
              {/* TODO(content): footer disclaimer — source + clinical review required */}
              TODO(content): footer disclaimer
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
