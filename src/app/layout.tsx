import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/app-providers";
import { SITE_BRAND, SITE_URL } from "@/lib/site-config";

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
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  title: {
    default: SITE_BRAND,
    template: `%s · ${SITE_BRAND}`,
  },
  description:
    "Professionel sprøjtning af græsplæner i Give, Grindsted, Brande og omegn. Book tid online til plænepleje med godkendte produkter.",
  applicationName: SITE_BRAND,
  keywords: [
    "græsplæne",
    "plænesprøjtning",
    "ukrudt",
    "Give",
    "Grindsted",
    "Brande",
    "plænepleje",
    "Ukrudtfri",
  ],
  authors: [{ name: SITE_BRAND }],
  creator: SITE_BRAND,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "da_DK",
    siteName: SITE_BRAND,
    title: `${SITE_BRAND} · Professionel græsplænesprøjtning`,
    description:
      "Book tid til sprøjtning af din græsplæne i Give, Grindsted og Brande. Certificeret udførelse og godkendte produkter.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_BRAND} · Professionel græsplænesprøjtning`,
    description:
      "Book tid til sprøjtning af din græsplæne i Give, Grindsted og Brande. Certificeret udførelse og godkendte produkter.",
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
