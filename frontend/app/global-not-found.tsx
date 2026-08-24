import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { getDictionary, defaultLocale } from "@/lib/i18n";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

// Bypasses the layout, so it must be a full document and carry its own theme decision.
const themeScript = `try{var t=localStorage.theme;if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

const dictionary = getDictionary(defaultLocale);

export const metadata: Metadata = {
  title: `${dictionary.notFound.title} - Unback`,
  description: dictionary.notFound.body,
};

export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} suppressHydrationWarning className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <span className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <svg viewBox="0 0 32 32" aria-hidden className="size-8">
            <rect width="32" height="32" rx="8" className="fill-primary/12" />
            <g className="fill-primary">
              <path d="M8 8h8v8H8z" />
              <path d="M16 16h8v8h-8z" />
            </g>
          </svg>
          <span>
            Un<span className="text-primary">back</span>
          </span>
        </span>
        <p className="text-5xl font-bold tracking-tight">404</p>
        <p className="max-w-sm text-muted-foreground">{dictionary.notFound.body}</p>
        {/* This page bypasses the router, so a plain anchor is correct - next/link would not work. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {dictionary.notFound.home}
        </a>
        <Analytics />
      </body>
    </html>
  );
}
