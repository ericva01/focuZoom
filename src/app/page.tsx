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
    <div className="min-h-screen flex flex-col bg-[#030509] text-slate-100 selection:bg-rose-400 selection:text-black">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureGrid />
        <ProcessSection />
        <BannerMarquee />
        <ComparisonDemo />
        <DesktopProjectHub />
      </main>
      <Footer />
    </div>
  );
}
