"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { DesktopProjectHub } from "@/components/landing/DesktopProjectHub";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ComparisonDemo } from "@/components/landing/ComparisonDemo";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DesktopAppDashboard } from "@/components/desktop/DesktopAppDashboard";

export default function LandingPage() {
  const [isDesktopMode, setIsDesktopMode] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isElectron = Boolean(window.electronAPI?.isElectron);
      const isDesktopQuery = window.location.search.includes("desktop=true");
      setIsDesktopMode(isElectron || isDesktopQuery);
    }
  }, []);

  // When running inside Electron desktop app, render the dedicated Desktop Workspace Dashboard
  if (isDesktopMode) {
    return <DesktopAppDashboard />;
  }

  // When visiting via web browser, render marketing landing page
  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 selection:bg-sky-400 selection:text-black">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DesktopProjectHub />
        <FeatureGrid />
        <ComparisonDemo />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
