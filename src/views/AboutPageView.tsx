"use client";

import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { AboutView } from "@/components/about/AboutView";

export function AboutPageView() {
  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#F8F9FB] text-[#111318] selection:bg-[#FFF1E8] selection:text-[#FF6B2C] relative">
      <Navbar />

      <main id="main-content" className="flex-1 py-14 lg:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutView />
        </div>
      </main>

      <Footer />
    </div>
  );
}
