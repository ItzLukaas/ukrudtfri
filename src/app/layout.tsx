import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";
import { DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE, SITE_KEYWORDS, defaultOpenGraph, defaultTwitter } from "@/lib/seo";

const dmSans = DM_Sans({
  variable: "--font-lw",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#082e1e" },
    { media: "(prefers-color-scheme: dark)", color: "#082e1e" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico", type: "image/x-icon" },
      { url: "/images/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    shortcut: [{ url: "/images/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/images/logo.png", sizes: "180x180", type: "image/png" }],
  },
  title: {
    default: DEFAULT_SEO_TITLE,
    template: `%s | ${SITE_BRAND}`,
  },
  description: DEFAULT_SEO_DESCRIPTION,
  applicationName: SITE_BRAND,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: SITE_BRAND }],
  creator: SITE_BRAND,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    ...defaultOpenGraph,
  },
  twitter: {
    ...defaultTwitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
