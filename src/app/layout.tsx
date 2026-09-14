import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glideo — Cinematic Screen Recording Post-Processing Studio",
  description:
    "Turn standard screen recordings into cinematic masterpieces with automatic click-to-zoom, smooth spring-easing pans, and sleek cursor effects. 100% private in-browser editing.",
  keywords: ["screen studio", "focusee", "screen recording", "video editor", "auto zoom", "zoom effects"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-gray-100 min-h-screen antialiased selection:bg-glideo-coral selection:text-white">
        {children}
      </body>
    </html>
  );
}
