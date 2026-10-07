import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./revamp.css";

const SITE = "https://revampautocarwash.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Revamp Auto Car Wash — Clean Cars Hit Different | Bosmont, Johannesburg",
  description:
    "Revamp Auto Car Wash in Bosmont, Johannesburg. Half House wash R65, Full House wash R120. Hand-washed, snow-foamed and dried by hand. Clean cars hit different.",
  keywords: [
    "car wash",
    "hand car wash",
    "Johannesburg",
    "Bosmont",
    "Revamp Auto Car Wash",
    "Half House wash",
    "Full House wash",
    "detail studio",
  ],
  authors: [{ name: "Revamp Auto Car Wash" }],
  creator: "Azariah Anderson and Joshua Boraine",
  publisher: "Revamp Auto Car Wash",
  applicationName: "Revamp Auto Car Wash",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/icons/icon-32.png"],
    apple: [{ url: "/icons/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/icon-32.png", color: "#ffc72c" }],
  },
  appleWebApp: {
    capable: true,
    title: "Revamp",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Revamp Auto Car Wash — Clean Cars Hit Different",
    description:
      "Half House R65 · Full House R120 · Bigger vehicles +R20. 89 Stormberg Avenue, Bosmont.",
    url: "/",
    siteName: "Revamp Auto Car Wash",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Revamp Auto Car Wash — gloss-black car under golden light, Bosmont Johannesburg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Revamp Auto Car Wash — Clean Cars Hit Different",
    description: "Half House R65 · Full House R120 · Bigger vehicles +R20. Bosmont, Johannesburg.",
    images: ["/images/og.jpg"],
  },
  other: {
    "msapplication-TileColor": "#0a0a0b",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/anton-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="loading">
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "#loader{display:none!important}body.loading{overflow:auto!important}",
            }}
          />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        {children}
      </body>
    </html>
  );
}
