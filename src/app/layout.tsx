import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fucuflow.ericva.site"),
  title: {
    default: "FucuFlow — Cinematic Screen Recording and Auto-Zoom",
    template: "%s | FucuFlow Studio",
  },
  description:
    "Transform screen recordings into cinematic product demos with automatic click-to-zoom, 3D canvas tilt, and smooth motion. Local-first and open source.",
  keywords: [
    "fucuflow",
    "focuflow",
    "screen recording studio",
    "auto zoom video editor",
    "focal auto zoom",
    "catmull-rom spline camera",
    "screen studio alternative",
    "focusee alternative",
    "cinematic screen recorder",
    "click to zoom",
    "smooth zoom camera",
    "video editor for developers",
    "3d video mockup",
    "open source screen recorder",
    "desktop screen recorder",
    "windows screen recorder",
    "mac screen recorder",
    "local-first video editor",
  ],
  authors: [{ name: "Eric Va", url: "https://github.com/ericva01" }],
  creator: "Eric Va",
  publisher: "FucuFlow Studio",
  category: "technology",
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
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.ico", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["km_KH"],
    url: "https://fucuflow.ericva.site",
    siteName: "FucuFlow Studio",
    title: "FucuFlow — Cinematic Screen Recording and Auto-Zoom",
    description:
      "Create cinematic product demos with automatic zoom, 3D camera angles, and smooth motion. 100% free and open source.",
    images: [
      {
        url: "https://fucuflow.ericva.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "FucuFlow — Cinematic Screen Recording and Auto-Zoom",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FucuFlow — Cinematic Screen Recording and Auto-Zoom",
    description:
      "Create cinematic product demos with automatic zoom, 3D camera angles, and smooth motion. 100% free and open source.",
    images: ["https://fucuflow.ericva.site/og-image.png"],
    creator: "@ericva",
  },
  alternates: {
    canonical: "https://fucuflow.ericva.site",
    languages: {
      en: "https://fucuflow.ericva.site/en",
      km: "https://fucuflow.ericva.site/kh",
      "x-default": "https://fucuflow.ericva.site",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "FucuFlow Studio",
      "operatingSystem": "Windows, macOS, Web",
      "applicationCategory": "MultimediaApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Cinematic screen recording studio with focal auto-zoom, Catmull-Rom spline curves, 3D canvas tilt, multi-track timeline, and 100% private offline storage.",
      "url": "https://fucuflow.ericva.site",
      "image": "https://fucuflow.ericva.site/og-image.png",
      "author": {
        "@type": "Person",
        "name": "Eric Va",
        "url": "https://github.com/ericva01",
      },
    },
    {
      "@type": "Organization",
      "name": "FucuFlow",
      "url": "https://fucuflow.ericva.site",
      "logo": "https://fucuflow.ericva.site/logo.png",
      "sameAs": ["https://github.com/ericva01/focuZoom"],
    },
  ],
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-dark-950 text-gray-100 min-h-screen antialiased selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
