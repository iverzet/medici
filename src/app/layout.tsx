import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  robots: { index: site.indexable, follow: site.indexable },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={geist.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a href="#continut" className="sr-only z-50 rounded bg-white p-3 text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Sari la conținut</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieConsent />
        <GoogleAnalytics measurementId="G-C9QQRQJTM0" siteName="Proctologi.ro" medical waitForCityChoice />
        <Analytics />
      </body>
    </html>
  );
}
