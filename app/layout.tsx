import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { env } from "@/lib/config";

// Google Sheets is the live datastore. Render routes at request time so a
// temporary credential or API issue cannot make the Vercel build fail.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Kalpavruksha Real Estate",
    template: "%s | Kalpavruksha Real Estate"
  },
  description: "Find trusted residential, commercial, and land properties for sale and rent.",
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        {env.gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${env.gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${env.gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
