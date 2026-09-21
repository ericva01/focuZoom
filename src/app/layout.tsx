import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://glideo.app"),
  title: "Glideo — Cinematic Screen Recording Post-Processing Studio",
  description:
    "Turn standard screen recordings into cinematic masterpieces with automatic click-to-zoom, smooth spring-easing pans, and sleek cursor effects. 100% private in-browser editing.",
  keywords: ["screen studio", "focusee", "screen recording", "video editor", "auto zoom", "zoom effects"],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.ico", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Glideo — Video Collaboration & Screen Studio",
    description: "100% Free & Open Source local video recording and focal zoom editor.",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: "Glideo Orange Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-gray-100 min-h-screen antialiased selection:bg-[#FFF1E8] selection:text-[#FF6B2C]">
        {children}
      </body>
    </html>
  );
}
