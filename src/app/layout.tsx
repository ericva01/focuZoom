import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fucuflow.app"),
  title: {
    default: "FucuFlow — Cinematic Screen Recording & Focal Auto-Zoom Studio",
    template: "%s | FucuFlow",
  },
  description:
    "Transform standard screen recordings into cinematic product videos with automatic click-to-zoom, smooth camera easing, 3D canvas tilt, and studio backgrounds. 100% private, local-first, free & open-source.",
  keywords: [
    "fucuflow",
    "focuflow",
    "screen recording studio",
    "auto zoom video editor",
    "focal zoom",
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
  ],
  authors: [{ name: "Eric Va", url: "https://github.com/ericva01" }],
  creator: "Eric Va",
  publisher: "FucuFlow",
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
    url: "https://fucuflow.app",
    siteName: "FucuFlow Studio",
    title: "FucuFlow — Cinematic Screen Recording & Focal Auto-Zoom Studio",
    description:
      "100% Free & Open Source local video recording and focal zoom editor. Create stunning software demos and product walkthroughs effortlessly.",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "FucuFlow Orange Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FucuFlow — Cinematic Screen Recording & Focal Auto-Zoom Studio",
    description:
      "Turn ordinary screen recordings into cinematic product demos with automatic zoom, 3D camera angles, and smooth motion.",
    images: ["/logo.png"],
    creator: "@ericva",
  },
  alternates: {
    canonical: "https://fucuflow.app",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km" className="dark">
      <body className="bg-dark-950 text-gray-100 min-h-screen antialiased selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
