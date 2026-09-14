import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AboutView } from "@/components/about/AboutView";

export const metadata = {
  title: "About — Eric Va & Glideo",
  description: "Message from creator Eric Va (Eric Lvis) and the story behind Glideo.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 relative select-none">
      {/* ========================================================================= */}
      {/* CELESTIAL HORIZON AURA FOR ABOUT PAGE                                     */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 h-[450px] pointer-events-none overflow-hidden flex items-start justify-center">
        <div className="absolute -top-12 w-[800px] h-[300px] bg-gradient-to-b from-rose-400/[0.14] via-rose-500/[0.04] to-transparent blur-3xl" />
        <div className="w-[1100px] h-[450px] mt-4 flex-shrink-0 opacity-70">
          <svg viewBox="0 0 1600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="aboutCrest" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0" />
                <stop offset="35%" stopColor="#fda4af" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="65%" stopColor="#fda4af" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 150 480 C 400 80, 1200 80, 1450 480" stroke="url(#aboutCrest)" strokeWidth="2.5" fill="none" />
          </svg>
        </div>
      </div>

      <Navbar />

      <main className="flex-1 py-12 lg:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutView />
        </div>
      </main>

      <Footer />
    </div>
  );
}
