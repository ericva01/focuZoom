"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ProcessSection } from "@/components/landing/ProcessSection";
import { BannerMarquee } from "@/components/landing/BannerMarquee";
import { ComparisonDemo } from "@/components/landing/ComparisonDemo";
import { DesktopProjectHub } from "@/components/landing/DesktopProjectHub";
import { DesktopAppDashboard } from "@/components/desktop/DesktopAppDashboard";

import { isDesktopApp } from "@/lib/desktopBridge";

export default function LandingPage() {
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = isDesktopApp();
      const isDesktopQuery = window.location.search.includes("desktop=true");
      setIsDesktopMode(isDesktop || isDesktopQuery);
    }
  }, []);

  if (isDesktopMode) {
    return <DesktopAppDashboard />;
  }

  return (
    <div className="website-ui min-h-screen flex flex-col bg-[#030509] text-slate-100 selection:bg-rose-400 selection:text-black">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <HeroSection />
        <div className="content-auto">
          <FeatureGrid />
        </div>
        <div className="content-auto">
          <ProcessSection />
        </div>
        <BannerMarquee />
        <div className="content-auto">
          <ComparisonDemo />
        </div>
        <div className="content-auto">
          <DesktopProjectHub />
        </div>
      </main>
      <div className="content-auto">
        <Footer />
      </div>
    </div>
  );
}
